import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { idRegex } from 'src/utils/regex';
import { serialize, serializeGetTransactions, serializeWallets } from 'src/utils/serialize/wallet';
import { ValidateQueries } from 'src/utils/validations/validateQueries';
import { Underage } from 'src/utils/validations/validateUnderage';
import { Repository } from 'typeorm';
import { CoinService } from './coin.service';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { UpdateWalletDto } from '../dto/update-wallet.dto';
import { Coin } from '../entities/coin.entity';
import { Wallet } from '../entities/wallet.entity';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
        @InjectRepository(Coin) private coinRepo: Repository<Coin>,
        private coinService: CoinService
    ) {}

    async create(createWalletDto: CreateWalletDto) {
        const { birthdate, cpf } = createWalletDto;
        Underage(birthdate);
        const alreadyExists = await this.walletRepo.findOne({ cpf });
        if (alreadyExists) {
            throw new HttpException('A wallet is already registrated with this cpf', HttpStatus.BAD_REQUEST);
        }
        const result = this.walletRepo.create(createWalletDto);
        await this.walletRepo.save(result);
        return serialize(result);
    }

    async findAll(queries) {
        ValidateQueries(queries);
        let { limit, page } = queries;
        delete queries.limit;
        delete queries.page;
        limit = limit || 10;
        page = page || 1;
        const skip = (page - 1) * limit;

        const result = await this.walletRepo.findAndCount({
            where: queries,
            take: limit,
            skip: skip,
            relations: ['coins']
        });
        const serializedResult = serializeWallets({ wallets: result['0'], total: result['1'] });
        return serializedResult;
    }

    async findOne(id: string) {
        if (!idRegex(id)) {
            throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
        }
        const result = await this.walletRepo.findOne(
            { id },
            {
                relations: ['coins']
            }
        );
        if (!result) {
            throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
        }
        return result;
    }

    async update(id: string, updateWalletDto: UpdateWalletDto[]) {
        if (!idRegex(id)) {
            throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
        }
        const wallet = await this.walletRepo.findOne({ id: id });
        if (!wallet) {
            throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
        }

        await this.coinService.getCoins(wallet, updateWalletDto);
        return await this.updateWallet(wallet);
    }

    private async updateWallet(wallet: Wallet) {
        wallet.updatedAt = new Date();
        return await this.walletRepo.save(wallet);
    }

    async remove(id: string) {
        if (!idRegex(id)) {
            throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
        }
        const result = await this.walletRepo.delete(id);
        if (result.affected === 0) {
            throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
        }
        return {};
    }

    async createTransaction(id, createTransactionDto) {
        const { receiverAddress } = createTransactionDto;
        await this.checkWalletProblems(id, createTransactionDto);
        await this.coinService.transactionHandler(id, createTransactionDto);
        const sender = await this.walletRepo.findOne({ id });
        await this.updateWallet(sender);
        const receiver = await this.walletRepo.findOne({ id: receiverAddress });
        return await this.updateWallet(receiver);
    }

    async getTransactions(id) {
        const createTransactionDto = false;
        await this.checkWalletProblems(id, createTransactionDto);
        const coins = await this.coinRepo.find({ wallet: id });
        const result = [];
        for (let i = 0; i < coins.length; i++) {
            result.push(serializeGetTransactions(coins[i]));
        }
        return result;
    }

    async checkWalletProblems(id, createTransactionDto) {
        if (!idRegex(id)) {
            throw new HttpException(`Invalid ID format for ${id}`, HttpStatus.BAD_REQUEST);
        }
        if (!idRegex(createTransactionDto.receiverAddress) && createTransactionDto) {
            throw new HttpException(
                `Invalid ID format for ${createTransactionDto.receiverAddress}`,
                HttpStatus.BAD_REQUEST
            );
        }
        let result = await this.walletRepo.findOne({ id });
        if (!result) {
            throw new HttpException(`There's no wallet with id: ${id}`, HttpStatus.NOT_FOUND);
        }
        if (createTransactionDto) {
            result = await this.walletRepo.findOne({ id: createTransactionDto.receiverAddress });
            if (!result) {
                throw new HttpException(
                    `There's no wallet with id: ${createTransactionDto.receiverAddress}`,
                    HttpStatus.NOT_FOUND
                );
            }
            if (id === createTransactionDto.receiverAddress) {
                throw new HttpException(`Unable to transfer funds to your own wallet`, HttpStatus.BAD_REQUEST);
            }
        }
    }
}

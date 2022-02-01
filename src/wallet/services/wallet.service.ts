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
        const wallets = this.walletRepo
            .createQueryBuilder('wallet')
            .where('wallet.isDeleted = :bool', { bool: false })
            .leftJoinAndSelect('wallet.coins', 'coin')
            .leftJoinAndSelect('coin.transactions', 'transaction');
        Object.keys(queries).forEach((query) => {
            const subquery = this.walletRepo
                .createQueryBuilder('wallet')
                .select('wallet.id')
                .leftJoin('wallet.coins', 'coins')
                .leftJoin('coins.transactions', 'transactions');
            subquery.andWhere(`${query} = :${query}`);
            wallets.setParameter(`${query}`, queries[query]);
            wallets.andWhere(`wallet.id  in (${subquery.getQuery()})`);
            wallets.setParameters(subquery.getParameters());
        });
        const result = await wallets.getMany();
        const serializedResult = serializeWallets({ wallets: result });
        return serializedResult;
    }

    async findOne(id: string) {
        const result = await this.walletRepo.findOne(
            { id, isDeleted: false },
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
        const wallet = await this.walletRepo.findOne({ id, isDeleted: false });
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
        const check = await this.walletRepo.findOne({ id, isDeleted: false });
        if (!check) {
            throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
        }
        check.isDeleted = true;
        await this.walletRepo.save(check);
        return {};
    }

    async createTransaction(id, createTransactionDto) {
        const { receiverAddress } = createTransactionDto;
        await this.validateWallets({ id, receiverAddress });
        await this.coinService.transactionHandler(id, createTransactionDto);
        const sender = await this.walletRepo.findOne({ id });
        await this.updateWallet(sender);
        const receiver = await this.walletRepo.findOne({ id: receiverAddress });
        return await this.updateWallet(receiver);
    }

    async getTransactions(id, getTransactionDto) {
        const result = await this.walletRepo.findOne({ id });
        if (!result) {
            throw new HttpException(`There's no wallet with id: ${id}`, HttpStatus.NOT_FOUND);
        }
        const coins = await this.coinRepo.find({ wallet: id });
        const transactions = [];
        for (let i = 0; i < coins.length; i++) {
            if (Object.keys(getTransactionDto).length !== 0 && coins[i].coin !== getTransactionDto.coin) continue;
            transactions.push(serializeGetTransactions(coins[i]));
        }
        return transactions;
    }

    async validateWallets(payload) {
        const alreadyHave = [];
        for (const id in payload) {
            const result = await this.walletRepo.findOne({ id: payload[id], isDeleted: false });
            if (!result) {
                throw new HttpException(`There's no wallet with id: ${payload[id]}`, HttpStatus.NOT_FOUND);
            }
            if (alreadyHave.indexOf(payload[id]) !== -1) {
                throw new HttpException(`Unable to transfer funds to your own wallet`, HttpStatus.BAD_REQUEST);
            }
            alreadyHave.push(payload[id]);
        }
    }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHistogram } from 'perf_hooks';
import { idRegex } from 'src/utils/regex';
import { serialize, serializeGetAll, serializeWallets } from 'src/utils/serialize/wallet';
import { ValidateQueries } from 'src/utils/validations/validateQueries';
import { Underage } from 'src/utils/validations/validateUnderage';
import { Repository } from 'typeorm';
import { CoinService } from './coin.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Coin } from './entities/coin.entity';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(@InjectRepository(Wallet) private walletRepo: Repository<Wallet>, 
  @InjectRepository(Coin) private coinRepo: Repository<Coin>,
  private coinService: CoinService) {}
  async create(createWalletDto: CreateWalletDto) {
    const {birthdate, cpf} = createWalletDto;
    Underage(birthdate);
    const alreadyExists = await this.walletRepo.findOne({cpf});
    if (alreadyExists) {
      throw new HttpException('A wallet is already registrated with this cpf', HttpStatus.BAD_REQUEST);
    }
    const result = await this.walletRepo.create(createWalletDto);
    await this.walletRepo.save(result);
    return serialize(result);
  }

  async findAll(queries) {
    ValidateQueries(queries);
    let { limit, page } = queries;
    delete queries['limit'];
    delete queries['page'];
    limit = limit || 10;
    page = page || 1;
    const skip = (page - 1) * limit;

    const result = await this.walletRepo.findAndCount({
      where: queries,
      take: limit,
      skip: skip,
      relations: ['coins']
    });
    const serializedResult = serializeWallets({wallets: result['0'], total: result['1']})
    return serializedResult;
  }

  async findOne(id: string) {
    if (!idRegex(id)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
    }
    const result = await this.walletRepo.findOne(id, {relations:['coins']});
    if (!result) {
      throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async update(id: string, updateWalletDto: UpdateWalletDto[]) { 
    if (!idRegex(id)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
    }    
    let result = await this.walletRepo.findOne({id: id});
    if (!result) {
      throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
    }
    /*const coin = {
      coin: 'BRL',
      fullname: 'Brazilian real',
      amount: 0.272401
    }*/
    const coinsResolved = await this.coinService.getCoins(updateWalletDto);
    console.log(coinsResolved);
    result.updatedAt = new Date();
    /*const coins = await this.coinRepo.create(coin);
    coins.wallet = result;
    const finale = await this.coinRepo.save(coins); */
    let retorninho = await this.walletRepo.find({relations: ['coins']});
    
    return retorninho;
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
}
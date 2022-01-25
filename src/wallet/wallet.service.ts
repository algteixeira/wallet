import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { serialize, serializeWallets } from 'src/utils/serialize/wallet';
import { ValidateQueries } from 'src/utils/validations/validateQueries';
import { Underage } from 'src/utils/validations/validateUnderage';
import { Repository } from 'typeorm';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(@InjectRepository(Wallet) private walletRepo: Repository<Wallet>) {}
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
    });
    const serializedResult = serializeWallets({wallets: result['0'], total: result['1']})
    return serializedResult;
  }

  async findOne(id: string) {
    const result = await this.walletRepo.findOne(id);
    if (!result) {
      throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  async remove(id: string) {
    const result = await this.walletRepo.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
    }
    return {};
  }
}
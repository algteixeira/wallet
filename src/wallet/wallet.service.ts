import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(@InjectRepository(Wallet) private walletRepo: Repository<Wallet>) {}
  async create(createWalletDto: CreateWalletDto) {
    const result = await this.walletRepo.create(createWalletDto);
    await this.walletRepo.save(result);
    return result;
  }

  async findAll() {
    const result = await this.walletRepo.find();
    return result;
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

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}

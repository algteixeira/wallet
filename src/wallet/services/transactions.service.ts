import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Transaction)
        private transactionRepo: Repository<Transaction>
    ) {}

    async createTransaction(apiPrice, { sendTo, receiveFrom, coin, value }) {
        const datetime = new Date();
        const result = await this.transactionRepo.create({
            value,
            datetime,
            coin,
            sendTo,
            receiveFrom,
            currentCotation: apiPrice
        });
        return await this.transactionRepo.save(result);
    }
}

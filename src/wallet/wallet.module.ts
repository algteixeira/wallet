import { Module } from '@nestjs/common';
import { WalletService } from './services/wallet.service';
import { WalletController } from './controllers/wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Coin } from './entities/coin.entity';
import { CoinService } from './services/coin.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './services/transactions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Coin, Transaction]), HttpModule],
  controllers: [WalletController],
  providers: [WalletService, CoinService, TransactionService]
})
export class WalletModule {}
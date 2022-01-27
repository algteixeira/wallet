import { Module } from '@nestjs/common';
import { WalletService } from './services/wallet.service';
import { WalletController } from './controllers/wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Coin } from './entities/coin.entity';
import { CoinService } from './services/coin.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Coin]), HttpModule],
  controllers: [WalletController],
  providers: [WalletService, CoinService]
})
export class WalletModule {}
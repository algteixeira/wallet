import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Coin } from './entities/coin.entity';
import { CoinService } from './coin.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Coin]), HttpModule],
  controllers: [WalletController],
  providers: [WalletService, CoinService]
})
export class WalletModule {}
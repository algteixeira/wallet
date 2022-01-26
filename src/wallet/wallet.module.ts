import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Coin } from './entities/coin.entity';
import { CoinService } from './coin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Coin])],
  controllers: [WalletController],
  providers: [WalletService, CoinService]
})
export class WalletModule {}
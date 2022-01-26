import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Coin } from './entities/coin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Coin])],
  controllers: [WalletController],
  providers: [WalletService]
})
export class WalletModule {}
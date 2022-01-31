import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config } from 'ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletModule } from './wallet/wallet.module';

@Module({
    imports: [WalletModule, TypeOrmModule.forRoot(Config)],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}

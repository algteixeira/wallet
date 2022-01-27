import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UpdateWalletDto } from "./dto/update-wallet.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Coin } from "./entities/coin.entity";
import { Repository } from "typeorm";
import { Wallet } from "./entities/wallet.entity";
import { firstValueFrom,  } from "rxjs";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class CoinService {
    constructor(@InjectRepository(Coin) private coinRepo: Repository<Coin>,
    private httpService: HttpService) { }
    async requestCoins (updateWalletDto: UpdateWalletDto[]) {
        let result = [];
        try {
            for (let i=0; i<updateWalletDto.length; i++) {
                let { quoteTo, currentCoin } = updateWalletDto[i];
                const { data } = await firstValueFrom(
                    this.httpService.get(`https://economia.awesomeapi.com.br/json/last/${currentCoin}-${quoteTo}`)
                )
                result.push(data);
            }
            return result;
        } catch (error) {
            throw new HttpException(`There are invalid currencies on your request`, HttpStatus.BAD_REQUEST);
        }
    }

    

    async getCoins (wallet: Wallet , updateWalletDto: UpdateWalletDto[]) {
        const apiReturn = await this.requestCoins(updateWalletDto);
        for (let i=0; i<apiReturn.length; i++) {
            const operate = {updateWalletDto: updateWalletDto[i], apiReturn: apiReturn[i]};
            const insertedCoins = await this.insertCoins(wallet, operate);
        }        
    }

    async insertCoins (wallet, operate) {
        const {updateWalletDto, apiReturn} = operate;
        const {currentCoin, quoteTo, value} = updateWalletDto;
        const index = updateWalletDto.currentCoin+updateWalletDto.quoteTo;
        const fullname = apiReturn[index].name.split(/[/]/)[1];
        let existentCoin = await this.coinRepo.findOne({coin: currentCoin ,wallet: wallet})
        if (!existentCoin) {
            if (value < 0) {
                throw new HttpException(`You can't withdraw ${value*-1} ${currentCoin}. Insuficient funds.`, HttpStatus.BAD_REQUEST);
            }
            existentCoin = await this.coinRepo.findOne({coin: quoteTo, wallet});
            // trocar o trecho abaixo pela chamada de uma função setValues que faz isso tudo
            let newValue = 0;
            if (!existentCoin) {
                newValue = value * apiReturn[index].high;
                const newCoin = this.coinRepo.create({
                    coin: quoteTo, fullname,
                    amount: newValue, wallet
                });
                return this.coinRepo.save(newCoin);
            }
            newValue = parseFloat(existentCoin.amount) + (value * apiReturn[index].high);
            existentCoin.amount = newValue; 
            return this.coinRepo.save(existentCoin);
        }
        if (value < 0) {
            let subtract = (parseFloat(existentCoin.amount) - parseFloat(value));
            if (subtract < 0) {
                throw new HttpException(`You can't withdraw ${value*-1} ${currentCoin}.
                 Insuficient funds.`, HttpStatus.BAD_REQUEST);
            } // o que vem a seguir repete em relação à antes, então fazer função no utils para realiza-lo 
            existentCoin.amount = existentCoin.amount + value;
            await this.coinRepo.save(existentCoin);
            let newValue = 0.
            existentCoin = await this.coinRepo.findOne({coin: quoteTo ,wallet: wallet});
            if (!existentCoin) {
                newValue = value * apiReturn[index].high;
                const newCoin = this.coinRepo.create({
                    coin: quoteTo, fullname,
                    amount: newValue, wallet
                });
                return this.coinRepo.save(newCoin);
            }
            newValue = parseFloat(existentCoin.amount) + (value * apiReturn[index].high);
            existentCoin.amount = newValue;
            return this.coinRepo.save(existentCoin);
        }



    }

}
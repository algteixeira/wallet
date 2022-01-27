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
        const {currentCoin, quoteTo } = updateWalletDto;
        let { value } = updateWalletDto;
        value = parseFloat(value);
        const index = updateWalletDto.currentCoin+updateWalletDto.quoteTo;
        apiReturn[index].high = parseFloat(apiReturn[index].high);
        const fullname = apiReturn[index].name.split(/[/]/)[1];


    }

}
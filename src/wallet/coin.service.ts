import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UpdateWalletDto } from "./dto/update-wallet.dto";
import axios from "axios";
import { InjectRepository } from "@nestjs/typeorm";
import { Coin } from "./entities/coin.entity";
import { Repository } from "typeorm";
import { Wallet } from "./entities/wallet.entity";

@Injectable()
export class CoinService {
    constructor(@InjectRepository(Coin) private coinRepo: Repository<Coin>) {}
    async requestCoins (updateWalletDto: UpdateWalletDto[]) {
        let response = [];
        await Promise.all(
            updateWalletDto.map(async ({quoteTo, currentCoin}) => {
                try {
                    const res = await axios.get(`https://economia.awesomeapi.com.br/json/last/${currentCoin}-${quoteTo}`);
                    response.push(res.data);
                } catch (error) {
                    throw new HttpException('One or more non-accepted currencies', HttpStatus.BAD_REQUEST);
                }
                
            })
        );
        return response;
    }

    async getCoins (wallet: Wallet ,id: string, updateWalletDto: UpdateWalletDto[]) {
        const apiReturn = await this.requestCoins(updateWalletDto);
        for (let i=0; i < apiReturn.length; i++) {
            let index = Object.keys(apiReturn[i])
            const searchElems = [apiReturn[i][`${index}`].code, apiReturn[i][`${index}`].codein];
            let isThere = await this.coinRepo.findOne({coin: searchElems[0], wallet: wallet});
            if (!isThere) {
                console.log(searchElems[0], 'is not in this wallet yet');
                if (updateWalletDto[i].value < 0) {
                    console.log('não pode sacar algo q n tem');
                    throw new HttpException('Insuficient funds', HttpStatus.BAD_REQUEST);
                }                
            }
            isThere = await this.coinRepo.findOne({coin: searchElems[1], wallet: wallet});
            if (!isThere) {
                console.log(searchElems[1], 'is not in this wallet yet');
            }
        }
        
    }


}
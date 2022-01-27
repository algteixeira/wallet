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

    async getCoins (wallet: Wallet , updateWalletDto: UpdateWalletDto[]) {
        const apiReturn = await this.requestCoins(updateWalletDto);
        for (let i=0; i < apiReturn.length; i++) {
            let index = Object.keys(apiReturn[i])
            const searchElems = [apiReturn[i][`${index}`].code, apiReturn[i][`${index}`].codein];
            let isThere = await this.coinRepo.findOne({coin: searchElems[0], wallet: wallet });
            if (!isThere) { // a coin que tá pedindo pra sacar não existe ainda
                console.log(`${searchElems[0]} não tá no db`);
                if (updateWalletDto[i].value < 0) { //  logo o valor do saque não pode ser negativo
                    throw new HttpException('Insuficient funds', HttpStatus.BAD_REQUEST);
                }
                const newValue = updateWalletDto[i].value * apiReturn[i][`${index}`].high;
                const coinName = apiReturn[i][`${index}`].name.split(/[/]/)[1];
                const newCoin = await this.coinRepo.create({coin: searchElems[1], fullname: coinName, 
                amount: newValue, wallet: wallet});
                return await this.coinRepo.save(newCoin);
            } // se ela existe, então a tua amount dela - valor sacado não pode ser inferior a zero
            console.log(isThere);
            if ((isThere.amount - updateWalletDto[i].value) < 0) {
                throw new HttpException('Insuficient funds', HttpStatus.BAD_REQUEST);
            } // senão subtrai da amount que tenho dela e joga na outra
            isThere.amount = (isThere.amount - updateWalletDto[i].value);
            this.coinRepo.save(isThere);
            const newValue = updateWalletDto[i].value * apiReturn[i][`${index}`].high;
            const coinName = apiReturn[i][`${index}`].name.split(/[/]/)[1];
            isThere = await this.coinRepo.findOne({coin: searchElems[1], wallet: wallet});
            if (!isThere) { // cria a coin que vai receber o valor se ela n existir
                let receiverCoin = this.coinRepo.create({coin: searchElems[1], fullname: coinName,
                amount: newValue, wallet: wallet});
                console.log(receiverCoin);
                this.coinRepo.save(receiverCoin);
            } // se ela existir só atualiza a amount dela
            isThere.amount = isThere.amount + newValue;
            this.coinRepo.save(isThere); 
        }
        
    }

    private async find ( wallet: Wallet ,id: string, apiReturn ) {


    }


}
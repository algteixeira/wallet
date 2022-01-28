import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UpdateWalletDto } from "../dto/update-wallet.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Coin } from "../entities/coin.entity";
import { Repository } from "typeorm";
import { Wallet } from "../entities/wallet.entity";
import { firstValueFrom,  } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { TransactionService } from "./transactions.service";

@Injectable()
export class CoinService {
    constructor(@InjectRepository(Coin) private coinRepo: Repository<Coin>,
    @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
        private transactionService: TransactionService,
    private httpService: HttpService) { }
    private async requestCoins (payload) {
        let result = [];
        try {
            for (let i=0; i<payload.length; i++) {
                let { quoteTo, currentCoin } = payload[i];
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

    async createTransaction (coin, value, currentCotation, id, receiverAddress) {
        // otimizar isso passando de função em função as duas carteiras buscadas lá no wallet service
        console.log(coin, value, currentCotation);
        console.log(id, receiverAddress);
        const transferValue = value * currentCotation;
        const receiver = await this.walletRepo.findOne({id: receiverAddress});
        const wallet = await this.walletRepo.findOne({id}); 
        let result = await this.coinRepo.findOne({coin, wallet})
        if (!result) {
            throw new HttpException(`User ${wallet.name} don't have this coin yet`, HttpStatus.NOT_FOUND);
        }
        const newValue = parseFloat(result.amount) - transferValue; 
        if (newValue < 0) {
            throw new HttpException(`Insuficient funds!`, HttpStatus.BAD_REQUEST);
        }
        result.amount = newValue;
        await this.coinRepo.save(result);
        console.log(parseFloat(result.amount), transferValue);
        
        // [X] primeiro confere se a wallet tem essa coin, se não tiver, throw error
        // [X] não pode permitir transferir o valor se não tiver o suficiente
        // [] confere se a coin já existe no receiverAddress, se não existir, cria e insere o
        //      valor retirado da outra
        // [] se já existir, só soma no amount dela o valor transferido
        // [] vai utilizar o this.transactionService.createTransaction() tanto pra 
        // [] sinalizar a transferência saindo de 1 (com valor negativo)
        // [] e dinheiro entrando pro outro (valor positivo)
    }

    async transactionHandler (id, createTransactionDto) {
        const { receiverAddress } = createTransactionDto;
        delete createTransactionDto['receiverAddress'];
        const result = await this.requestCoins([createTransactionDto]);
        const index = createTransactionDto.currentCoin+createTransactionDto.quoteTo;
        const {value, quoteTo} = createTransactionDto;

        const coinName = result[0][index].name.split(/[/]/)[1];
        const currentCotation = result[0][index].high;
        await this.createTransaction(quoteTo, value, currentCotation, id, receiverAddress);
    }

    

    async getCoins (wallet: Wallet , updateWalletDto: UpdateWalletDto[]) {
        const apiReturn = await this.requestCoins(updateWalletDto);
        for (let i=0; i<apiReturn.length; i++) {
            const operate = {updateWalletDto: updateWalletDto[i], apiReturn: apiReturn[i]};
            await this.insertionHandler(wallet, operate);
        }        
    }

    private async insertionHandler (wallet, operate) {
        const {updateWalletDto, apiReturn} = operate;
        const { quoteTo } = updateWalletDto;
        let { value } = updateWalletDto;
        value = parseFloat(value);
        const index = updateWalletDto.currentCoin+updateWalletDto.quoteTo;
        const apiPrice = parseFloat(apiReturn[index].high);
        const fullname = apiReturn[index].name.split(/[/]/)[1];
        const existentCoin = await this.coinRepo.findOne({coin: quoteTo, wallet});
        return await this.setValue(existentCoin, fullname, apiPrice, value, wallet, quoteTo); 
    }

    private async setNewCoinValue(value, apiPrice, quoteTo, fullname, wallet) {
        let newValue = 0;
        if (value < 0) {
            throw new HttpException(`This wallet don't have this currency yet. Unable to withdraw funds`, HttpStatus.BAD_REQUEST);
        }
        newValue = value * apiPrice;
        const newCoin = await this.coinRepo.create({coin: quoteTo, fullname, 
            amount: newValue, wallet})
        await this.coinRepo.save(newCoin); 
        return this.transactionService.createTransaction(apiPrice, 
            {sendTo: wallet.id, receiveFrom: wallet.id, coin: newCoin, value: newValue});
    }

    private async setExistentCoinValue(existentCoin, value, apiPrice, wallet) {
        let newValue = 0;
        const coinPrice = parseFloat(existentCoin.amount);
        if (value < 0) {
            value = value * -1;
            newValue = coinPrice - (value * apiPrice);

            if( newValue < 0 ) {
                throw new HttpException(`Insuficient funds`, HttpStatus.BAD_REQUEST);
            }

            existentCoin.amount = newValue;
            await this.coinRepo.save(existentCoin);
            return await this.transactionService.createTransaction(apiPrice, 
                {sendTo: wallet.id, receiveFrom: wallet.id, coin: existentCoin, value: (value * apiPrice)});
        }

        existentCoin.amount = coinPrice + (value * apiPrice);
        await this.coinRepo.save(existentCoin);
        return await this.transactionService.createTransaction(apiPrice, 
            {sendTo: wallet.id, receiveFrom: wallet.id, coin: existentCoin, value: (value * apiPrice)});
    }

    private async setValue (existentCoin: Coin, fullname: string, apiPrice: number, value: number, wallet: Wallet, quoteTo: string) {
        let newValue = 0;

        if (!existentCoin) {
            return await this.setNewCoinValue(value, apiPrice, quoteTo, fullname, wallet);
        }
        return await this.setExistentCoinValue(existentCoin, value, apiPrice, wallet);  
    }
}
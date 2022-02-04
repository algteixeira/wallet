import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Coin } from "../entities/coin.entity";
import { Repository } from "typeorm";
import { Wallet } from "../entities/wallet.entity";
import { firstValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { TransactionService } from "./transactions.service";

@Injectable()
export class CoinService {
  constructor(
    @InjectRepository(Coin) private coinRepo: Repository<Coin>,
    @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
    private transactionService: TransactionService,
    private httpService: HttpService
  ) {}

  async requestCoins(payload) {
    const result = [];
    try {
      for (let i = 0; i < payload.length; i++) {
        const { quoteTo, currentCoin } = payload[i];
        const { data } = await firstValueFrom(
          this.httpService.get(
            `https://economia.awesomeapi.com.br/json/last/${currentCoin}-${quoteTo}`
          )
        );
        result.push(data);
      }
      return result;
    } catch (error) {
      throw new HttpException(
        `There are invalid currencies on your request`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async senderHandler({
    coin,
    wallet,
    transferValue,
    currentCotation,
    receiverAddress,
    id,
  }) {
    const result = await this.coinRepo.findOne({ coin, wallet });
    if (!result || result.amount - transferValue < 0) {
      throw new HttpException(`Insuficient funds!`, HttpStatus.BAD_REQUEST);
    }
    result.amount = parseFloat(result.amount) - transferValue;
    await this.coinRepo.save(result);
    return await this.transactionService.createTransaction(currentCotation, {
      sendTo: receiverAddress,
      receiveFrom: id,
      coin: result,
      value: transferValue * -1,
    });
  }

  async receiverHandler({
    coin,
    receiver,
    coinName,
    transferValue,
    currentCotation,
    receiverAddress,
    id,
  }) {
    let result = await this.coinRepo.findOne({ coin, wallet: receiver });
    if (!result) {
      result = await this.coinRepo.create({
        coin: coin,
        wallet: receiver,
        fullname: coinName,
        amount: 0,
      });
    }
    result.amount = parseFloat(result.amount) + transferValue;
    await this.coinRepo.save(result);
    return await this.transactionService.createTransaction(currentCotation, {
      sendTo: receiverAddress,
      receiveFrom: id,
      coin: result,
      value: transferValue,
    });
  }

  async transactionHandler(id, createTransactionDto) {
    const { receiverAddress } = createTransactionDto;
    delete createTransactionDto.receiverAddress;
    const result = await this.requestCoins([createTransactionDto]);
    const index =
      createTransactionDto.currentCoin + createTransactionDto.quoteTo;
    const receiver = await this.walletRepo.findOne({ id: receiverAddress });
    const wallet = await this.walletRepo.findOne({ id });
    await this.senderHandler({
      coin: createTransactionDto.quoteTo,
      wallet,
      transferValue: createTransactionDto.value * result[0][index].high,
      currentCotation: result[0][index].high,
      receiverAddress,
      id,
    });
    return await this.receiverHandler({
      coin: createTransactionDto.quoteTo,
      receiver,
      coinName: result[0][index].name.split(/[/]/)[1],
      transferValue: createTransactionDto.value * result[0][index].high,
      currentCotation: result[0][index].high,
      receiverAddress,
      id,
    });
  }

  async insertionHandler(wallet, operate) {
    const { updateWalletDto, apiReturn } = operate;
    const index = updateWalletDto.currentCoin + updateWalletDto.quoteTo;
    let existentCoin = await this.coinRepo.findOne({
      coin: updateWalletDto.quoteTo,
      wallet,
    });
    if (!existentCoin)
      existentCoin = await this.coinRepo.create({
        wallet,
        amount: 0,
        fullname: apiReturn[index].name.split(/[/]/)[1],
        coin: updateWalletDto.quoteTo,
      });
    return await this.setCoinValue({
      existentCoin,
      value: parseFloat(updateWalletDto.value),
      apiPrice: parseFloat(apiReturn[index].high),
      wallet,
    });
  }

  private async setCoinValue({ existentCoin, value, apiPrice, wallet }) {
    existentCoin.amount = parseFloat(existentCoin.amount) + value * apiPrice;
    if (existentCoin.amount < 0)
      throw new HttpException(`Insuficient funds`, HttpStatus.BAD_REQUEST);
    await this.coinRepo.save(existentCoin);
    return await this.transactionService.createTransaction(apiPrice, {
      sendTo: wallet.id,
      receiveFrom: wallet.id,
      coin: existentCoin,
      value: value * apiPrice,
    });
  }
}

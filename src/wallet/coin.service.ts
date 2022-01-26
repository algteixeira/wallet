import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UpdateWalletDto } from "./dto/update-wallet.dto";
import axios from "axios";

@Injectable()
export class CoinService {
    async getCoins (updateWalletDto: UpdateWalletDto[]) {
        let response = [];
        await Promise.all(
            updateWalletDto.map(async ({quoteTo, currentCoin, value}, index) => {
                const res = await axios.get(`https://economia.awesomeapi.com.br/json/last/${currentCoin}-${quoteTo}`);
                response.push(res.data);
            })
        );
        return response;
    }
}
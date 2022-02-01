import { Controller, Get, Post, Body, Param, Delete, Query, HttpCode, Put, ParseUUIDPipe } from '@nestjs/common';
import { serializeGetById } from 'src/utils/serialize/wallet';
import { WalletService } from '../services/wallet.service';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { UpdateWalletDto } from '../dto/update-wallet.dto';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { GetTransactionDto } from '../dto/get-transaction.dto';

const prefix = 'api/v1/';

@Controller(`${prefix}wallet`)
export class WalletController {
    constructor(private readonly walletService: WalletService) {}

    @Post()
    async create(@Body() createWalletDto: CreateWalletDto) {
        const result = await this.walletService.create(createWalletDto);
        return result;
    }

    @Post(':id/transaction')
    async createTransaction(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() createTransactionDto: CreateTransactionDto
    ) {
        const result = await this.walletService.createTransaction(id, createTransactionDto);
        return result;
    }

    @Get(':id/transaction')
    async getTransactions(@Param('id', ParseUUIDPipe) id: string, @Query() getTransactionDto: GetTransactionDto) {
        const result = await this.walletService.getTransactions(id, getTransactionDto);
        return result;
    }

    @Get()
    async findAll(@Query() queries) {
        const result = await this.walletService.findAll(queries);
        return result;
    }

    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        try {
            const result = await this.walletService.findOne(id);
            return serializeGetById(result);
        } catch (error) {
            return error;
        }
    }

    @Put(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateWalletDto: UpdateWalletDto[]) {
        const result = await this.walletService.update(id, updateWalletDto);
        return result;
    }

    @Delete(':id')
    @HttpCode(204)
    async remove(@Param('id', ParseUUIDPipe) id: string) {
        const result = await this.walletService.remove(id);
        return result;
    }
}

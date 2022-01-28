import { Controller, Get, Post, Body, Param, Delete, Query, HttpCode, Put } from '@nestjs/common';
import { WalletService } from '../services/wallet.service';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { UpdateWalletDto } from '../dto/update-wallet.dto';
import { serializeGetById } from 'src/utils/serialize/wallet';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  async create(@Body() createWalletDto: CreateWalletDto) {
    const result = await this.walletService.create(createWalletDto);
    return result;
  }

  @Post(':id/transaction')
  async createTransaction(@Param('id') id: string ,@Body() createTransactionDto: CreateTransactionDto) {
    const result = await this.walletService.createTransaction(id, createTransactionDto);
    return result;
  }

  @Get()
  async findAll(@Query() queries) {
    const result = await this.walletService.findAll(queries);
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.walletService.findOne(id);
      return serializeGetById(result);
    } catch (error) {
      return error;
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto[]) {
    const result =  await this.walletService.update(id, updateWalletDto); 
    return result; 
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const result = await this.walletService.remove(id);
    return result;
  }
}
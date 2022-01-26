import { Controller, Get, Post, Body, Param, Delete, Query, HttpCode, Put } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { serializeGetById } from 'src/utils/serialize/wallet';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  async create(@Body() createWalletDto: CreateWalletDto) {
    const result = await this.walletService.create(createWalletDto);
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
      console.log(result)
      return serializeGetById(result);
    } catch (error) {
      return error;
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto[]) {
    try {
      const result = await this.walletService.update(id, updateWalletDto);
      return result;
    } catch (error) {
      return error;
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const result = await this.walletService.remove(id);
    return result;
  }
}
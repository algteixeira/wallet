import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { GetAllWalletDto } from './dto/getAll-wallet.dto';
import { serializeV3, serializeWallets } from 'src/utils/serialize/wallet';

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
      return serializeV3(result);
    } catch (error) {
      return error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto) {
    const result = await this.walletService.update(+id, updateWalletDto);
    return result;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const result = await this.walletService.remove(id);
    return result;
  }
}
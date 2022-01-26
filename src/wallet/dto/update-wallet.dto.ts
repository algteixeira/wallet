import { PartialType } from '@nestjs/mapped-types';
import { IsDecimal, IsNotEmpty, IsString, Length } from 'class-validator';
import { CreateWalletDto } from './create-wallet.dto';

export class UpdateWalletDto {
    @IsString()
    @IsNotEmpty()
    @Length(3)    
    quoteTo: string;
    @IsNotEmpty()
    @IsString()
    @Length(3)
    currentCoin: string;
    @IsNotEmpty()
    @IsDecimal()
    value: number;    
}

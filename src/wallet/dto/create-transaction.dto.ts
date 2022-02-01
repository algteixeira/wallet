import { IsNotEmpty, IsNumber, IsString, MinLength, IsPositive, IsUUID } from 'class-validator';

export class CreateTransactionDto {
    @IsString()
    @MinLength(36)
    @IsNotEmpty()
    @IsUUID()
    receiverAddress: string;

    @IsString()
    @IsNotEmpty()
    quoteTo: string;

    @IsString()
    @IsNotEmpty()
    currentCoin: string;

    @IsNumber()
    @IsPositive()
    value: number;
}

import { IsNotEmpty, IsNumber, IsString, MinLength, IsPositive } from "class-validator";

export class CreateTransactionDto {
    @IsString()
    @MinLength(36)
    @IsNotEmpty()
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

import { IsString, MinLength, IsOptional } from 'class-validator';

export class GetTransactionDto {
    @IsString()
    @MinLength(3)
    @IsOptional()
    coin: string;
}

import { Min, IsOptional } from "class-validator";
export class GetAllWalletDto {
    @IsOptional()
    name: string;
    @IsOptional()
    cpf: string;
    @IsOptional()
    birthdate: string;
    @IsOptional()
    createdAt: string;
    @IsOptional()
    updatedAt: string;
    @IsOptional()
    @Min(1)
    limit: number;
    @IsOptional()
    @Min(1)
    page: number;
}

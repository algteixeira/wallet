import { IsNotEmpty, IsString, MinLength, Validate, Validator } from "class-validator";
import validateDate from "src/utils/validateDate";

export class CreateWalletDto {
    @IsString()
    @MinLength(7)
    @IsNotEmpty()
    name: string;
    @IsString()
    @MinLength(14)
    @IsNotEmpty()
    cpf: string;
    @Validate(validateDate)
    @IsNotEmpty()
    birthdate: string;
}

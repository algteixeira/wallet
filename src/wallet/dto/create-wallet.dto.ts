import { IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';
import validateCpf from 'src/utils/validations/validateCpf';
import validateDate from 'src/utils/validations/validateDate';

export class CreateWalletDto {
    @IsString()
    @MinLength(7)
    @IsNotEmpty()
    name: string;

    @Validate(validateCpf)
    @IsNotEmpty()
    cpf: string;

    @Validate(validateDate)
    @IsNotEmpty()
    birthdate: string;
}

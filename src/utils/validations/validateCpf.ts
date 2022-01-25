import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { cpfRegex } from "../regex";
import { validateCpfInfo } from "./validateCpfInfo";
@ValidatorConstraint({name: 'dateValidation', async: false })
export default class validateCpf implements ValidatorConstraintInterface {
    validate(cpf: string, validationArguments: ValidationArguments) {
        const result = cpfRegex(cpf);
        if (!result) {
            return result;
        }
        if(!validateCpfInfo(cpf)) {
            return false;
        }
        return true;
       
        
    }
    defaultMessage(args: ValidationArguments) {
        return `That's an invalid CPF`;
    }
}
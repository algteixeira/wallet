import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { dateRegex } from "../regex";
import { validateInfo } from "./validateDataInfo";
@ValidatorConstraint({name: 'dateValidation', async: false })
export default class validateDate implements ValidatorConstraintInterface {
    validate(date: string, validationArguments: ValidationArguments) {
        const result = dateRegex(date);
        if (!result) {
            return result;
        }
        if(!validateInfo(date)) {
            return false;
        }
        return true;
       
        
    }
    defaultMessage(args: ValidationArguments) {
        return 'Wrong date format (it should be DD/MM/YYYY)';
    }
}
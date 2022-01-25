import { enumInvalidCpf } from "../enumInvalidCpf";
import { validateDigitEleven, validateDigitTen } from "./validateDigits";

const validateCpfInfo = (cpf) => {
    const strCPF = String(cpf).replace(/[^\d]/g, '');
    if (strCPF.length !== 11) {
        return false;
    }
    if (enumInvalidCpf.indexOf(strCPF) !== -1) {
        return false;
    }
    let result = validateDigitTen(strCPF);
    if (!result) {
        return false;
    }
    result = validateDigitEleven(strCPF);
    if (!result) {
        return false;
    }
    return true;
};

export { validateCpfInfo };
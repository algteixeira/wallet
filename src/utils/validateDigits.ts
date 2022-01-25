const validateDigitTen = (cpf) => {
    let sum = 0;
    let remnant = 0;
    for (let i=1; i<=9; i++) {
        sum = sum + parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    remnant = (sum * 10) % 11;
    if (remnant === 10 || remnant === 11) { 
        remnant = 0;
    }
    if (remnant != parseInt(cpf.substring(9, 10)) ) {
        return false;
    }
    return true;
};

const validateDigitEleven = (cpf) => {
    let sum = 0;
    let remnant = 0;
    for (let i = 1; i <= 10; i++) {
        sum = sum + parseInt(cpf.substring(i-1, i)) * (12 - i);
    }
    remnant = (sum * 10) % 11;
    if (remnant === 10 || remnant === 11) {
        remnant = 0;
    } 
    if (remnant != parseInt(cpf.substring(10, 11) ) ) {
        return false;
    }
    return true;
};

export { validateDigitTen, validateDigitEleven };
import { HttpException, HttpStatus } from '@nestjs/common';
import { getAge } from '../getAge';

const Underage = (birthdate) => {
    const isUnderage = getAge(birthdate);
    if (isUnderage) {
        throw new HttpException('Wallet owner must be an adult', HttpStatus.BAD_REQUEST);
    }
};

export { Underage };

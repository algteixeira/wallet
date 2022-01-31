import * as moment from 'moment';

const validateInfo = (date) => {
    date = moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY');
    if (date === 'Invalid date') {
        return false;
    }
    const arr = date.split('/');
    if (parseInt(arr[2]) < 1900) {
        return false;
    }
    return true;
};

export { validateInfo };

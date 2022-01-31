const dateRegex = (date) => {
    const dateRegexp = new RegExp(/[0-9]{2}[/]{1}[0-9]{2}[/]{1}[0-9]{4}/).test(date);
    return dateRegexp;
};
const cpfRegex = (cpf) => {
    const cpfRegexp = new RegExp(/[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}/).test(cpf);
    return cpfRegexp;
};
const idRegex = (id) => {
    const idRegexp = new RegExp(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/).test(id);
    return idRegexp;
};
export { dateRegex, cpfRegex, idRegex };

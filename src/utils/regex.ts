const dateRegex = (date) => {
  const dateRegexp = new RegExp(/[0-9]{2}[/]{1}[0-9]{2}[/]{1}[0-9]{4}/).test(date);
  return dateRegexp;
}
const cpfRegex = (cpf) => {
  const cpfRegexp = new RegExp(/[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}/).test(cpf);
  return cpfRegexp;
}
export { dateRegex, cpfRegex };
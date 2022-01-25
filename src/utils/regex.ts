const dateRegex = (date) => {
    const dateRegexp = new RegExp(/[0-9]{2}[/]{1}[0-9]{2}[/]{1}[0-9]{4}/).test(date);
  return dateRegexp;
}
export { dateRegex };
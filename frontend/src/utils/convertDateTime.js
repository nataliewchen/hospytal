import date from 'date-and-time';

export const toPyDateTime = (value) => {
  const parsed = date.parse(String(value), '    MMM DD YYYY HH:mm:ss...');
  const formatted = date.format(parsed, 'YYYY-MM-DD HH:mm:ss')
  return formatted;
}


export const toJSDateTime = (date_value, time_value) => {
  const full = String(date_value) + ' ' + String(time_value);
  const parsed = date.parse(full, 'YYYY-MM-DD HH:mm:ss');
  return parsed;
}

export const toFullYear = (value) => {
  const year = value.getFullYear();
  return year;
}


export const toPyDate = (value) => {
  const formatted = date.format(value, 'YYYY-MM-DD');
  return formatted;
}

export const toPyTime = (value) => {
  const formatted = date.format(value, 'HH:mm:ss');
  return formatted;
}

export const toJSDate = (value) => {
  const parsed = date.parse(value, 'YYYY-MM-DD');
  return parsed;
}

export const toJSTime = (value) => {
  const parsed = date.parse(value, 'HH:mm:ss');
  return parsed;
}


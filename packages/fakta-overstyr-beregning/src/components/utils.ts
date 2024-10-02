import { format, parse } from 'date-fns';

export const formaterDatoString = (dato?: string) => {
  if (!dato) {
    return '';
  }
  const date = parse(dato, 'yyyy-MM-dd', new Date());
  return format(date, 'dd.MM.yyyy');
};

export default formaterDatoString;

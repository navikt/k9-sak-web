import * as Yup from 'yup';

export const yupValiderProsent = Yup.number()
  .transform((val, orig) => (orig === '' ? undefined : val))
  .typeError('Må være et tall')
  .max(100, 'Maks 100')
  .min(0, 'Minst 0');

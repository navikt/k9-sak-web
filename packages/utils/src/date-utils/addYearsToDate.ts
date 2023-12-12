import initializeDate from './initialize';
import { prettifyDate } from './format';

const addYearsToDate = (date: string, yearsToAdd: number) => {
  const dateAsDayjs = initializeDate(date);
  const dateWithAddedYears = dateAsDayjs.add(yearsToAdd, 'years');
  return prettifyDate(dateWithAddedYears);
};

export default addYearsToDate;

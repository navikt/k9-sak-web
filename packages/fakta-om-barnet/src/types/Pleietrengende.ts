import { initializeDate, prettifyDate } from '@navikt/k9-fe-date-utils';
import PleietrengendeResponse from './PleietrengendeResponse';

class Pleietrengende {
  fnr: string;

  navn: string;

  diagnosekoder: string;

  dødsdato: string;

  constructor({ fnr, navn, diagnosekoder, dodsdato }: PleietrengendeResponse) {
    this.fnr = fnr;
    this.navn = navn;
    this.diagnosekoder = diagnosekoder?.join(', ');
    this.dødsdato = dodsdato ? prettifyDate(initializeDate(dodsdato)) : null;
  }
}

export default Pleietrengende;

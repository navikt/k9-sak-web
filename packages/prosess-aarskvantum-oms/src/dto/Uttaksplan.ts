import Aktivitet from './Aktivitet';

interface Uttaksplan {
  saksnummer: string;
  behandlingUUID: string;
  innsendingstidspunkt: string;
  aktiviteter: Aktivitet[];
}

export default Uttaksplan;

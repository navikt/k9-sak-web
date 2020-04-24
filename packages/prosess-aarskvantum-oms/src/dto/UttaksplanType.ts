import Aktivitet from './Aktivitet';

interface UttaksplanType {
  saksnummer: string;
  behandlingUUID: string;
  innsendingstidspunkt: string;
  aktiviteter: Aktivitet[];
}

export default UttaksplanType;

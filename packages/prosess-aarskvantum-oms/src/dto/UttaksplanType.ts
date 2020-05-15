import Aktivitet from './Aktivitet';

interface UttaksplanType {
  saksnummer: string;
  behandlingUUID: string;
  innsendingstidspunkt: string;
  aktiviteter: Aktivitet[];
  benyttetRammemelding: boolean;
}

export default UttaksplanType;

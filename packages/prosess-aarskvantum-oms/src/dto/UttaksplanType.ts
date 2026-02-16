import type Aktivitet from './Aktivitet';

interface UttaksplanType {
  saksnummer: string;
  behandlingUUID: string;
  innsendingstidspunkt: string;
  aktiviteter: Aktivitet[];
  benyttetRammemelding: boolean;
  aktiv: boolean;
}

export default UttaksplanType;

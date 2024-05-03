import { Period } from '@k9-sak-web/utils';
import TilstandStatus from './TilstandStatus';

export interface Kompletthet {
  tilstand: Tilstand[];
}

export interface Tilstand {
  periode: Period;
  status: Status[];
  begrunnelse: string;
  tilVurdering: boolean;
  vurdering: Vurdering;
  periodeOpprinneligFormat: string;
}

export interface TilstandBeriket extends Tilstand {
  redigeringsmodus: boolean;
  setRedigeringsmodus: (state: boolean) => void;
  beslutningFieldName?: string;
  begrunnelseFieldName?: string;
}

export interface Status {
  arbeidsgiver: Arbeidsgiver;
  status: TilstandStatus;
  journalpostId: string;
}

export interface Arbeidsgiver {
  arbeidsgiver: string;
  arbeidsforhold: null;
}
export interface Vurdering {
  beskrivelse: string;
  kode: Kode;
}

export enum Kode {
  FORTSETT = 'FORTSETT',
  MANGLENDE_GRUNNLAG = 'MANGLENDE_GRUNNLAG',
  TOM = '-',
}

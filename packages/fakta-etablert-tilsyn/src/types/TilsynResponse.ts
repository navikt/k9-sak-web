import { Period } from '@navikt/k9-fe-period-utils';
import Kilde from './Kilde';
import Vurderingsresultat from './Vurderingsresultat';

export interface TilsynResponse {
  etablertTilsynPerioder: EtablertTilsynPeriode[];
  nattevåk: Nattevåk;
  beredskap: Beredskap;
  smortEtablertTilsynPerioder: EtablertTilsynPeriode[];
}

export interface Vurderingselementer {
  periode: {
    fom: string;
    tom: string;
  };
  resultat: string;
}
export interface SykdomResponse {
  vurderingselementer: Vurderingselementer[];
  resterendeVurderingsperioder: {
    fom: string;
    tom: string;
  }[];
}
export interface InnleggelsesperiodeResponse {
  behandlingUuid: string;
  versjon: string;
  perioder: Period[];
}

export interface Beredskap {
  beskrivelser: Beskrivelse[];
  vurderinger: Vurdering[];
}

export interface Nattevåk {
  beskrivelser: Beskrivelse[];
  vurderinger: Vurdering[];
}

interface Beskrivelse {
  periode: Periode;
  tekst: string;
  mottattDato: string;
  kilde: Kilde;
}

interface Periode {
  fom: string;
  tom: string;
}

export interface Vurdering {
  id: number;
  periode: Periode;
  begrunnelse: string;
  resultat: Vurderingsresultat;
  kilde: Kilde;
  opprettetAv: string;
  opprettetTidspunkt: string;
}

export interface EtablertTilsynPeriode {
  periode: Periode;
  tidPerDag: string;
  kilde: Kilde;
}

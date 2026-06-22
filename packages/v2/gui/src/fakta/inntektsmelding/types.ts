import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { Period } from '@k9-sak-web/gui/utils/Period.js';
import type { KompletthetsTilstandPåPeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/KompletthetsTilstandPåPeriodeDto.js';
import type { KompletthetsPeriode } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/KompletthetsPeriode.js';
import type { ArbeidsgiverOpplysningerDto } from '@k9-sak-web/backend/k9sak/kontrakt/arbeidsforhold/ArbeidsgiverOpplysningerDto.js';
import type { DokumentDto } from '@k9-sak-web/backend/k9sak/kontrakt/dokument/DokumentDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/BehandlingDto.js';
import type { Vurdering } from '@k9-sak-web/backend/k9sak/kodeverk/kompletthet/Vurdering.js';

// Feltnavn for skjema
export const FieldName = {
  BESLUTNING: 'beslutning',
  BEGRUNNELSE: 'begrunnelse',
} as const;

export interface Tilstand extends Omit<KompletthetsTilstandPåPeriodeDto, 'periode'> {
  periode: Period;
  periodeOpprinneligFormat: string;
  vurdering?: Vurdering;
}

export interface TilstandMedUiState extends Tilstand {
  redigeringsmodus: boolean;
  setRedigeringsmodus: (state: boolean) => void;
  begrunnelseFieldName: `begrunnelse${string}`;
  beslutningFieldName: `beslutning${string}`;
}

export type InntektsmeldingPeriode = KompletthetsPeriode & {
  vurdering?: Vurdering;
  fortsett?: boolean;
};

export interface InntektsmeldingRequestPayload {
  begrunnelse?: string;
  perioder: InntektsmeldingPeriode[];
  kode: string;
  '@type': string;
}

// Context type
export interface InntektsmeldingContextType {
  behandling: BehandlingDto;
  readOnly: boolean;
  arbeidsforhold: Record<string, ArbeidsgiverOpplysningerDto>;
  dokumenter?: DokumentDto[];
  onFinished: (data: InntektsmeldingRequestPayload) => Promise<void>;
  aksjonspunkter: AksjonspunktDto[];
}

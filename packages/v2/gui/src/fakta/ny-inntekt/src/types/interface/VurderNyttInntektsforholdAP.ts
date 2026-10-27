import type { BeregningAvklaringsbehovTilBekreftelse } from '../BeregningAvklaringsbehovTilBekreftelse.js';
import { AvklaringsbehovDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/AvklaringsbehovDefinisjon.js';

export type VurderNyttInntektsforholdAndelTransformedValues = {
  aktivitetStatus: string;
  skalRedusereUtbetaling: boolean;
  arbeidsgiverId?: string;
  arbeidsforholdId?: string;
  bruttoInntektPrÅr?: number;
};

export type TilkommetInntektPeriodeTransformedValues = {
  tilkomneInntektsforhold: VurderNyttInntektsforholdAndelTransformedValues[];
  fom: string;
  tom: string;
};

export type VurderNyttInntektsforholTransformedValues = {
  tilkomneInntektsforhold: TilkommetInntektPeriodeTransformedValues[];
};

export type VurderNyttInntektsforholdAP = BeregningAvklaringsbehovTilBekreftelse<
  typeof AvklaringsbehovDefinisjon.VURDER_NYTT_INNTKTSFRHLD,
  VurderNyttInntektsforholTransformedValues
>;

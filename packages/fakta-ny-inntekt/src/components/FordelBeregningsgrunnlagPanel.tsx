import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import type { ArbeidsgiverOpplysningerPerId } from '../types/ArbeidsgiverOpplysninger.js';
import type { BeregningAvklaringsbehov } from '../types/BeregningAvklaringsbehov.js';
import type { Beregningsgrunnlag } from '../types/Beregningsgrunnlag.js';
import type { TilkommetAktivitetFormValues } from '../types/FordelBeregningsgrunnlagPanelValues.js';
import { FaktaFordelBeregningAvklaringsbehovCode } from '../types/interface/FaktaFordelBeregningAvklaringsbehovCode.js';
import { type VurderNyttInntektsforholdAP } from '../types/interface/VurderNyttInntektsforholdAP.js';
import { type Vilkårperiode } from '../types/Vilkår.js';
import { TilkommetAktivitet } from './tilkommetAktivitet/TilkommetAktivitet.js';

const { VURDER_NYTT_INNTKTSFRHLD } = FaktaFordelBeregningAvklaringsbehovCode;

const harNyttInntektsforholdInfo = (bg?: Beregningsgrunnlag): boolean =>
  bg && bg.faktaOmFordeling ? !!bg.faktaOmFordeling.vurderNyttInntektsforholdDto : false;

const getAvklaringsbehov = (
  def: string,
  avklaringsbehov?: BeregningAvklaringsbehov[],
): BeregningAvklaringsbehov | undefined =>
  avklaringsbehov && def ? avklaringsbehov.find(ap => ap.definisjon === def) : undefined;

export interface Props {
  aktivtBeregningsgrunnlagIndeks: number;
  readOnly: boolean;
  submitCallback: (aksjonspunktData: VurderNyttInntektsforholdAP) => Promise<void>;
  submittable: boolean;
  beregningsgrunnlagListe: Beregningsgrunnlag[];
  vilkarperioder: Vilkårperiode[];
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  formData?: TilkommetAktivitetFormValues;
  setFormData: (data: TilkommetAktivitetFormValues) => void;
}

/**
 * FordelBeregningsgrunnlagPanel
 *
 * Har ansvar for å sette opp Formen for "avklar fakta om fordeling" panel.
 */
export const FordelBeregningsgrunnlagPanel = ({
  aktivtBeregningsgrunnlagIndeks,
  readOnly,
  submitCallback,
  beregningsgrunnlagListe,
  vilkarperioder,
  submittable,
  arbeidsgiverOpplysningerPerId,
  formData,
  setFormData,
}: Props) => {
  const avklaringsbehov = beregningsgrunnlagListe[aktivtBeregningsgrunnlagIndeks]?.avklaringsbehov;
  const nyttInntektsforholdAP = getAvklaringsbehov(VURDER_NYTT_INNTKTSFRHLD, avklaringsbehov);

  const harNyttInntektsforholdAP =
    nyttInntektsforholdAP && harNyttInntektsforholdInfo(beregningsgrunnlagListe[aktivtBeregningsgrunnlagIndeks]);

  return (
    <>
      {harNyttInntektsforholdAP && (
        <>
          <TilkommetAktivitet
            aktivtBeregningsgrunnlagIndeks={aktivtBeregningsgrunnlagIndeks}
            formData={formData as TilkommetAktivitetFormValues}
            setFormData={setFormData}
            submittable={submittable}
            readOnly={readOnly}
            submitCallback={submitCallback}
            beregningsgrunnlagListe={beregningsgrunnlagListe}
            arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
            vilkarperioder={vilkarperioder}
          />
          <VerticalSpacer fourtyPx />
        </>
      )}
    </>
  );
};

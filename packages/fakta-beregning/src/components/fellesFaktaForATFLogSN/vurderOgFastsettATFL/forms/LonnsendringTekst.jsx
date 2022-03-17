import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import beregningsgrunnlagPropType from '../../../../propTypes/beregningsgrunnlagPropType';
import { createVisningsnavnForAktivitet } from '../../../ArbeidsforholdHelper';


const byggListeSomStreng = listeMedStrenger => {
  if (listeMedStrenger.length === 0) {
    return '';
  }
  if (listeMedStrenger.length === 1) {
    return listeMedStrenger[0];
  }
  if (listeMedStrenger.length === 2) {
    return `${listeMedStrenger[0]} og ${listeMedStrenger[1]}`;
  }
  if (listeMedStrenger.length > 2) {
    return `${listeMedStrenger.splice(0, listeMedStrenger.length - 1).join(', ')} og ${listeMedStrenger[listeMedStrenger.length - 1]
      }`;
  }
  return '';
};

const finnArbeidsforholdString = (beregningsgrunnlag, arbeidsgiverOpplysningerPerId, alleKodeverk) => {
  const arbMedLønnsendring = beregningsgrunnlag.faktaOmBeregning.arbeidsforholdMedLønnsendringUtenIM;
  const visningsliste = arbMedLønnsendring.map(a => createVisningsnavnForAktivitet(a.arbeidsforhold, alleKodeverk, arbeidsgiverOpplysningerPerId));
  return byggListeSomStreng(visningsliste);
}



/**
 * LonnsendringForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet VURDER_FAKTA_FOR_ATFL_SN for tilfelle VURDER_LØNNSENDRING som ber
 * bruker fastsette lønnsendring for en liste med arbeidsforhold.
 * Tilhørende tilfelle for å fastsette FL inntekt er FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING.
 * Denne komponenten kan vise intektstabell under radioknappene dersom skalViseInntektstabell er satt
 */


const LonnsendringTekst = ({ beregningsgrunnlag, arbeidsgiverOpplysningerPerId, alleKodeverk }) => (
  <div>
    <Normaltekst>
      <FormattedMessage
        id="BeregningInfoPanel.VurderOgFastsettATFL.Lonnsendring"
        values={{ arbeidsforhold: finnArbeidsforholdString(beregningsgrunnlag, arbeidsgiverOpplysningerPerId, alleKodeverk) }}
      />
    </Normaltekst>
  </div>
);

LonnsendringTekst.propTypes = {
  beregningsgrunnlag: PropTypes.shape(beregningsgrunnlagPropType).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
};

export const harLønnsendring = (field, faktaOmBeregning) =>
  faktaOmBeregning.arbeidsforholdMedLønnsendringUtenIM.find(
    andel => andel.andelsnr === field.andelsnr || andel.andelsnr === field.andelsnrRef,
  ) !== undefined;

export default LonnsendringTekst;

import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import { InputField } from '@fpsak-frontend/form';
import { parseCurrencyInput, removeSpacesFromNumber, required, getKodeverknavnFn } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import avklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import createVisningsnavnForAktivitet from '../../util/createVisningsnavnForAktivitet';
import styles from '../fellesPaneler/aksjonspunktBehandler.less';

const andelErIkkeTilkommetEllerLagtTilAvSBH = andel => {
  if (andel.overstyrtPrAar !== null && andel.overstyrtPrAar !== undefined) {
    return true;
  }
  // Andeler som er lagt til av sbh eller tilkom før stp skal ikke kunne endres på
  return andel.erTilkommetAndel === false && andel.lagtTilAvSaksbehandler === false;
};

const finnAndelerSomSkalVisesAT = andeler => {
  if (!andeler) {
    return [];
  }
  return andeler
    .filter(andel => andel.aktivitetStatus === aktivitetStatus.ARBEIDSTAKER)
    .filter(andel => andel.skalFastsetteGrunnlag === true)
    .filter(andel => andelErIkkeTilkommetEllerLagtTilAvSBH(andel));
};

const lagVisningsnavn = (arbeidsforhold, getKodeverknavn, arbeidsgiverOpplysningerPerId) => {
  const arbeidsgiverInformasjon = arbeidsgiverOpplysningerPerId[arbeidsforhold.arbeidsgiverIdent];
  if (!arbeidsgiverInformasjon) {
    return arbeidsforhold.arbeidsforholdType ? getKodeverknavn(arbeidsforhold.arbeidsforholdType) : '';
  }
  return createVisningsnavnForAktivitet(arbeidsgiverInformasjon, arbeidsforhold.eksternArbeidsforholdId);
};

const createRows = (relevanteAndelerAT, getKodeverknavn, arbeidsgiverOpplysningerPerId, readOnly, fieldArrayID) => {
  const rows = relevanteAndelerAT.map((andel, index) => (
    <Row key={`index${index + 1}`} className={styles.verticalAlignMiddle}>
      <Column xs="7">
        <Normaltekst>
          {lagVisningsnavn(andel.arbeidsforhold, getKodeverknavn, arbeidsgiverOpplysningerPerId)}
        </Normaltekst>
      </Column>
      <Column xs="5">
        <div id="readOnlyWrapper" className={readOnly ? styles.inputPadding : undefined}>
          <InputField
            name={`${fieldArrayID}.inntekt${index}`}
            validate={[required]}
            readOnly={readOnly}
            parse={parseCurrencyInput}
            bredde="S"
          />
        </div>
      </Column>
    </Row>
  ));

  return rows;
};
const AksjonspunktBehandlerAT = ({
  readOnly,
  alleAndelerIForstePeriode,
  alleKodeverk,
  arbeidsgiverOpplysningerPerId,
  fieldArrayID,
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  const relevanteAndelerAT = finnAndelerSomSkalVisesAT(alleAndelerIForstePeriode);
  return <>{createRows(relevanteAndelerAT, getKodeverknavn, arbeidsgiverOpplysningerPerId, readOnly, fieldArrayID)}</>;
};

AksjonspunktBehandlerAT.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  alleAndelerIForstePeriode: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  fieldArrayID: PropTypes.string.isRequired,
};

AksjonspunktBehandlerAT.transformValues = (values, relevanteStatuser, alleAndelerIForstePeriode) => {
  let inntektPrAndelList = null;
  let frilansInntekt = null;
  if (relevanteStatuser && relevanteStatuser.isArbeidstaker) {
    inntektPrAndelList = finnAndelerSomSkalVisesAT(alleAndelerIForstePeriode).map(({ andelsnr }, index) => {
      const overstyrtInntekt = values[`inntekt${index}`];
      return {
        inntekt:
          overstyrtInntekt === undefined || overstyrtInntekt === '' ? 0 : removeSpacesFromNumber(overstyrtInntekt),
        andelsnr,
      };
    });
  }
  if (relevanteStatuser && relevanteStatuser.isFrilanser) {
    frilansInntekt = removeSpacesFromNumber(values.inntektFrilanser);
  }
  return {
    kode: avklaringsbehovCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
    begrunnelse: values.ATFLVurdering,
    inntektFrilanser: frilansInntekt,
    inntektPrAndelList,
  };
};

AksjonspunktBehandlerAT.transformValuesForAT = (values, alleAndelerIForstePeriode) => {
  const inntektPrAndelList = finnAndelerSomSkalVisesAT(alleAndelerIForstePeriode).map(({ andelsnr }, index) => {
    const overstyrtInntekt = values[`inntekt${index}`];
    return {
      inntekt: overstyrtInntekt === undefined || overstyrtInntekt === '' ? 0 : removeSpacesFromNumber(overstyrtInntekt),
      andelsnr,
    };
  });
  return inntektPrAndelList;
};

export default AksjonspunktBehandlerAT;

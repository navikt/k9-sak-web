import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { Element } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { createVisningsnavnForAktivitet } from '@fpsak-frontend/fp-felles';

import { RadioGroupField, RadioOption, TextAreaField, behandlingForm } from '@fpsak-frontend/form';
import { hasValidText, maxLength, minLength, required, getKodeverknavnFn } from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { AksjonspunktHelpTextHTML, VerticalSpacer } from '@fpsak-frontend/shared-components';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';
import aksjonspunktStatus, { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import beregningsgrunnlagAksjonspunkterPropType from '../../propTypes/beregningsgrunnlagAksjonspunkterPropType';

import styles from './graderingUtenBG.less';
import AvsnittSkiller from '../redesign/AvsnittSkiller';

const maxLength1500 = maxLength(1500);
const minLength3 = minLength(3);

const formName = 'graderingUtenBGForm';
const begrunnelseFieldName = 'begrunnelse';
const radioFieldName = 'graderingUtenBGSettPaaVent';

const bestemVisning = (andel, getKodeverknavn) => {
  if (andel.arbeidsforhold && andel.aktivitetStatus && andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER) {
    return createVisningsnavnForAktivitet(andel.arbeidsforhold, getKodeverknavn);
  }
  const navn = getKodeverknavn(andel.aktivitetStatus);
  return andel.aktivitetStatus && navn ? navn.toLowerCase() : '';
};

const lagArbeidsgiverString = (andelerMedGraderingUtenBG, getKodeverknavn) => {
  if (!andelerMedGraderingUtenBG || andelerMedGraderingUtenBG.length < 1) {
    return '';
  }
  if (andelerMedGraderingUtenBG.length === 1) {
    return bestemVisning(andelerMedGraderingUtenBG[0], getKodeverknavn);
  }
  const arbeidsgiverVisningsnavn = andelerMedGraderingUtenBG.map(andel => bestemVisning(andel, getKodeverknavn));
  const sisteNavn = arbeidsgiverVisningsnavn.splice(andelerMedGraderingUtenBG.length - 1);
  const tekst = arbeidsgiverVisningsnavn.join(', ');
  return `${tekst} og ${sisteNavn}`;
};

const lagAksjonspunktViser = (aksjonspunktTekstId, andelerMedGraderingUtenBG, getKodeverknavn) => {
  if (aksjonspunktTekstId === undefined || aksjonspunktTekstId === null) {
    return undefined;
  }
  return (
    <AksjonspunktHelpTextHTML>
      <FormattedMessage
        key="GradringAksjonspunktHP"
        id={aksjonspunktTekstId}
        values={{ arbeidsforholdTekst: lagArbeidsgiverString(andelerMedGraderingUtenBG, getKodeverknavn) }}
      />
    </AksjonspunktHelpTextHTML>
  );
};

export const GraderingUtenBG2 = ({
  andelerMedGraderingUtenBG,
  readOnly,
  aksjonspunkter,
  getKodeverknavn,
  fieldArrayID,
}) => {
  const aksjonspunkt = aksjonspunkter
    ? aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_GRADERING_UTEN_BEREGNINGSGRUNNLAG)
    : undefined;
  if (!aksjonspunkt || !andelerMedGraderingUtenBG || andelerMedGraderingUtenBG.length === 0) {
    return null;
  }
  const aksjonspunktTekstId =
    andelerMedGraderingUtenBG.length > 1
      ? 'Beregningsgrunnlag.Gradering.AksjonspunkttekstFlereForhold'
      : 'Beregningsgrunnlag.Gradering.AksjonspunkttekstEtForhold';

  return (
    <div className={styles.graderingForm}>
      <AvsnittSkiller luftOver luftUnder dividerParagraf />

      <>
        {lagAksjonspunktViser(aksjonspunktTekstId, andelerMedGraderingUtenBG, getKodeverknavn)}
        <VerticalSpacer sixteenPx />
      </>
      <Element>
        <FormattedMessage id="Beregningsgrunnlag.Gradering.Tittel" />
      </Element>
      <VerticalSpacer sixteenPx />
      <Row>
        <Column xs="9">
          <RadioGroupField
            name={`${fieldArrayID}.${radioFieldName}`}
            validate={[required]}
            direction="vertical"
            readOnly={readOnly}
            isEdited={!isAksjonspunktOpen(aksjonspunkt.status.kode)}
          >
            <RadioOption
              label={<FormattedMessage id="Beregningsgrunnlag.Gradering.FordelingErRiktig" />}
              value={false}
            />
            <RadioOption label={<FormattedMessage id="Beregningsgrunnlag.Gradering.FordelingMåVurderes" />} value />
          </RadioGroupField>
        </Column>
      </Row>
      <Row>
        <Column xs="6">
          <TextAreaField
            name={`${fieldArrayID}.${begrunnelseFieldName}`}
            label={<FormattedMessage id="Beregningsgrunnlag.Forms.Vurdering" />}
            validate={[required, maxLength1500, minLength3, hasValidText]}
            maxLength={1500}
            readOnly={readOnly}
          />
        </Column>
      </Row>
    </div>
  );
};

GraderingUtenBG2.propTypes = {
  fieldArrayID: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  andelerMedGraderingUtenBG: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  aksjonspunkter: PropTypes.arrayOf(beregningsgrunnlagAksjonspunkterPropType).isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

export const transformValues = values => {
  const skalSettesPaaVent = values[radioFieldName];
  const begrunnelse = values[begrunnelseFieldName];
  return {
    kode: aksjonspunktCodes.VURDER_GRADERING_UTEN_BEREGNINGSGRUNNLAG,
    begrunnelse,
    skalSettesPaaVent,
  };
};

export const buildInitialValues = createSelector(
  [(state, ownProps) => ownProps.venteaarsakKode, (state, ownProps) => ownProps.aksjonspunkter],
  (venteKode, aksjonspunkter) => {
    const vurderGraderingUtenBGAP = aksjonspunkter
      ? aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_GRADERING_UTEN_BEREGNINGSGRUNNLAG)
      : undefined;
    const settPaaVentAap = aksjonspunkter
      ? aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.AUTO_VENT_GRADERING_UTEN_BEREGNINGSGRUNNLAG)
      : undefined;
    if (!vurderGraderingUtenBGAP || vurderGraderingUtenBGAP.status.kode !== aksjonspunktStatus.UTFORT) {
      return undefined;
    }
    if (!settPaaVentAap) {
      return {
        graderingUtenBGSettPaaVent: false,
        begrunnelse: vurderGraderingUtenBGAP.begrunnelse,
      };
    }
    if (settPaaVentAap.status.kode === aksjonspunktStatus.UTFORT) {
      return {
        graderingUtenBGSettPaaVent: false,
        begrunnelse: vurderGraderingUtenBGAP.begrunnelse,
      };
    }
    if (venteKode && venteKode === venteArsakType.VENT_GRADERING_UTEN_BEREGNINGSGRUNNLAG) {
      return {
        graderingUtenBGSettPaaVent: true,
        begrunnelse: vurderGraderingUtenBGAP.begrunnelse,
      };
    }
    return undefined;
  },
);

const mapStateToPropsFactory = (initialState, ownProps) => {
  const onSubmit = values => ownProps.submitCallback([transformValues(values)]);
  const getKodeverknavn = getKodeverknavnFn(ownProps.alleKodeverk, kodeverkTyper);
  return state => {
    const initialValues = buildInitialValues(state, ownProps);
    return {
      getKodeverknavn,
      onSubmit,
      initialValues,
    };
  };
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: formName,
    enableReinitialize: true,
  })(GraderingUtenBG2),
);

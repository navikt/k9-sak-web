import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';
import moment from 'moment';
import { connect } from 'react-redux';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT, getKodeverknavnFn } from '@fpsak-frontend/utils';
import avklaringsbehovCodes, { harAvklaringsbehov } from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import { AksjonspunktHelpTextTemp, VerticalSpacer } from '@fpsak-frontend/shared-components';
import createVisningsnavnForAktivitet from './util/createVisningsnavnForAktivitet';

const { FORDEL_BEREGNINGSGRUNNLAG } = avklaringsbehovCodes;

export const textCase = {
  GRADERING: 'GRADERING',
  REFUSJON: 'REFUSJON',
  PERMISJON: 'PERMISJON',
};

const formatDate = date => (date ? moment(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT) : '-');

export const byggListeSomStreng = listeMedStrenger => {
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
    return `${listeMedStrenger.splice(0, listeMedStrenger.length - 1).join(', ')} og ${
      listeMedStrenger[listeMedStrenger.length - 1]
    }`;
  }
  return '';
};

const lagPeriodeStreng = perioder => {
  const listeMedPeriodeStrenger = perioder.map(periode => {
    let periodeStreng = ` f.o.m. ${formatDate(periode.fom)}`;
    if (periode.tom && periode.tom !== null) {
      periodeStreng = periodeStreng.concat(` - t.o.m. ${formatDate(periode.tom)}`);
    }
    return periodeStreng;
  });
  return byggListeSomStreng(listeMedPeriodeStrenger);
};

export const createFordelArbeidsforholdString = (
  listOfArbeidsforhold,
  mTextCase,
  getKodeverknavn,
  arbeidsgiverOpplysningerPerId,
) => {
  const listOfStrings = listOfArbeidsforhold.map(arbeidsforhold => {
    const navnOgOrgnr = createVisningsnavnForAktivitet(arbeidsforhold, getKodeverknavn, arbeidsgiverOpplysningerPerId);
    if (mTextCase === textCase.GRADERING) {
      return (
        navnOgOrgnr +
        lagPeriodeStreng(arbeidsforhold.perioderMedGraderingEllerRefusjon.filter(({ erGradering }) => erGradering))
      );
    }
    if (mTextCase === textCase.REFUSJON) {
      return (
        navnOgOrgnr +
        lagPeriodeStreng(arbeidsforhold.perioderMedGraderingEllerRefusjon.filter(({ erRefusjon }) => erRefusjon))
      );
    }
    if (mTextCase === textCase.PERMISJON) {
      return {
        navnOgOrgnr,
        dato: formatDate(arbeidsforhold.permisjon.permisjonTom),
      };
    }
    return null;
  });
  return byggListeSomStreng(listOfStrings);
};

const createGraderingOrRefusjonString = (
  graderingArbeidsforhold,
  refusjonArbeidsforhold,
  permisjonMedGraderingEllerRefusjon,
  getKodeverknavn,
  arbeidsgiverOpplysningerPerId,
) => {
  const text = [];
  if (permisjonMedGraderingEllerRefusjon.length > 0) {
    const arbeidsforholdString = createFordelArbeidsforholdString(
      permisjonMedGraderingEllerRefusjon,
      textCase.PERMISJON,
      getKodeverknavn,
      arbeidsgiverOpplysningerPerId,
    );
    text.push(
      <FormattedMessage
        key="EndringBeregningsgrunnlagPermisjon"
        id="BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning.EndringBeregningsgrunnlag.Permisjon"
        values={{
          arbeidsforhold: arbeidsforholdString.navnOgOrgnr,
          dato: arbeidsforholdString.dato,
        }}
      />,
    );
  }
  if (graderingArbeidsforhold.length > 0) {
    const arbeidsforholdString = createFordelArbeidsforholdString(
      graderingArbeidsforhold,
      textCase.GRADERING,
      getKodeverknavn,
      arbeidsgiverOpplysningerPerId,
    );
    text.push(
      <FormattedMessage
        key="EndringBeregningsgrunnlagGradering"
        id="BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning.EndringBeregningsgrunnlag.Gradering"
        values={{ arbeidsforhold: arbeidsforholdString }}
      />,
    );
  }
  if (refusjonArbeidsforhold.length > 0) {
    const arbeidsforholdString = createFordelArbeidsforholdString(
      refusjonArbeidsforhold,
      textCase.REFUSJON,
      getKodeverknavn,
      arbeidsgiverOpplysningerPerId,
    );
    text.push(
      <FormattedMessage
        key="EndringBeregningsgrunnlagRefusjon"
        id="BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning.EndringBeregningsgrunnlag.Refusjon"
        values={{ arbeidsforhold: arbeidsforholdString }}
      />,
    );
  }
  if (text.length >= 1) {
    return text;
  }
  text.push(
    <FormattedMessage
      key="EndringBeregningsgrunnlagFastsetÅrsbeløp"
      id="BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning.EndringBeregningsgrunnlag.FastsetÅrsbeløp"
    />,
  );
  return text;
};

const harGraderingEllerRefusjon = perioderMedGraderingEllerRefusjon =>
  perioderMedGraderingEllerRefusjon.map(({ erRefusjon }) => erRefusjon).includes(true) ||
  perioderMedGraderingEllerRefusjon.map(({ erGradering }) => erGradering).includes(true);

const lagHelpTextsFordelBG = (endredeArbeidsforhold, getKodeverknavn, arbeidsgiverOpplysningerPerId) => {
  const gradering = endredeArbeidsforhold.filter(({ perioderMedGraderingEllerRefusjon }) =>
    perioderMedGraderingEllerRefusjon.map(({ erGradering }) => erGradering).includes(true),
  );
  const refusjon = endredeArbeidsforhold.filter(({ perioderMedGraderingEllerRefusjon }) =>
    perioderMedGraderingEllerRefusjon.map(({ erRefusjon }) => erRefusjon).includes(true),
  );
  const permisjonMedGraderingEllerRefusjon = endredeArbeidsforhold
    .filter(({ permisjon }) => permisjon !== undefined && permisjon !== null)
    .filter(({ perioderMedGraderingEllerRefusjon }) => harGraderingEllerRefusjon(perioderMedGraderingEllerRefusjon));
  const helpTexts = createGraderingOrRefusjonString(
    gradering,
    refusjon,
    permisjonMedGraderingEllerRefusjon,
    getKodeverknavn,
    arbeidsgiverOpplysningerPerId,
  );
  if (helpTexts.length === 2) {
    return [
      <>
        {helpTexts[0]}
        <VerticalSpacer eightPx />
        {helpTexts[1]}
      </>,
    ];
  }
  return helpTexts;
};

export const getHelpTextsFordelBG = createSelector(
  [
    ownProps => ownProps.beregningsgrunnlag,
    ownProps => ownProps.alleKodeverk,
    ownProps => ownProps.arbeidsgiverOpplysningerPerId,
    ownProps => ownProps.avklaringsbehov,
  ],
  (beregningsgrunnlag, alleKodeverk, arbeidsgiverOpplysningerPerId, avklaringsbehov) => {
    const fordelBG = beregningsgrunnlag.faktaOmFordeling.fordelBeregningsgrunnlag;
    const endredeArbeidsforhold = fordelBG ? fordelBG.arbeidsforholdTilFordeling : [];
    return harAvklaringsbehov(FORDEL_BEREGNINGSGRUNNLAG, avklaringsbehov)
      ? lagHelpTextsFordelBG(
          endredeArbeidsforhold,
          getKodeverknavnFn(alleKodeverk, kodeverkTyper),
          arbeidsgiverOpplysningerPerId,
        )
      : [];
  },
);

export const FordelingHelpTextImpl = ({ helpText, isAvklaringsbehovClosed }) => (
  <AksjonspunktHelpTextTemp isAksjonspunktOpen={!isAvklaringsbehovClosed}>{helpText}</AksjonspunktHelpTextTemp>
);

FordelingHelpTextImpl.propTypes = {
  isAvklaringsbehovClosed: PropTypes.bool.isRequired,
  helpText: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  helpText: getHelpTextsFordelBG(ownProps),
});

export default connect(mapStateToProps)(FordelingHelpTextImpl);

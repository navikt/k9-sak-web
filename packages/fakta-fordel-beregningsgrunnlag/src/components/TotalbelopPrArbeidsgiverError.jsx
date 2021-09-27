import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { formatCurrencyNoKr, removeSpacesFromNumber } from '@fpsak-frontend/utils';
import createVisningsnavnForAktivitet from './util/createVisningsnavnForAktivitet';

export const AAP_ARBEIDSGIVER_KEY = 'AAP_ARBEIDSGIVER_GRUNNLAG';

const BelopPrArbeidsgiverPropType = PropTypes.shape({
  key: PropTypes.string.isRequired,
  fastsattBelop: PropTypes.number.isRequired,
  beregningsgrunnlagPrAar: PropTypes.number.isRequired,
  arbeidsgiverNavn: PropTypes.string.isRequired,
});

const finnArbeidsgiverNavn = (andel, identifikator, getKodeverknavn, arbeidsgiverOpplysningerPerId) => {
  if (identifikator === AAP_ARBEIDSGIVER_KEY && !andel.arbeidsgiverIdent) {
    return null;
  }
  return createVisningsnavnForAktivitet(andel, getKodeverknavn, arbeidsgiverOpplysningerPerId);
};

const leggTilGrunnlagvalidering = (
  totalInntektArbeidsforholdList,
  andel,
  identifikator,
  getKodeverknavn,
  arbeidsgiverOpplysningerPerId,
) => {
  const newList = totalInntektArbeidsforholdList.slice();
  const idx = totalInntektArbeidsforholdList.findIndex(({ key }) => key === identifikator);
  if (idx !== -1) {
    const newGrunnlag = { ...totalInntektArbeidsforholdList[idx] };
    newGrunnlag.fastsattBelop += removeSpacesFromNumber(andel.fastsattBelop || '0');
    newGrunnlag.beregningsgrunnlagPrAar += removeSpacesFromNumber(andel.beregningsgrunnlagPrAar || '0');
    newGrunnlag.arbeidsgiverNavn = finnArbeidsgiverNavn(
      andel,
      identifikator,
      getKodeverknavn,
      arbeidsgiverOpplysningerPerId,
    );
    newList[idx] = newGrunnlag;
  } else {
    newList.push({
      key: identifikator,
      fastsattBelop: removeSpacesFromNumber(andel.fastsattBelop || '0'),
      beregningsgrunnlagPrAar:
        andel.beregningsgrunnlagPrAar || andel.beregningsgrunnlagPrAar === 0
          ? removeSpacesFromNumber(andel.beregningsgrunnlagPrAar)
          : null,
      arbeidsgiverNavn: finnArbeidsgiverNavn(andel, identifikator, getKodeverknavn, arbeidsgiverOpplysningerPerId),
    });
  }
  return newList;
};

export const lagTotalInntektArbeidsforholdList = (
  values,
  skalValidereMotBeregningsgunnlagPrAar,
  skalValidereMellomAAPOgArbeidsgiver,
  getKodeverknavn,
  arbeidsgiverOpplysningerPerId,
) => {
  let totalInntektArbeidsforholdList = [];
  if (values) {
    values.forEach(andel => {
      if (skalValidereMotBeregningsgunnlagPrAar(andel) || skalValidereMellomAAPOgArbeidsgiver(andel)) {
        if (skalValidereMellomAAPOgArbeidsgiver(andel)) {
          totalInntektArbeidsforholdList = leggTilGrunnlagvalidering(
            totalInntektArbeidsforholdList,
            andel,
            AAP_ARBEIDSGIVER_KEY,
            getKodeverknavn,
            arbeidsgiverOpplysningerPerId,
          );
        }
        if (!andel.nyttArbeidsforhold) {
          const navn = createVisningsnavnForAktivitet(andel, getKodeverknavn, arbeidsgiverOpplysningerPerId);
          totalInntektArbeidsforholdList = leggTilGrunnlagvalidering(
            totalInntektArbeidsforholdList,
            andel,
            navn,
            getKodeverknavn,
            arbeidsgiverOpplysningerPerId,
          );
        }
      }
    });
  }
  return totalInntektArbeidsforholdList;
};

const aapOgRefusjonValidering = value => (
  <div key={value.key}>
    <FormattedMessage
      id="BeregningInfoPanel.FordelBG.Validation.TotalFordelingForAAPOgArbeidsforholdIkkeHøyereEnnBeregningsgrunnlag"
      values={{ arbeidsgiver: value.arbeidsgiverNavn, inntekt: formatCurrencyNoKr(value.beregningsgrunnlagPrAar) }}
    />
  </div>
);

const arbeidsforholdValidering = value => (
  <div key={value.key}>
    <FormattedMessage
      id="BeregningInfoPanel.FordelBG.Validation.TotalFordelingForArbeidsforholdIkkeHøyereEnnBeregningsgrunnlag"
      values={{ arbeidsgiver: value.arbeidsgiverNavn, inntekt: formatCurrencyNoKr(value.beregningsgrunnlagPrAar) }}
    />
  </div>
);

/**
 *  TotalbelopPrArbeidsgiverError
 *
 * Presentasjonskomponent: Viser error for fastsatt totalbeløp for arbeidsgivere
 */
const TotalbelopPrArbeidsgiverError = ({ totalInntektPrArbeidsforhold }) => {
  const valideringList = totalInntektPrArbeidsforhold.filter(
    ({ fastsattBelop, beregningsgrunnlagPrAar }) => fastsattBelop > beregningsgrunnlagPrAar,
  );
  return (
    <div>
      {valideringList.map(v =>
        v.key === AAP_ARBEIDSGIVER_KEY ? aapOgRefusjonValidering(v) : arbeidsforholdValidering(v),
      )}
    </div>
  );
};

TotalbelopPrArbeidsgiverError.propTypes = {
  totalInntektPrArbeidsforhold: PropTypes.arrayOf(BelopPrArbeidsgiverPropType).isRequired,
};

export default TotalbelopPrArbeidsgiverError;

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ElementWrapper, FlexColumn, FlexContainer, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { DatepickerField, TextAreaField } from '@fpsak-frontend/form';
import {
  hasValidDate, hasValidText, maxLength, required, requiredIfNotPristine,
} from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { behandlingFormForstegangOgRevurdering } from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import { getTilrettelegging } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import AlertStripe from 'nav-frontend-alertstriper';
import { createSelector } from 'reselect';
import styles from './fodselOgTilretteleggingFaktaForm.less';
import TilretteleggingArbeidsforholdSection from './tilrettelegging/TilretteleggingArbeidsforholdSection';

const FODSEL_TILRETTELEGGING_FORM = 'FodselOgTilretteleggingForm';
const maxLength1500 = maxLength(1500);
const EMPTY_LIST = [];
const getAksjonspunkt = (aksjonspunkter) => aksjonspunkter.filter((ap) => ap.definisjon.kode === aksjonspunktCodes.FODSELTILRETTELEGGING)[0].begrunnelse;

const utledFormSectionName = (arbeidsforhold) => {
  let navn = arbeidsforhold.arbeidsgiverNavn;
  if (arbeidsforhold.arbeidsgiverIdent) {
    navn += arbeidsforhold.arbeidsgiverIdent;
  }
  if (arbeidsforhold.arbeidsforholdReferanse) {
    navn += arbeidsforhold.arbeidsforholdReferanse;
  }
  return navn;
};

/**
 * Svangerskapspenger
 * Presentasjonskomponent - viser tillrettlegging før svangerskapspenger
 */
export const FodselOgTilretteleggingFaktaForm = ({
  readOnly,
  hasOpenAksjonspunkter,
  fødselsdato,
  submittable,
  arbeidsforhold,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <FlexContainer fluid wrap>
      <FlexRow>
        <FlexColumn>
          <DatepickerField
            name="termindato"
            label={{ id: 'FodselOgTilretteleggingFaktaForm.Termindato' }}
            validate={[required, hasValidDate]}
            readOnly={readOnly}
          />
        </FlexColumn>
        { fødselsdato && (
          <FlexColumn>
            <DatepickerField
              name="fødselsdato"
              label={{ id: 'FodselOgTilretteleggingFaktaForm.Fodselsdato' }}
              validate={[required, hasValidDate]}
              readOnly={readOnly}
            />
          </FlexColumn>
        )}
      </FlexRow>
    </FlexContainer>
    <FlexContainer>
      <FlexRow>
        <FlexColumn>
          <VerticalSpacer eightPx />
          <Normaltekst className={styles.arbeidsforholdTittel}>
            <FormattedMessage id="FodselOgTilretteleggingFaktaForm.ArbeidsforholdDetErSoktTilretteleggingFor" />
          </Normaltekst>
        </FlexColumn>
      </FlexRow>
      <FlexRow>
        <FlexColumn className={styles.fullBredde}>
          {formProps.error && (
            <>
              <VerticalSpacer sixteenPx />
              <AlertStripe type="feil">
                <FormattedMessage id={formProps.error} />
              </AlertStripe>
            </>
          )}
        </FlexColumn>
      </FlexRow>
      <FlexRow>
        <FlexColumn className={styles.fullBredde}>
          { arbeidsforhold.map((a) => (
            <TilretteleggingArbeidsforholdSection
              key={utledFormSectionName(a)}
              readOnly={readOnly}
              arbeidsforhold={a}
              formSectionName={utledFormSectionName(a)}
            />
          ))}
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
    <FlexContainer>
      <FlexRow>
        <FlexColumn className={styles.halvBredde}>
          <VerticalSpacer eightPx />
          <TextAreaField
            name="begrunnelse"
            label={{ id: 'FodselOgTilretteleggingFaktaForm.BegrunnEndringene' }}
            validate={[requiredIfNotPristine, maxLength1500, hasValidText]}
            maxLength={1500}
            readOnly={readOnly}
          />
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
    <FlexContainer fluid wrap>
      <FlexRow>
        <FlexColumn>
          <ElementWrapper>
            <VerticalSpacer twentyPx />
            <FaktaSubmitButton
              formName={FODSEL_TILRETTELEGGING_FORM}
              isSubmittable={submittable && !formProps.error}
              isReadOnly={readOnly}
              hasOpenAksjonspunkter={hasOpenAksjonspunkter}
            />
          </ElementWrapper>
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
  </form>
);

FodselOgTilretteleggingFaktaForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  fødselsdato: PropTypes.string,
  submittable: PropTypes.bool.isRequired,
  arbeidsforhold: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

FodselOgTilretteleggingFaktaForm.defaultProps = {
  fødselsdato: '',
};

const transformValues = (values, arbeidsforhold) => {
  const bekreftetSvpArbeidsforholdList = [];
  arbeidsforhold.forEach((a) => { bekreftetSvpArbeidsforholdList.push(values[utledFormSectionName(a)]); });
  return ([{
    kode: aksjonspunktCodes.FODSELTILRETTELEGGING,
    ...values,
    bekreftetSvpArbeidsforholdList,
  }]);
};

const validateForm = (values, arbeidsforhold) => {
  const errors = {};
  const validerArbeidsforholdList = [];
  arbeidsforhold.forEach((a) => { validerArbeidsforholdList.push(values[utledFormSectionName(a)]); });
  const ingenTilretteleggingSkalBrukes = validerArbeidsforholdList.every((a) => (a.skalBrukes === false));
  if (ingenTilretteleggingSkalBrukes) {
    // eslint-disable-next-line no-underscore-dangle
    errors._error = 'FodselOgTilretteleggingFaktaForm.MinstEnTilretteleggingMåBrukes';
  }
  return errors;
};

const getArbeidsforhold = createSelector([getTilrettelegging], (tilrettelegging) => {
  const arbeidsforhold = tilrettelegging ? tilrettelegging.arbeidsforholdListe : [];
  if (arbeidsforhold === undefined || arbeidsforhold === null) {
    return EMPTY_LIST;
  }
  arbeidsforhold.sort((a, b) => a.arbeidsgiverNavn.localeCompare(b.arbeidsgiverNavn));
  return arbeidsforhold;
});

const getInitialArbeidsforholdValues = createSelector([getTilrettelegging], (tilrettelegging) => {
  const arbeidsforhold = tilrettelegging ? tilrettelegging.arbeidsforholdListe : [];
  if (arbeidsforhold === undefined || arbeidsforhold === null) {
    return EMPTY_LIST;
  }
  const arbeidsforholdValues = [];
  arbeidsforhold.forEach((a) => { arbeidsforholdValues[utledFormSectionName(a)] = { ...a }; });
  return arbeidsforholdValues;
});

const getFødselsdato = createSelector([getTilrettelegging], (tilrettelegging) => (tilrettelegging ? tilrettelegging.fødselsdato : ''));

const getInitialValues = createSelector(
  [behandlingSelectors.getAksjonspunkter, getTilrettelegging, getInitialArbeidsforholdValues, getFødselsdato],
  (aksjonspunkter, tilrettelegging, arbeidsforholdValues, fødselsdato) => ({
    termindato: tilrettelegging ? tilrettelegging.termindato : '',
    fødselsdato,
    begrunnelse: getAksjonspunkt(aksjonspunkter),
    ...arbeidsforholdValues,
  }),
);

const getOnSubmit = createSelector([(state, ownProps) => ownProps.submitCallback, getArbeidsforhold],
  (submitCallback, arbeidsforhold) => (values) => submitCallback(transformValues(values, arbeidsforhold)));

const getValidate = createSelector([getArbeidsforhold], (arbeidsforhold) => (values) => validateForm(values, arbeidsforhold));

const mapStateToProps = (state, ownProps) => ({
  initialValues: getInitialValues(state),
  fødselsdato: getFødselsdato(state),
  arbeidsforhold: getArbeidsforhold(state),
  validate: getValidate(state),
  onSubmit: getOnSubmit(state, ownProps),
});

export default connect(mapStateToProps)(behandlingFormForstegangOgRevurdering({
  form: FODSEL_TILRETTELEGGING_FORM,
})(FodselOgTilretteleggingFaktaForm));

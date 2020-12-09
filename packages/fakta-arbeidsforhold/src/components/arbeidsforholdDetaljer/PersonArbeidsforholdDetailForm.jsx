import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { arbeidsforholdPropType } from '@fpsak-frontend/prop-types';
import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import AksjonspunktAvklarArbeidsforholdText from '@fpsak-frontend/shared-components/src/AksjonspunktAvklarArbeidsforholdText';
import { Normaltekst } from 'nav-frontend-typografi';
import LeggTilArbeidsforholdFelter from './LeggTilArbeidsforholdFelter';
import ArbeidsforholdRadioknapper from './ArbeidsforholdRadioknapper';
import ArbeidsforholdBegrunnelse from './ArbeidsforholdBegrunnelse';
import PermisjonPeriode from './PermisjonPeriode';

import styles from './personArbeidsforholdDetailForm.less';

// ----------------------------------------------------------------------------------
// VARIABLES
// ----------------------------------------------------------------------------------

export const PERSON_ARBEIDSFORHOLD_DETAIL_FORM = 'PersonArbeidsforholdDetailForm';

// ----------------------------------------------------------------------------------
// METHODS
// ----------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------
// Component: PersonArbeidsforholdDetailForm
// ----------------------------------------------------------------------------------
/**
 * PersonArbeidsforholdDetailForm
 */
export const PersonArbeidsforholdDetailForm = ({
  hasReceivedInntektsmelding,
  readOnly,
  aktivtArbeidsforholdTillatUtenIM,
  arbeidsforhold,
  arbeidsforholdHandlingVerdi,
  behandlingId,
  behandlingVersjon,
  alleKodeverk,
  ...formProps
}) => (
  <div className={styles.container}>
    <PermisjonPeriode arbeidsforhold={arbeidsforhold} />
    <VerticalSpacer eightPx />
    <AksjonspunktAvklarArbeidsforholdText arbeidsforhold={arbeidsforhold} alleKodeverk={alleKodeverk} />
    <VerticalSpacer eightPx />
    <Normaltekst>
      <FormattedMessage id="PersonAksjonspunktText.SkalLeggesTil" />
    </Normaltekst>
    <Row>
      <VerticalSpacer twentyPx />
      <ArbeidsforholdRadioknapper
        formName={PERSON_ARBEIDSFORHOLD_DETAIL_FORM}
        hasReceivedInntektsmelding={hasReceivedInntektsmelding}
        arbeidsforhold={arbeidsforhold}
        aktivtArbeidsforholdTillatUtenIM={aktivtArbeidsforholdTillatUtenIM}
        arbeidsforholdHandlingVerdi={arbeidsforholdHandlingVerdi}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
      />
      <VerticalSpacer twentyPx />
      <ArbeidsforholdBegrunnelse
        readOnly={readOnly}
        formName={PERSON_ARBEIDSFORHOLD_DETAIL_FORM}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
      />
      <VerticalSpacer sixteenPx />
      <FlexContainer fluid>
        <FlexRow>
          <FlexColumn>
            <Hovedknapp mini spinner={false} onClick={formProps.handleSubmit} disabled={formProps.pristine}>
              <FormattedMessage id="PersonArbeidsforholdDetailForm.Oppdater" />
            </Hovedknapp>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </Row>
  </div>
);

PersonArbeidsforholdDetailForm.propTypes = {
  hasReceivedInntektsmelding: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  aktivtArbeidsforholdTillatUtenIM: PropTypes.bool.isRequired,
  arbeidsforhold: arbeidsforholdPropType.isRequired,
  arbeidsforholdHandlingVerdi: PropTypes.string,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  ...formPropTypes,
};

PersonArbeidsforholdDetailForm.defaultProps = {
  arbeidsforholdHandlingVerdi: undefined,
};

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = values => initialOwnProps.updateArbeidsforhold(values);
  return (state, ownProps) => {
    const { arbeidsforhold, readOnly, behandlingId, behandlingVersjon } = ownProps;
    return {
      initialValues: arbeidsforhold,
      readOnly: readOnly || (!arbeidsforhold.tilVurdering && !arbeidsforhold.erEndret),
      hasReceivedInntektsmelding: !!behandlingFormValueSelector(
        PERSON_ARBEIDSFORHOLD_DETAIL_FORM,
        behandlingId,
        behandlingVersjon,
      )(state, 'mottattDatoInntektsmelding'),
      vurderOmSkalErstattes: !!behandlingFormValueSelector(
        PERSON_ARBEIDSFORHOLD_DETAIL_FORM,
        behandlingId,
        behandlingVersjon,
      )(state, 'vurderOmSkalErstattes'),
      harErstattetEttEllerFlere: behandlingFormValueSelector(
        PERSON_ARBEIDSFORHOLD_DETAIL_FORM,
        behandlingId,
        behandlingVersjon,
      )(state, 'harErstattetEttEllerFlere'),
      isErstattArbeidsforhold:
        behandlingFormValueSelector(
          PERSON_ARBEIDSFORHOLD_DETAIL_FORM,
          behandlingId,
          behandlingVersjon,
        )(state, 'erNyttArbeidsforhold') === false,
      arbeidsforholdHandlingVerdi: behandlingFormValueSelector(
        PERSON_ARBEIDSFORHOLD_DETAIL_FORM,
        behandlingId,
        behandlingVersjon,
      )(state, 'arbeidsforholdHandlingField'),
      onSubmit,
    };
  };
};

const validateForm = values => ({
  ...LeggTilArbeidsforholdFelter.validate(values),
});

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: PERSON_ARBEIDSFORHOLD_DETAIL_FORM,
    validate: values => validateForm(values),
    enableReinitialize: true,
  })(PersonArbeidsforholdDetailForm),
);

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import AksjonspunktAvklarArbeidsforholdText from '@fpsak-frontend/shared-components/src/AksjonspunktAvklarArbeidsforholdText';
import { Normaltekst } from 'nav-frontend-typografi';
import { arbeidsforholdV2PropType } from '@fpsak-frontend/prop-types/src/arbeidsforholdPropType';
import LeggTilArbeidsforholdFelter from './LeggTilArbeidsforholdFelter';
import ArbeidsforholdRadioknapperV2 from './ArbeidsforholdRadioknapperV2';
import ArbeidsforholdBegrunnelse from './ArbeidsforholdBegrunnelse';

import styles from './personArbeidsforholdDetailForm.less';

export const PERSON_ARBEIDSFORHOLD_DETAIL_FORM_V2 = 'PersonArbeidsforholdDetailFormV2';

// ----------------------------------------------------------------------------------
// Component: PersonArbeidsforholdDetailFormV2
// ----------------------------------------------------------------------------------
/**
 * PersonArbeidsforholdDetailFormV2
 */
export const PersonArbeidsforholdDetailFormV2 = ({
  arbeidsforhold,
  behandlingId,
  behandlingVersjon,
  alleKodeverk,
  ...formProps
}) => (
  <div className={styles.container}>
    <VerticalSpacer eightPx />
    <AksjonspunktAvklarArbeidsforholdText arbeidsforhold={arbeidsforhold} alleKodeverk={alleKodeverk} />
    <VerticalSpacer eightPx />
    <Normaltekst className={styles.spørsmål}>
      <FormattedMessage id="PersonAksjonspunktText.SkalLeggesTil" />
    </Normaltekst>
    <Row>
      <VerticalSpacer twentyPx />
      <ArbeidsforholdRadioknapperV2
        formName={PERSON_ARBEIDSFORHOLD_DETAIL_FORM_V2}
        arbeidsforhold={arbeidsforhold}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
      />
      <VerticalSpacer twentyPx />
      <ArbeidsforholdBegrunnelse
        readOnly={false}
        formName={PERSON_ARBEIDSFORHOLD_DETAIL_FORM_V2}
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

PersonArbeidsforholdDetailFormV2.propTypes = {
  arbeidsforhold: arbeidsforholdV2PropType.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  skjulArbeidsforhold: PropTypes.func.isRequired,
  ...formPropTypes,
};

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  return (state, ownProps) => {
    const { arbeidsforhold, readOnly, behandlingId, behandlingVersjon, skjulArbeidsforhold } = ownProps;
    const onSubmit = values => {
      initialOwnProps.updateArbeidsforhold(values);
      skjulArbeidsforhold();
    };
    return {
      initialValues: arbeidsforhold,
      readOnly: readOnly || arbeidsforhold.aksjonspunktÅrsaker.length === 0,
      arbeidsforholdHandlingVerdi: behandlingFormValueSelector(
        PERSON_ARBEIDSFORHOLD_DETAIL_FORM_V2,
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
    form: PERSON_ARBEIDSFORHOLD_DETAIL_FORM_V2,
    validate: values => validateForm(values),
    enableReinitialize: true,
  })(PersonArbeidsforholdDetailFormV2),
);

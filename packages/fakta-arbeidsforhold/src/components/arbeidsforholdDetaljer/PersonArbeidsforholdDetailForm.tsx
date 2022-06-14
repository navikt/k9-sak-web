import React from 'react';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import AksjonspunktAvklarArbeidsforholdText from '@fpsak-frontend/shared-components/src/AksjonspunktAvklarArbeidsforholdText';
import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';
import LeggTilArbeidsforholdFelter from './LeggTilArbeidsforholdFelter';
import ArbeidsforholdRadioknapper from './ArbeidsforholdRadioknapper';
import ArbeidsforholdBegrunnelse from './ArbeidsforholdBegrunnelse';

import styles from './personArbeidsforholdDetailForm.less';
import aksjonspunktÅrsaker from '../../kodeverk/aksjonspunktÅrsaker';
import CustomArbeidsforhold from '../../typer/CustomArbeidsforholdTsType';

export const PERSON_ARBEIDSFORHOLD_DETAIL_FORM = 'PersonArbeidsforholdDetailForm';

const IMutenArbeidsforhold = arbeidsforhold =>
  arbeidsforhold.aksjonspunktÅrsaker.some(a => a === aksjonspunktÅrsaker.INNTEKTSMELDING_UTEN_ARBEIDSFORHOLD);

interface PureOwnProps {
  arbeidsforhold: ArbeidsforholdV2;
  behandlingId: number;
  behandlingVersjon: number;
  skjulArbeidsforhold: () => void;
  updateArbeidsforhold: (values) => void;
}

type FormValues = CustomArbeidsforhold;

interface MappedOwnProps {
  onSubmit: (formValues: FormValues) => void;
  validate: (formValues: FormValues, props: any) => void;
}

type Props = PureOwnProps & MappedOwnProps & InjectedFormProps & WrappedComponentProps;

// ----------------------------------------------------------------------------------
// Component: PersonArbeidsforholdDetailForm
// ----------------------------------------------------------------------------------
/**
 * PersonArbeidsforholdDetailForm
 */
export const PersonArbeidsforholdDetailForm = ({
  arbeidsforhold,
  behandlingId,
  behandlingVersjon,
  ...formProps
}: Props) => (
  <div className={styles.container}>
    <VerticalSpacer eightPx />
    <AksjonspunktAvklarArbeidsforholdText arbeidsforhold={arbeidsforhold} />
    <VerticalSpacer eightPx />
    {IMutenArbeidsforhold(arbeidsforhold) && (
      <Row>
        <ArbeidsforholdRadioknapper
          formName={PERSON_ARBEIDSFORHOLD_DETAIL_FORM}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
        />
        <ArbeidsforholdBegrunnelse
          readOnly={false}
          formName={PERSON_ARBEIDSFORHOLD_DETAIL_FORM}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
        />
        <VerticalSpacer sixteenPx />
        <FlexContainer>
          <FlexRow>
            <FlexColumn>
              <Hovedknapp mini spinner={false} onClick={formProps.handleSubmit} disabled={formProps.pristine}>
                <FormattedMessage id="PersonArbeidsforholdDetailForm.Oppdater" />
              </Hovedknapp>
            </FlexColumn>
          </FlexRow>
        </FlexContainer>
      </Row>
    )}
  </div>
);

const validateForm = values => ({
  ...LeggTilArbeidsforholdFelter.validate(values),
});

const mapStateToPropsFactory = (_initialState: any, initialOwnProps: PureOwnProps) => (state, ownProps) => {
  const { arbeidsforhold, readOnly, behandlingId, behandlingVersjon, skjulArbeidsforhold } = ownProps;
  const onSubmit = values => {
    initialOwnProps.updateArbeidsforhold(values);
    skjulArbeidsforhold();
  };
  const validate = (values: FormValues) => validateForm(values);
  return {
    initialValues: arbeidsforhold,
    readOnly: readOnly || arbeidsforhold.aksjonspunktÅrsaker.length === 0,
    arbeidsforholdHandlingVerdi: behandlingFormValueSelector(
      PERSON_ARBEIDSFORHOLD_DETAIL_FORM,
      behandlingId,
      behandlingVersjon,
    )(state, 'arbeidsforholdHandlingField'),
    onSubmit,
    validate,
  };
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: PERSON_ARBEIDSFORHOLD_DETAIL_FORM,
    enableReinitialize: true,
  })(injectIntl(PersonArbeidsforholdDetailForm)),
);

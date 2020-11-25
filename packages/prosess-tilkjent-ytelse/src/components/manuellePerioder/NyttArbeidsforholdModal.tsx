import React, { FC } from 'react';
import { connect } from 'react-redux';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { InjectedFormProps, FieldArray } from 'redux-form';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { behandlingForm, InputField } from '@fpsak-frontend/form';
import {
  FlexColumn,
  FlexContainer,
  FlexRow,
  VerticalSpacer,
  PeriodFieldArray,
} from '@fpsak-frontend/shared-components';
import { hasValidOrgNumber, required } from '@fpsak-frontend/utils';
import styles from './periode.less';

const defaultArbeidsforhold = {
  fom: '',
  navn: '',
  arbeidsgiverIdentifikator: '',
};

const ArbeidsfroholdForm = ({ fields }) => (
  <PeriodFieldArray
    shouldShowAddButton
    fields={fields}
    textCode="TilkjentYtelse.NyAndel"
    emptyPeriodTemplate={defaultArbeidsforhold}
  >
    {periodeElementFieldId => (
      <FlexRow key={periodeElementFieldId}>
        <FlexColumn className={styles.fullWidth}>
          <InputField
            label={{ id: 'TilkjentYtelse.ArbeidsgiverNavn' }}
            name={`${periodeElementFieldId}.navn`}
            validate={[required]}
            format={value => value}
          />

          <InputField
            label={{ id: 'TilkjentYtelse.ArbeidsgiverOrgnummer' }}
            name={`${periodeElementFieldId}.arbeidsgiverIdentifikator`}
            validate={[required, hasValidOrgNumber]}
            format={value => value}
          />
        </FlexColumn>
      </FlexRow>
    )}
  </PeriodFieldArray>
);

interface OwnProps {
  showModal?: boolean;
  closeEvent: (...args: any[]) => any;
  cancelEvent: (...args: any[]) => any;
}

export const NyttArbeidsforholdModal: FC<OwnProps & WrappedComponentProps & InjectedFormProps> = ({
  showModal,
  closeEvent,
  cancelEvent,
  intl,
  ...formProps
}) => {
  return (
    <Modal
      className={styles.modal}
      isOpen={showModal}
      contentLabel="Nytt arbeidsforhold"
      onRequestClose={closeEvent}
      closeButton={false}
      shouldCloseOnOverlayClick={false}
    >
      <FlexContainer wrap>
        <FieldArray name="arbeidsforhold" component={ArbeidsfroholdForm} />
        <FlexRow>
          <FlexColumn className={styles.right}>
            <VerticalSpacer eightPx />
            <Hovedknapp mini className={styles.button} onClick={formProps.handleSubmit} disabled={formProps.pristine}>
              {intl.formatMessage({ id: 'TilkjentYtelse.Ok' })}
            </Hovedknapp>
            <Knapp
              mini
              onClick={() => {
                cancelEvent();
                formProps.destroy();
              }}
            >
              {intl.formatMessage({ id: 'TilkjentYtelse.Avbryt' })}
            </Knapp>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </Modal>
  );
};

NyttArbeidsforholdModal.defaultProps = {
  showModal: false,
};

interface PureOwnProps {
  closeEvent: (...args: any[]) => any;
}

const mapStateToPropsFactory = (_initialState: any, ownProps: PureOwnProps) => {
  const onSubmit = (values: any) => ownProps.closeEvent(values);

  return () => {
    return {
      initialValues: {
        arbeidsforhold: [defaultArbeidsforhold],
      },
      onSubmit,
    };
  };
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: 'nyttArbeidsforholdForm',
  })(injectIntl(NyttArbeidsforholdModal)),
);

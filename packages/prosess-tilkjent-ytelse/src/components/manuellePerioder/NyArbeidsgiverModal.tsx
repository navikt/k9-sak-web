import { behandlingForm, InputField } from '@fpsak-frontend/form';
import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { hasValidOrgNumber, required } from '@fpsak-frontend/utils';
import { Button, Modal } from '@navikt/ds-react';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import styles from './periode.module.css';

const defaultArbeidsgiver = {
  navn: '',
  orgNr: '',
};

interface OwnProps {
  showModal?: boolean;
  closeEvent: (...args: any[]) => any;
  cancelEvent: (...args: any[]) => any;
}

export const NyArbeidsgiverModal = ({
  showModal = false,
  closeEvent,
  cancelEvent,
  intl,
  ...formProps
}: OwnProps & WrappedComponentProps & InjectedFormProps) => (
  <Modal className={styles.modal} open={showModal} aria-label="Ny arbeidsgiver" onClose={closeEvent}>
    <Modal.Body>
      <FlexContainer wrap>
        <FlexRow>
          <FlexColumn className={styles.fullWidth}>
            <InputField
              label={{ id: 'TilkjentYtelse.ArbeidsgiverNavn' }}
              name="navn"
              validate={[required]}
              format={value => value}
            />

            <InputField
              label={{ id: 'TilkjentYtelse.ArbeidsgiverOrgnummer' }}
              name="orgNr"
              validate={[required, hasValidOrgNumber]}
              format={value => value}
            />
          </FlexColumn>
        </FlexRow>
        <FlexRow>
          <FlexColumn className={styles.right}>
            <VerticalSpacer eightPx />
            <Button
              variant="primary"
              size="small"
              className={styles.button}
              onClick={formProps.handleSubmit}
              disabled={formProps.pristine}
            >
              {intl.formatMessage({ id: 'TilkjentYtelse.Ok' })}
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => {
                cancelEvent();
                formProps.destroy();
              }}
            >
              {intl.formatMessage({ id: 'TilkjentYtelse.Avbryt' })}
            </Button>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </Modal.Body>
  </Modal>
);

interface PureOwnProps {
  closeEvent: (...args: any[]) => any;
}

const mapStateToPropsFactory = (_initialState: any, ownProps: PureOwnProps) => {
  const onSubmit = (values: any) => ownProps.closeEvent(values);

  return () => ({
    initialValues: defaultArbeidsgiver,
    onSubmit,
  });
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: 'nyArbeidsgiverForm',
  })(injectIntl(NyArbeidsgiverModal)),
);

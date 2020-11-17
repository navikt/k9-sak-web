import React, { FC } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import moment from 'moment';
import { InjectedFormProps } from 'redux-form';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';

import { behandlingForm } from '@fpsak-frontend/form';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer } from '@fpsak-frontend/shared-components';

import styles from './periode.less';

interface OwnProps {
  showModal?: boolean;
  closeEvent: (...args: any[]) => any;
  cancelEvent: (...args: any[]) => any;
  periode: any;
}

export const SlettPeriodeModalImpl: FC<OwnProps & WrappedComponentProps & InjectedFormProps> = ({
  showModal,
  closeEvent,
  cancelEvent,
  intl,
  periode,
  ...formProps
}) => {
  const fom = moment(periode.fom).format(DDMMYYYY_DATE_FORMAT);
  const tom = moment(periode.tom).format(DDMMYYYY_DATE_FORMAT);
  return (
    <Modal
      className={styles.modal}
      isOpen={showModal}
      contentLabel="Perioden slettes"
      onRequestClose={closeEvent}
      closeButton={false}
      shouldCloseOnOverlayClick={false}
    >
      <FlexContainer wrap>
        <FlexRow>
          <FlexColumn className={styles.iconContainer}>
            <Image
              className={styles.icon}
              src={innvilgetImageUrl}
              alt={intl.formatMessage({ id: 'TilkjentYtelse.Ok' })}
            />
          </FlexColumn>
          <FlexColumn className={styles.fullWidth}>
            <Normaltekst className={styles.modalLabel}>
              <FormattedMessage id="TilkjentYtelse.PeriodenSlettes" values={{ fom, tom }} />
            </Normaltekst>
          </FlexColumn>
        </FlexRow>

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

SlettPeriodeModalImpl.defaultProps = {
  showModal: false,
};

interface PureOwnProps {
  closeEvent: (...args: any[]) => any;
  periode: any;
}

const mapStateToPropsFactory = (_initialState: any, ownProps: PureOwnProps) => {
  const onSubmit = (values: any) => ownProps.closeEvent(values);

  return () => {
    const formName = `slettPeriodeForm-${ownProps.periode.id}`;
    return {
      form: formName,
      onSubmit,
    };
  };
};

// @ts-ignore Dynamisk navn på form
const SlettPeriodeModal = connect(mapStateToPropsFactory)(
  behandlingForm({
    enableReinitialize: true,
  })(injectIntl(SlettPeriodeModalImpl)),
);

export default SlettPeriodeModal;

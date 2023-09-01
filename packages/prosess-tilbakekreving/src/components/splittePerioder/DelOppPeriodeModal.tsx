import moment from 'moment/moment';
import AlertStripe from 'nav-frontend-alertstriper';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';

import { behandlingForm, DatepickerField } from '@fpsak-frontend/form';
import {
  dateAfterOrEqual,
  dateBeforeOrEqual,
  DDMMYYYY_DATE_FORMAT,
  hasValidDate,
  ISO_DATE_FORMAT,
  required,
} from '@fpsak-frontend/utils';

import styles from './delOppPeriodeModal.css';

type PeriodeData = {
  fom: string;
  tom: string;
};

interface OwnProps {
  periodeData: PeriodeData;
  cancelEvent: () => void;
  showModal: boolean;
  finnesBelopMed0Verdi: boolean;
}

export const DelOppPeriodeModalImpl = ({
  intl,
  periodeData,
  showModal,
  cancelEvent,
  finnesBelopMed0Verdi,
  ...formProps
}: OwnProps & WrappedComponentProps & InjectedFormProps) => (
  <Modal
    isOpen={showModal}
    contentLabel={intl.formatMessage({ id: 'DelOppPeriodeModalImpl.ModalDescription' })}
    onRequestClose={cancelEvent}
    closeButton={false}
    className={styles.modal}
    shouldCloseOnOverlayClick={false}
  >
    <Element className={styles.marginTop}>
      <FormattedMessage id="DelOppPeriodeModalImpl.DelOppPerioden" />
    </Element>
    <div className={styles.marginTop}>
      <Undertekst>
        <FormattedMessage id="DelOppPeriodeModalImpl.Periode" />
      </Undertekst>
      <Normaltekst>
        {`${moment(periodeData.fom.toString()).format(DDMMYYYY_DATE_FORMAT)} - ${moment(
          periodeData.tom.toString(),
        ).format(DDMMYYYY_DATE_FORMAT)}`}
      </Normaltekst>
    </div>
    <div className={styles.marginTop}>
      <Undertekst>
        <FormattedMessage id="DelOppPeriodeModalImpl.AngiTomDato" />
      </Undertekst>
      <DatepickerField
        name="ForstePeriodeTomDato"
        // @ts-ignore tror denne trengs fordi fpsak-frontend/form ikkje er fullstendig konvertert til typescript
        className={styles.datePicker}
        validate={[required, hasValidDate]}
        disabledDays={{ before: moment(periodeData.fom).toDate(), after: moment(periodeData.tom).toDate() }}
        initialMonth={moment(periodeData.tom).toDate()}
      />
    </div>
    {finnesBelopMed0Verdi && (
      <AlertStripe type="feil">
        <FormattedMessage id="DelOppPeriodeModalImpl.BelopEr0" />
      </AlertStripe>
    )}
    <Row className={styles.marginTop}>
      <Column>
        <Hovedknapp
          mini
          htmlType="button"
          className={styles.button}
          onClick={formProps.handleSubmit}
          disabled={formProps.pristine}
        >
          <FormattedMessage id="DelOppPeriodeModalImpl.Ok" />
        </Hovedknapp>
        <Knapp htmlType="button" mini onClick={cancelEvent} className={styles.cancelButton}>
          <FormattedMessage id="DelOppPeriodeModalImpl.Avbryt" />
        </Knapp>
      </Column>
    </Row>
  </Modal>
);

const validateForm = (value: any, periodeData: PeriodeData) => {
  if (
    value.ForstePeriodeTomDato &&
    (dateAfterOrEqual(value.ForstePeriodeTomDato)(moment(periodeData.tom.toString()).subtract(1, 'day')) ||
      dateBeforeOrEqual(value.ForstePeriodeTomDato)(periodeData.fom))
  ) {
    return {
      ForstePeriodeTomDato: [{ id: 'DelOppPeriodeModalImpl.DatoUtenforPeriode' }],
    };
  }
  return null;
};

const transformValues = (values: any, periodeData: PeriodeData) => {
  const addDay = moment(values.ForstePeriodeTomDato).add(1, 'days');
  const forstePeriode = {
    fom: periodeData.fom,
    tom: values.ForstePeriodeTomDato,
  };
  const andrePeriode = {
    fom: addDay.format(ISO_DATE_FORMAT),
    tom: periodeData.tom,
  };
  return {
    forstePeriode,
    andrePeriode,
  };
};

interface PureOwnProps {
  periodeData: PeriodeData;
  splitPeriod: (perioder: {
    forstePeriode: { fom: string; tom: string };
    andrePeriode: { fom: string; tom: string };
  }) => void;
}

export const mapStateToPropsFactory = (_initialState, ownProps: PureOwnProps) => {
  const validate = values => validateForm(values, ownProps.periodeData);
  const onSubmit = values => ownProps.splitPeriod(transformValues(values, ownProps.periodeData));
  return () => ({
    validate,
    onSubmit,
  });
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: 'DelOppPeriode',
  })(injectIntl(DelOppPeriodeModalImpl)),
);

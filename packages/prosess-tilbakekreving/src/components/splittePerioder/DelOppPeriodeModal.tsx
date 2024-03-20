import { DatepickerField, behandlingForm } from '@fpsak-frontend/form';
import {
  DDMMYYYY_DATE_FORMAT,
  ISO_DATE_FORMAT,
  dateAfterOrEqual,
  dateBeforeOrEqual,
  hasValidDate,
  required,
} from '@fpsak-frontend/utils';
import { BodyShort, Button, Detail, Label, Modal } from '@navikt/ds-react';
import moment from 'moment/moment';
import AlertStripe from 'nav-frontend-alertstriper';
import { Column, Row } from 'nav-frontend-grid';
import React from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import styles from './delOppPeriodeModal.module.css';

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
    open={showModal}
    aria-label={intl.formatMessage({ id: 'DelOppPeriodeModalImpl.ModalDescription' })}
    onClose={cancelEvent}
    className={styles.modal}
  >
    <Modal.Header closeButton={false}>
      <Label size="small" as="p">
        <FormattedMessage id="DelOppPeriodeModalImpl.DelOppPerioden" />
      </Label>
    </Modal.Header>
    <Modal.Body>
      <Detail>
        <FormattedMessage id="DelOppPeriodeModalImpl.Periode" />
      </Detail>
      <BodyShort size="small">
        {`${moment(periodeData.fom.toString()).format(DDMMYYYY_DATE_FORMAT)} - ${moment(
          periodeData.tom.toString(),
        ).format(DDMMYYYY_DATE_FORMAT)}`}
      </BodyShort>
      <div className={styles.marginTop}>
        <Detail>
          <FormattedMessage id="DelOppPeriodeModalImpl.AngiTomDato" />
        </Detail>
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
          <Button
            variant="primary"
            size="small"
            type="button"
            className={styles.button}
            onClick={formProps.handleSubmit}
            disabled={formProps.pristine}
          >
            <FormattedMessage id="DelOppPeriodeModalImpl.Ok" />
          </Button>
          <Button variant="secondary" type="button" size="small" onClick={cancelEvent} className={styles.cancelButton}>
            <FormattedMessage id="DelOppPeriodeModalImpl.Avbryt" />
          </Button>
        </Column>
      </Row>
    </Modal.Body>
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

import { DatepickerField, behandlingForm } from '@fpsak-frontend/form';
import {
  DDMMYYYY_DATE_FORMAT,
  ISO_DATE_FORMAT,
  dateAfterOrEqual,
  dateBeforeOrEqual,
  hasValidDate,
  required,
} from '@fpsak-frontend/utils';
import { Alert, BodyShort, Button, Detail, Label, Modal } from '@navikt/ds-react';
import moment from 'moment/moment';
import { Column, Row } from 'nav-frontend-grid';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import styles from './delOppPeriodeModal.module.css';

export const DelOppPeriodeModalImpl = ({
  periodeData,
  showModal,
  cancelEvent,
  intl,
  finnesBelopMed0Verdi,
  ...formProps
}) => (
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
          className={styles.datePicker}
          validate={[required, hasValidDate]}
          disabledDays={{ before: moment(periodeData.fom).toDate(), after: moment(periodeData.tom).toDate() }}
          initialMonth={moment(periodeData.tom).toDate()}
        />
      </div>
      {finnesBelopMed0Verdi && (
        <Alert size="small" variant="error">
          <FormattedMessage id="DelOppPeriodeModalImpl.BelopEr0" />
        </Alert>
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

DelOppPeriodeModalImpl.propTypes = {
  periodeData: PropTypes.shape({
    fom: PropTypes.string.isRequired,
    tom: PropTypes.string.isRequired,
  }).isRequired,
  cancelEvent: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
  ...formPropTypes,
};

const validateForm = (value, periodeData) => {
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

const transformValues = (values, periodeData) => {
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

export const mapStateToPropsFactory = (initialState, ownProps) => {
  const validate = values => validateForm(values, ownProps.periodeData);
  const onSubmit = values => ownProps.splitPeriod(transformValues(values, ownProps.periodeData));
  return () => ({
    validate,
    onSubmit,
  });
};

const DelOppPeriodeModal = connect(mapStateToPropsFactory)(
  behandlingForm({
    form: 'DelOppPeriode',
  })(DelOppPeriodeModalImpl),
);

export default injectIntl(DelOppPeriodeModal);

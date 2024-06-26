import {
  Label,
  RadioGroupField,
  behandlingForm,
  behandlingFormValueSelector,
  hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '@fpsak-frontend/form';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import { AksjonspunktHelpText, ArrowBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT, required } from '@fpsak-frontend/utils';
import { ProsessStegBegrunnelseTextField, ProsessStegSubmitButton } from '@k9-sak-web/prosess-felles';
import { BodyShort, Detail, Heading } from '@navikt/ds-react';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';

import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';

import styles from './checkPersonStatusForm.module.css';

/**
 * CheckPersonStatusForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for kontroll av personstatus.
 */
export const CheckPersonStatusFormImpl = ({
  intl,
  behandlingId,
  behandlingVersjon,
  readOnly,
  readOnlySubmitButton,
  fortsettBehandling,
  originalPersonstatusName,
  personStatuser,
  gjeldeneFom,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <Heading size="small" level="2">
      {intl.formatMessage({ id: 'CheckPersonStatusForm.CheckInformation' })}
    </Heading>
    <VerticalSpacer twentyPx />
    <AksjonspunktHelpText isAksjonspunktOpen={!readOnlySubmitButton && !readOnly}>
      {[intl.formatMessage({ id: 'CheckPersonStatusForm.PersonStatus' }, { status: originalPersonstatusName })]}
    </AksjonspunktHelpText>
    <VerticalSpacer twentyPx />
    {gjeldeneFom && (
      <BodyShort size="small">
        <FormattedMessage
          id="CheckPersonStatusForm.GjeldendeFom"
          values={{ dato: moment(gjeldeneFom).format(DDMMYYYY_DATE_FORMAT) }}
        />
      </BodyShort>
    )}
    <VerticalSpacer twentyPx />
    <div className={styles.radioGroup}>
      <RadioGroupField
        name="fortsettBehandling"
        validate={[required]}
        readOnly={readOnly}
        radios={[
          {
            value: false,
            label: intl.formatMessage({ id: 'CheckPersonStatusForm.HaltBehandling' }),
          },
          {
            value: true,
            label: intl.formatMessage({ id: 'CheckPersonStatusForm.ContinueBehandling' }),
          },
        ]}
      />
      {fortsettBehandling === true && (
        <ArrowBox alignOffset={readOnly ? 0 : 198}>
          <Detail>{intl.formatMessage({ id: 'CheckPersonStatusForm.SetPersonStatus' })}</Detail>
          <VerticalSpacer eightPx />
          <RadioGroupField
            name="personstatus"
            validate={[required]}
            readOnly={readOnly}
            radios={personStatuser.map(d => ({
              value: d.kode,
              label: <Label input={d.navn} textOnly />,
            }))}
          />
        </ArrowBox>
      )}
    </div>
    <VerticalSpacer sixteenPx />
    <ProsessStegBegrunnelseTextField readOnly={readOnly} />
    <VerticalSpacer sixteenPx />
    <ProsessStegSubmitButton
      formName={formProps.form}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      isReadOnly={readOnly}
      isSubmittable={!readOnlySubmitButton}
      isBehandlingFormSubmitting={isBehandlingFormSubmitting}
      isBehandlingFormDirty={isBehandlingFormDirty}
      hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
    />
  </form>
);

CheckPersonStatusFormImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  /**
   * Skal input-felter vises eller ikke
   */
  readOnly: PropTypes.bool.isRequired,
  /**
   * Skal knapp for å bekrefte data være trykkbar
   */
  readOnlySubmitButton: PropTypes.bool.isRequired,
  gjeldeneFom: PropTypes.string,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  ...formPropTypes,
};

const getValgtOpplysning = avklartPersonstatus => {
  if (avklartPersonstatus && avklartPersonstatus.overstyrtPersonstatus) {
    const statusKode = avklartPersonstatus.overstyrtPersonstatus;
    if (
      statusKode === personstatusType.DOD ||
      statusKode === personstatusType.BOSATT ||
      statusKode === personstatusType.UTVANDRET
    ) {
      return statusKode;
    }
  }
  return undefined;
};

export const buildInitialValues = createSelector(
  [
    (state, ownProps) => ownProps.behandlingHenlagt,
    (state, ownProps) => ownProps.aksjonspunkter,
    (state, ownProps) => ownProps.personopplysninger,
    (state, ownProps) => ownProps.kodeverkNavnFraKode,
  ],
  (behandlingHenlagt, aksjonspunkter, personopplysning, kodeverkNavnFraKode) => {
    const shouldContinueBehandling = !behandlingHenlagt;
    const { avklartPersonstatus, personstatus } = personopplysning;
    const aksjonspunkt = aksjonspunkter[0];
    return {
      originalPersonstatusName:
        avklartPersonstatus && avklartPersonstatus.orginalPersonstatus
          ? kodeverkNavnFraKode(avklartPersonstatus.orginalPersonstatus, KodeverkType.PERSONSTATUS_TYPE)
          : kodeverkNavnFraKode(personstatus, KodeverkType.PERSONSTATUS_TYPE),

      fortsettBehandling: isAksjonspunktOpen(aksjonspunkt.status) ? undefined : shouldContinueBehandling,
      personstatus: getValgtOpplysning(avklartPersonstatus),
      ...ProsessStegBegrunnelseTextField.buildInitialValues(aksjonspunkter),
    };
  },
);

const getFilteredKodeverk = createSelector(
  [(state, ownProps) => ownProps.alleKodeverk[kodeverkTyper.PERSONSTATUS_TYPE]],
  kodeverk =>
    kodeverk.filter(
      ps =>
        ps.kode === personstatusType.DOD ||
        ps.kode === personstatusType.BOSATT ||
        ps.kode === personstatusType.UTVANDRET,
    ),
);

const transformValues = (values, aksjonspunkter) => ({
  fortsettBehandling: values.fortsettBehandling,
  personstatus: values.personstatus,
  kode: aksjonspunkter[0].definisjon,
  ...ProsessStegBegrunnelseTextField.transformValues(values),
});

const formName = 'CheckPersonStatusForm';

const mapStateToPropsFactory = (initialState, staticOwnProps) => {
  const onSubmit = values => staticOwnProps.submitCallback([transformValues(values, staticOwnProps.aksjonspunkter)]);
  const personStatuser = getFilteredKodeverk(initialState, staticOwnProps);
  return (state, ownProps) => {
    const { behandlingId, behandlingVersjon } = ownProps;
    return {
      initialValues: buildInitialValues(state, ownProps),
      ...behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(
        state,
        'fortsettBehandling',
        'originalPersonstatusName',
      ),
      personStatuser,
      onSubmit,
    };
  };
};

const CheckPersonStatusForm = connect(mapStateToPropsFactory)(
  injectIntl(
    behandlingForm({
      form: formName,
    })(CheckPersonStatusFormImpl),
  ),
);

export default CheckPersonStatusForm;

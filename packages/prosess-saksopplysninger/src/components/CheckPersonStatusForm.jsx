import {
  RadioGroupField,
  RadioOption,
  behandlingForm,
  behandlingFormValueSelector,
  hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '@k9-sak-web/form';
import { isAksjonspunktOpen } from '@k9-sak-web/kodeverk/src/aksjonspunktStatus';
import kodeverkTyper from '@k9-sak-web/kodeverk/src/kodeverkTyper';
import personstatusType from '@k9-sak-web/kodeverk/src/personstatusType';
import { ProsessStegBegrunnelseTextField, ProsessStegSubmitButton } from '@k9-sak-web/prosess-felles';
import { AksjonspunktHelpText, ArrowBox, VerticalSpacer } from '@k9-sak-web/shared-components';
import { DDMMYYYY_DATE_FORMAT, getKodeverknavnFn, required } from '@k9-sak-web/utils';
import { BodyShort, Detail, Heading } from '@navikt/ds-react';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
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
      <RadioGroupField name="fortsettBehandling" validate={[required]} readOnly={readOnly}>
        <RadioOption label={{ id: 'CheckPersonStatusForm.HaltBehandling' }} value={false} />
        <RadioOption label={{ id: 'CheckPersonStatusForm.ContinueBehandling' }} value />
      </RadioGroupField>
      {fortsettBehandling === true && (
        <ArrowBox alignOffset={readOnly ? 0 : 198}>
          <Detail>{intl.formatMessage({ id: 'CheckPersonStatusForm.SetPersonStatus' })}</Detail>
          <VerticalSpacer eightPx />
          <RadioGroupField name="personstatus" validate={[required]} readOnly={readOnly}>
            {personStatuser.map(d => (
              <RadioOption key={d.kode} value={d.kode} label={d.navn} />
            ))}
          </RadioGroupField>
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

CheckPersonStatusFormImpl.defaultProps = {
  gjeldeneFom: undefined,
};

const getValgtOpplysning = avklartPersonstatus => {
  if (avklartPersonstatus && avklartPersonstatus.overstyrtPersonstatus) {
    const statusKode = avklartPersonstatus.overstyrtPersonstatus.kode;
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
    (state, ownProps) => ownProps.alleKodeverk,
  ],
  (behandlingHenlagt, aksjonspunkter, personopplysning, alleKodeverk) => {
    const shouldContinueBehandling = !behandlingHenlagt;
    const { avklartPersonstatus, personstatus } = personopplysning;
    const aksjonspunkt = aksjonspunkter[0];
    const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
    return {
      originalPersonstatusName:
        avklartPersonstatus && avklartPersonstatus.orginalPersonstatus
          ? getKodeverknavn(avklartPersonstatus.orginalPersonstatus)
          : getKodeverknavn(personstatus),
      fortsettBehandling: isAksjonspunktOpen(aksjonspunkt.status.kode) ? undefined : shouldContinueBehandling,
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
  kode: aksjonspunkter[0].definisjon.kode,
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

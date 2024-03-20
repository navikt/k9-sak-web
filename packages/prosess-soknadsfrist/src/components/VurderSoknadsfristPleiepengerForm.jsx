import {
  DatepickerField,
  RadioGroupField,
  RadioOption,
  behandlingForm,
  behandlingFormValueSelector,
  hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '@fpsak-frontend/form';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { AksjonspunktHelpTextTemp, ArrowBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT, dateBeforeOrEqualToToday, hasValidDate, required } from '@fpsak-frontend/utils';
import { ProsessStegBegrunnelseTextField, ProsessStegSubmitButton } from '@k9-sak-web/prosess-felles';
import { BodyShort, Detail, Heading, Label } from '@navikt/ds-react';
import moment from 'moment';
import { Column, Row } from 'nav-frontend-grid';
import Panel from 'nav-frontend-paneler';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';

import styles from './vurderSoknadsfristPleiepengerForm.module.css';

const isEdited = (hasAksjonspunkt, gyldigSenFremsetting) => hasAksjonspunkt && gyldigSenFremsetting !== undefined;

/**
 * VurderSoknadsfristPleiepengerForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for vurdering av søknadsfristvilkåret.
 */
export const VurderSoknadsfristPleiepengerFormImpl = ({
  readOnly,
  readOnlySubmitButton,
  mottattDato,
  antallDagerSoknadLevertForSent,
  gyldigSenFremsetting,
  hasAksjonspunkt,
  soknadsperiodeStart,
  soknadsperiodeSlutt,
  soknadsfristdato,
  behandlingId,
  behandlingVersjon,
  isApOpen,
  ...formProps
}) => (
  <>
    <Heading size="small" level="2">
      <FormattedMessage id="VurderSoknadsfristPleiepengerForm.Soknadsfrist" />
    </Heading>
    <VerticalSpacer twentyPx />
    <AksjonspunktHelpTextTemp isAksjonspunktOpen={isApOpen}>
      {[
        <FormattedMessage
          key="VurderSoknadsfristPleiepengerForm"
          id="VurderSoknadsfristPleiepengerForm.AksjonspunktHelpText"
          values={{
            numberOfDays: antallDagerSoknadLevertForSent,
            soknadsfristdato: moment(soknadsfristdato).format(DDMMYYYY_DATE_FORMAT),
          }}
        />,
      ]}
    </AksjonspunktHelpTextTemp>
    <VerticalSpacer twentyPx />
    <Row>
      <Column xs="6">
        <Panel className={styles.panel}>
          <Label size="small" as="p">
            <FormattedMessage id="VurderSoknadsfristPleiepengerForm.Vurder" />
          </Label>
          <ul className={styles.hyphen}>
            <li>
              <FormattedMessage id="VurderSoknadsfristPleiepengerForm.Punkt1" />
            </li>
            <li>
              <FormattedMessage id="VurderSoknadsfristPleiepengerForm.Punkt2" />
            </li>
            <li>
              <FormattedMessage id="VurderSoknadsfristPleiepengerForm.Punkt3" />
            </li>
          </ul>
        </Panel>
      </Column>
      <Column xs="6">
        <Row className={styles.marginBottom}>
          <Column xs="6">
            <Detail>
              <FormattedMessage id="VurderSoknadsfristPleiepengerForm.SoknadMottatt" />
            </Detail>
            {mottattDato && <BodyShort size="small">{moment(mottattDato).format(DDMMYYYY_DATE_FORMAT)}</BodyShort>}
          </Column>
          <Column xs="6">
            <Detail>
              <FormattedMessage id="VurderSoknadsfristPleiepengerForm.SoknadPeriode" />
            </Detail>
            <BodyShort size="small">
              {`${moment(soknadsperiodeStart).format(DDMMYYYY_DATE_FORMAT)} - ${moment(soknadsperiodeSlutt).format(
                DDMMYYYY_DATE_FORMAT,
              )}`}
            </BodyShort>
          </Column>
        </Row>
      </Column>
    </Row>
    <form className={styles.marginTop} onSubmit={formProps.handleSubmit}>
      <div>
        <ProsessStegBegrunnelseTextField readOnly={readOnly} />
        <VerticalSpacer sixteenPx />
        <div>
          <RadioGroupField
            name="gyldigSenFremsetting"
            validate={[required]}
            readOnly={readOnly}
            isEdited={isEdited(hasAksjonspunkt, gyldigSenFremsetting)}
          >
            <RadioOption value label={<FormattedMessage id="VurderSoknadsfristPleiepengerForm.GyldigGrunn" />} />
            <RadioOption
              value={false}
              label={<FormattedMessage id="VurderSoknadsfristPleiepengerForm.IkkeGyldigGrunn" />}
            />
          </RadioGroupField>
        </div>
        {gyldigSenFremsetting && (
          <Row>
            <Column xs="4">
              <ArrowBox>
                <DatepickerField
                  name="ansesMottatt"
                  readOnly={readOnly}
                  label={{ id: 'VurderSoknadsfristPleiepengerForm.NyMottattDato' }}
                  validate={[required, hasValidDate, dateBeforeOrEqualToToday]}
                />
              </ArrowBox>
            </Column>
          </Row>
        )}
        <VerticalSpacer twentyPx />
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
      </div>
    </form>
  </>
);

VurderSoknadsfristPleiepengerFormImpl.propTypes = {
  readOnlySubmitButton: PropTypes.bool.isRequired,
  antallDagerSoknadLevertForSent: PropTypes.number,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  isApOpen: PropTypes.bool.isRequired,
  hasAksjonspunkt: PropTypes.bool,
  ...formPropTypes,
};

VurderSoknadsfristPleiepengerFormImpl.defaultProps = {
  antallDagerSoknadLevertForSent: undefined,
  hasAksjonspunkt: false,
};

export const buildInitialValues = createSelector(
  [
    (state, ownProps) => ownProps.aksjonspunkter,
    (state, ownProps) => ownProps.mottattDato,
    (state, ownProps) => ownProps.uttakPeriodeGrense,
  ],
  (aksjonspunkter, mottattDato, uttaksperiodegrense = {}) => ({
    gyldigSenFremsetting: isAksjonspunktOpen(aksjonspunkter[0].status.kode)
      ? undefined
      : uttaksperiodegrense.mottattDato !== mottattDato,
    ansesMottatt: uttaksperiodegrense.mottattDato,
    ...ProsessStegBegrunnelseTextField.buildInitialValues(aksjonspunkter),
  }),
);

const transformValues = (values, aksjonspunkter) => ({
  harGyldigGrunn: values.gyldigSenFremsetting,
  ansesMottattDato: values.ansesMottatt,
  kode: aksjonspunkter[0].definisjon.kode,
  ...ProsessStegBegrunnelseTextField.transformValues(values),
});

const formName = 'VurderSoknadsfristPleiepengerForm';

const mapStateToPropsFactory = (initialState, staticOwnProps) => {
  const uttaksperiodegrense = staticOwnProps.uttakPeriodeGrense;
  const { aksjonspunkter } = staticOwnProps;
  const onSubmit = values => staticOwnProps.submitCallback([transformValues(values, aksjonspunkter)]);

  return (state, ownProps) => {
    const { behandlingId, behandlingVersjon } = ownProps;
    return {
      onSubmit,
      initialValues: buildInitialValues(state, ownProps),
      gyldigSenFremsetting: behandlingFormValueSelector(
        formName,
        behandlingId,
        behandlingVersjon,
      )(state, 'gyldigSenFremsetting'),
      antallDagerSoknadLevertForSent: uttaksperiodegrense ? uttaksperiodegrense.antallDagerLevertForSent : {},
      soknadsperiodeStart: uttaksperiodegrense ? uttaksperiodegrense.soknadsperiodeStart : {},
      soknadsperiodeSlutt: uttaksperiodegrense ? uttaksperiodegrense.soknadsperiodeSlutt : {},
      soknadsfristdato: uttaksperiodegrense ? uttaksperiodegrense.soknadsfristForForsteUttaksdato : {},
      hasAksjonspunkt: aksjonspunkter.length > 0,
      ...behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'gyldigSenFremsetting'),
    };
  };
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: formName,
  })(VurderSoknadsfristPleiepengerFormImpl),
);

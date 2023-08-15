import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import moment from 'moment';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { AssessedBy } from '@navikt/ft-plattform-komponenter';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { FaktaBegrunnelseTextField } from '@k9-sak-web/fakta-felles';
import { getKodeverknavnFn, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { BorderBox, FlexColumn, FlexContainer, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';

import OppholdINorgeOgAdresserFaktaPanel from './OppholdINorgeOgAdresserFaktaPanel';
import PerioderMedMedlemskapFaktaPanel from './PerioderMedMedlemskapFaktaPanel';
import StatusForBorgerFaktaPanel from './StatusForBorgerFaktaPanel';

const { AVKLAR_OPPHOLDSRETT, AVKLAR_LOVLIG_OPPHOLD } = aksjonspunktCodes;

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap === aksjonspunktCode);

export const OppholdInntektOgPeriodeForm = ({
  valgtPeriode,
  readOnly,
  initialValues,
  submittable,
  periodeResetCallback,
  alleKodeverk,
  alleMerknaderFraBeslutter,
  behandlingId,
  behandlingVersjon,
  saksbehandlere,
  ...formProps
}) => (
  <BorderBox>
    <OppholdINorgeOgAdresserFaktaPanel
      readOnly={readOnly}
      id={valgtPeriode.id}
      alleKodeverk={alleKodeverk}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
    />
    <VerticalSpacer twentyPx />
    <PerioderMedMedlemskapFaktaPanel
      readOnly={readOnly}
      id={valgtPeriode.id}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      alleKodeverk={alleKodeverk}
    />
    {(hasAksjonspunkt(AVKLAR_OPPHOLDSRETT, valgtPeriode.aksjonspunkter) ||
      hasAksjonspunkt(AVKLAR_LOVLIG_OPPHOLD, valgtPeriode.aksjonspunkter)) && (
      <StatusForBorgerFaktaPanel
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        readOnly={readOnly}
        id={valgtPeriode.id}
        alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      />
    )}
    <VerticalSpacer twentyPx />
    {valgtPeriode.aksjonspunkter && valgtPeriode.aksjonspunkter.length > 0 && (
      <>
        <FaktaBegrunnelseTextField
          isReadOnly={readOnly}
          isSubmittable={submittable}
          hasBegrunnelse={!!initialValues.begrunnelse}
        />
        {!!initialValues.begrunnelse && (
          <AssessedBy
            name={saksbehandlere[valgtPeriode?.vurdertAv] || valgtPeriode?.vurdertAv}
            date={valgtPeriode?.vurdertTidspunkt}
          />
        )}
      </>
    )}

    <VerticalSpacer twentyPx />
    <FlexContainer fluid>
      <FlexRow>
        <FlexColumn>
          <Hovedknapp mini htmlType="button" onClick={formProps.handleSubmit} disabled={formProps.pristine}>
            <FormattedMessage id="OppholdInntektOgPeriode.Oppdater" />
          </Hovedknapp>
        </FlexColumn>
        <FlexColumn>
          <Knapp htmlType="button" mini onClick={periodeResetCallback}>
            <FormattedMessage id="OppholdInntektOgPeriode.Avbryt" />
          </Knapp>
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
  </BorderBox>
);

OppholdInntektOgPeriodeForm.propTypes = {
  selectedId: PropTypes.string,
  readOnly: PropTypes.bool.isRequired,
  updateOppholdInntektPeriode: PropTypes.func.isRequired,
  submittable: PropTypes.bool.isRequired,
  valgtPeriode: PropTypes.shape().isRequired,
  initialValues: PropTypes.shape().isRequired,
  periodeResetCallback: PropTypes.func.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  saksbehandlere: PropTypes.shape(),
};

OppholdInntektOgPeriodeForm.defaultProps = {
  selectedId: undefined,
};

const transformValues = values => ({
  begrunnelse: values.begrunnelse || '---',
  ...values,
});

const buildInitialValues = createSelector(
  [
    (state, ownProps) => ownProps.valgtPeriode,
    (state, ownProps) => ownProps.aksjonspunkter,
    (state, ownProps) =>
      behandlingFormValueSelector(
        'OppholdInntektOgPerioderForm',
        ownProps.behandlingId,
        ownProps.behandlingVersjon,
      )(state, 'soknad'),
    (state, ownProps) =>
      behandlingFormValueSelector(
        'OppholdInntektOgPerioderForm',
        ownProps.behandlingId,
        ownProps.behandlingVersjon,
      )(state, 'person'),
    (state, ownProps) =>
      behandlingFormValueSelector(
        'OppholdInntektOgPerioderForm',
        ownProps.behandlingId,
        ownProps.behandlingVersjon,
      )(state, 'medlemskapPerioder'),
    (state, ownProps) =>
      behandlingFormValueSelector(
        'OppholdInntektOgPerioderForm',
        ownProps.behandlingId,
        ownProps.behandlingVersjon,
      )(state, 'gjeldendeFom'),
    (state, ownProps) => ownProps.alleKodeverk,
  ],
  (valgtPeriode, alleAksjonspunkter, soknad, person, medlemskapPerioder, gjeldendeFom, alleKodeverk) => {
    const aksjonspunkter = alleAksjonspunkter
      .filter(
        ap =>
          valgtPeriode.aksjonspunkter.includes(ap.definisjon.kode) ||
          ap.definisjon.kode === aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP,
      )
      .filter(ap => ap.definisjon.kode !== aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN);
    let oppholdValues = {};
    let confirmValues = {};
    if (
      hasAksjonspunkt(AVKLAR_OPPHOLDSRETT, valgtPeriode.aksjonspunkter) ||
      hasAksjonspunkt(AVKLAR_LOVLIG_OPPHOLD, valgtPeriode.aksjonspunkter)
    ) {
      oppholdValues = StatusForBorgerFaktaPanel.buildInitialValues(valgtPeriode, aksjonspunkter);
    }
    if (valgtPeriode.aksjonspunkter.length > 0) {
      confirmValues = FaktaBegrunnelseTextField.buildInitialValues([valgtPeriode]);
    }
    const kodeverkFn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
    return {
      ...valgtPeriode,
      ...OppholdINorgeOgAdresserFaktaPanel.buildInitialValues(soknad, valgtPeriode, aksjonspunkter),
      ...PerioderMedMedlemskapFaktaPanel.buildInitialValues(
        valgtPeriode,
        medlemskapPerioder,
        soknad,
        aksjonspunkter,
        kodeverkFn,
      ),
      fom: gjeldendeFom || moment().format(ISO_DATE_FORMAT),
      ...oppholdValues,
      ...confirmValues,
    };
  },
);

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = values => initialOwnProps.updateOppholdInntektPeriode(transformValues(values));
  return (state, ownProps) => {
    const { valgtPeriode, submittable } = ownProps;
    const formName = `OppholdInntektOgPeriodeForm-${valgtPeriode.id}`;
    return {
      initialValues: buildInitialValues(state, ownProps),
      form: formName,
      submittable,
      onSubmit,
    };
  };
};

export default connect(mapStateToPropsFactory)(
  injectIntl(
    behandlingForm({
      enableReinitialize: true,
    })(OppholdInntektOgPeriodeForm),
  ),
);

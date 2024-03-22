import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { createSelector } from 'reselect';
import { formPropTypes, change as reduxFormChange, reset as reduxFormReset } from 'redux-form';
import { Button } from '@navikt/ds-react';
// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';
import { behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix } from '@fpsak-frontend/form';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { AksjonspunktHelpTextTemp, VerticalSpacer } from '@fpsak-frontend/shared-components';
// eslint-disable-next-line import/no-duplicates
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { guid } from '@fpsak-frontend/utils';
import MedlemskapEndringerTabell from './MedlemskapEndringerTabell';
import OppholdInntektOgPeriodeForm from './OppholdInntektOgPeriodeForm';

const {
  AVKLAR_OM_BRUKER_ER_BOSATT,
  AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
  AVKLAR_OPPHOLDSRETT,
  AVKLAR_LOVLIG_OPPHOLD,
  AVKLAR_FORTSATT_MEDLEMSKAP,
} = aksjonspunktCodes;

const getHelpTexts = aksjonspunkter => {
  const helpTexts = [];
  if (hasAksjonspunkt(AVKLAR_FORTSATT_MEDLEMSKAP, aksjonspunkter)) {
    helpTexts.push(<FormattedMessage key="HarFortsattMedlemskap" id="MedlemskapInfoPanel.HarFortsattMedlemskap" />);
  }
  if (hasAksjonspunkt(AVKLAR_OM_BRUKER_ER_BOSATT, aksjonspunkter)) {
    helpTexts.push(<FormattedMessage key="ErSokerBosattINorge" id="MedlemskapInfoPanel.ErSokerBosattINorge" />);
  }
  if (hasAksjonspunkt(AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE, aksjonspunkter)) {
    helpTexts.push(
      <FormattedMessage key="GyldigMedlemFolketrygden" id="MedlemskapInfoPanel.GyldigMedlemFolketrygden" />,
    );
  }
  if (hasAksjonspunkt(AVKLAR_OPPHOLDSRETT, aksjonspunkter)) {
    helpTexts.push(
      <FormattedMessage key="EOSBorgerMedOppholdsrett1" id="MedlemskapInfoPanel.EOSBorgerMedOppholdsrett" />,
    );
  }
  if (hasAksjonspunkt(AVKLAR_LOVLIG_OPPHOLD, aksjonspunkter)) {
    helpTexts.push(
      <FormattedMessage key="IkkeEOSBorgerMedLovligOpphold" id="MedlemskapInfoPanel.IkkeEOSBorgerMedLovligOpphold" />,
    );
  }
  return helpTexts;
};

const createNewPerioder = (perioder, id, values) => {
  const updatedIndex = perioder.findIndex(p => p.id === id);
  const updatedPeriode = perioder.find(p => p.id === id);

  return [
    ...perioder.slice(0, updatedIndex),
    {
      ...updatedPeriode,
      ...values,
    },
    ...perioder.slice(updatedIndex + 1),
  ];
};

/**
 * OppholdInntektOgPerioderForm
 *
 * Presentasjonskomponent. Har ansvar for å sette opp Redux Formen for faktapenelet til Medlemskapsvilkåret.
 */
export class OppholdInntektOgPerioderForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      valgtPeriode: undefined,
    };

    this.velgPeriodeCallback = this.velgPeriodeCallback.bind(this);
    this.updateOppholdInntektPeriode = this.updateOppholdInntektPeriode.bind(this);
    this.isConfirmButtonDisabled = this.isConfirmButtonDisabled.bind(this);
    this.periodeResetCallback = this.periodeResetCallback.bind(this);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    const { initialValues } = this.props;
    const defaultPeriode = initialValues.perioder ? initialValues.perioder[0] : {};
    this.setValgtPeriode(defaultPeriode);
  }

  setValgtPeriode(valgtPeriode) {
    if (!valgtPeriode) {
      const { initialValues } = this.props;
      const defaultPeriode = initialValues.perioder ? initialValues.perioder[0] : {};
      this.setState({ valgtPeriode: defaultPeriode });
    }
    this.setState({ valgtPeriode });
  }

  periodeResetCallback() {
    const { behandlingFormPrefix, reduxFormReset: formReset } = this.props;
    const { valgtPeriode } = this.state;
    if (valgtPeriode) {
      formReset(`${behandlingFormPrefix}.OppholdInntektOgPeriodeForm-${valgtPeriode.id}`);
    }
  }

  velgPeriodeCallback(p, id, periode) {
    const valgtPeriode = {
      id,
      ...periode,
    };
    this.setState({ valgtPeriode });
  }

  updateOppholdInntektPeriode(values) {
    const { behandlingFormPrefix, perioder, reduxFormChange: formChange } = this.props;

    const updatedPeriode = perioder.find(p => p.id === values.id);

    const newPeriodeObject = {
      ...updatedPeriode,
      ...values,
    };

    const newPerioder = createNewPerioder(perioder, values.id, newPeriodeObject);

    formChange(`${behandlingFormPrefix}.OppholdInntektOgPerioderForm`, 'perioder', newPerioder);
  }

  isConfirmButtonDisabled() {
    const { perioder, readOnly, submitting, dirty } = this.props;

    if (!dirty) {
      return true;
    }

    if (perioder && perioder.length > 0) {
      const ubekreftPerioder = perioder.filter(
        periode => periode.aksjonspunkter.length > 0 && periode.begrunnelse === null,
      );

      if (ubekreftPerioder.length > 0) {
        return true;
      }
    }

    return submitting || readOnly;
  }

  render() {
    const {
      hasOpenAksjonspunkter,
      submittable,
      aksjonspunkter,
      readOnly,
      submitting,
      isRevurdering,
      behandlingId,
      behandlingVersjon,
      alleKodeverk,
      alleMerknaderFraBeslutter,
      saksbehandlere,
      ...formProps
    } = this.props;

    const { valgtPeriode } = this.state;
    const isApOpen = hasOpenAksjonspunkter || !submittable;

    return (
      <form onSubmit={formProps.handleSubmit} data-testid="OppholdInntektOgPerioderForm">
        <AksjonspunktHelpTextTemp isAksjonspunktOpen={isApOpen}>
          {getHelpTexts(aksjonspunkter)}
        </AksjonspunktHelpTextTemp>
        {hasAksjonspunkt(AVKLAR_FORTSATT_MEDLEMSKAP, aksjonspunkter) && (
          <MedlemskapEndringerTabell
            selectedId={valgtPeriode ? valgtPeriode.id : undefined}
            velgPeriodeCallback={this.velgPeriodeCallback}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
          />
        )}

        {valgtPeriode && (
          <OppholdInntektOgPeriodeForm
            isRevurdering={isRevurdering}
            readOnly={readOnly}
            valgtPeriode={valgtPeriode}
            aksjonspunkter={aksjonspunkter}
            submittable={submittable}
            updateOppholdInntektPeriode={this.updateOppholdInntektPeriode}
            periodeResetCallback={this.periodeResetCallback}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            alleKodeverk={alleKodeverk}
            alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
            saksbehandlere={saksbehandlere}
          />
        )}

        <VerticalSpacer twentyPx />
        <Button variant="primary" size="small" disabled={this.isConfirmButtonDisabled()} loading={submitting}>
          <FormattedMessage id="OppholdInntektOgPerioder.Bekreft" />
        </Button>
      </form>
    );
  }
}

OppholdInntektOgPerioderForm.propTypes = {
  intl: PropTypes.shape().isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType.isRequired).isRequired,
  readOnly: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  isRevurdering: PropTypes.bool.isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  ...formPropTypes,
};

const medlemAksjonspunkter = [
  AVKLAR_OM_BRUKER_ER_BOSATT,
  AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
  AVKLAR_OPPHOLDSRETT,
  AVKLAR_LOVLIG_OPPHOLD,
  AVKLAR_FORTSATT_MEDLEMSKAP,
];

export const transformValues = (values, aksjonspunkter) => {
  const aktiveMedlemAksjonspunkter = aksjonspunkter
    .filter(ap => medlemAksjonspunkter.includes(ap.definisjon))
    .filter(ap => ap.erAktivt)
    .filter(ap => ap.definisjon !== aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN);

  return aktiveMedlemAksjonspunkter.map(ap => ({
    kode: ap.definisjon,
    // begrunnelse: '', //TODO (Hallvard): Kan vi fjerne denne?
    bekreftedePerioder: values.perioder
      .map(periode => {
        // TODO Kor mange felt er det i bekreftetPeriode? Kan ein heller laga nytt objekt med det ein treng?
        const {
          /* eslint-disable @typescript-eslint/no-unused-vars */
          id,
          fixedMedlemskapPerioder,
          foreldre,
          manuellVurderingType,
          hasBosattAksjonspunkt,
          hasPeriodeAksjonspunkt,
          isBosattAksjonspunktClosed,
          isPeriodAksjonspunktClosed,
          opphold,
          personopplysninger,
          fom,
          termindato,
          årsaker,
          /* eslint-enable @typescript-eslint/no-unused-vars */
          ...bekreftetPeriode
        } = periode;
        return bekreftetPeriode;
      })
      .filter(
        periode =>
          periode.aksjonspunkter.includes(ap.definisjon) ||
          (periode.aksjonspunkter.length > 0 && ap.definisjon === aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP),
      ),
  }));
};

const buildInitalValues = createSelector(
  [ownProps => ownProps.soknad, ownProps => ownProps.fagsakPerson, ownProps => ownProps.medlemskap],
  (soknad, person, medlem = {}) => ({
    soknad,
    person,
    gjeldendeFom: medlem.fom,
    medlemskapPerioder: medlem.medlemskapPerioder || [],
    perioder: (medlem.perioder || []).map(periode => ({
      ...periode,
      id: guid(),
    })),
  }),
);

export const isBehandlingRevurderingFortsattMedlemskap = createSelector(
  [ownProps => ownProps.behandlingType, ownProps => ownProps.medlemskap],
  (type, medlem = {}) => type === behandlingType.REVURDERING && !!medlem.fom,
);

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = values => initialOwnProps.submitCallback(transformValues(values, initialOwnProps.aksjonspunkter));
  const hasOpenAksjonspunkter = initialOwnProps.aksjonspunkter.some(ap => isAksjonspunktOpen(ap.status));
  const perioder = [];

  return (state, ownProps) => {
    const { behandlingId, behandlingVersjon } = ownProps;
    const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);
    return {
      behandlingFormPrefix,
      onSubmit,
      hasOpenAksjonspunkter,
      initialValues: buildInitalValues(ownProps),
      perioder:
        behandlingFormValueSelector(
          'OppholdInntektOgPerioderForm',
          behandlingId,
          behandlingVersjon,
        )(state, 'perioder') || perioder,
      isRevurdering: isBehandlingRevurderingFortsattMedlemskap(ownProps),
    };
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      reduxFormChange,
      reduxFormReset,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToPropsFactory,
  mapDispatchToProps,
)(
  behandlingForm({
    form: 'OppholdInntektOgPerioderForm',
    // Fiks for https://jira.adeo.no/browse/TSF-998 kopiert fra fp-frontend
    // ref: https://github.com/navikt/fp-frontend
    // /commit/6a17a716da87e38fbb6a678757eaeea69dcd30ac#diff-fa5cf1a3780389bacd27f386442774846ee8b01b664337d8cf9bafa8dec243bd
    // enableReinitialize: true,
  })(injectIntl(OppholdInntektOgPerioderForm)),
);

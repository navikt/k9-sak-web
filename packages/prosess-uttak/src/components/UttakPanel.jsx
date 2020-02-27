import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import periodeResultatType from '@fpsak-frontend/kodeverk/src/periodeResultatType';
import { AksjonspunktHelpTextTemp, ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import Uttak from './Uttak';



const formName = 'UttakForm';

const hentApTekst = (uttaksresultat, isApOpen, aksjonspunkter) => {
  const helptTextAksjonspunkter = aksjonspunkter.filter((ap) => ap.definisjon.kode !== aksjonspunktCodes.FASTSETT_UTTAKPERIODER
    && ap.definisjon.kode !== aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER);

  const uttakPanelAksjonsPunktKoder = {
    5072: 'UttakPanel.Aksjonspunkt.5072',
    5073: 'UttakPanel.Aksjonspunkt.5073',
    5074: 'UttakPanel.Aksjonspunkt.5074',
    5075: 'UttakPanel.Aksjonspunkt.5075',
    5076: 'UttakPanel.Aksjonspunkt.5076',
    5077: 'UttakPanel.Aksjonspunkt.5077',
    5078: 'UttakPanel.Aksjonspunkt.5078',
    5079: 'UttakPanel.Aksjonspunkt.5079',
    5098: 'UttakPanel.Aksjonspunkt.5098',
  };

  const texts = [];
  const helpText = uttaksresultat.perioderSøker.find((p) => (p.periodeResultatType.kode === periodeResultatType.MANUELL_BEHANDLING));

  const overstyrApHelpTextOpen = aksjonspunkter.length === 1
    && aksjonspunkter[0].definisjon.kode === aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER
    && aksjonspunkter[0].status.kode !== 'UTFO';

  const overstyrApHelpTextUtfort = aksjonspunkter.length === 1
    && aksjonspunkter[0].definisjon.kode === aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER
    && aksjonspunkter[0].status.kode === 'UTFO';


  helptTextAksjonspunkter.forEach((ap) => {
    if (uttakPanelAksjonsPunktKoder[ap.definisjon.kode]) {
      texts.push(<FormattedMessage key="aksjonspunktTekst" id={uttakPanelAksjonsPunktKoder[ap.definisjon.kode]} />);
    }
  });

  if (helpText) {
    texts.push(<FormattedMessage key="generellTekst" id="UttakPanel.Aksjonspunkt.Generell" />);
  }

  if (overstyrApHelpTextOpen) {
    texts.push(<FormattedMessage key="aksjonspunktTekst" id="UttakPanel.Overstyrt.KontrollerPaNytt" />);
  }
  if (overstyrApHelpTextUtfort) {
    texts.push(<FormattedMessage key="aksjonspunktTekst" id="UttakPanel.Overstyrt.Utfort" />);
  }

  if (!isApOpen) {
    texts.push(<FormattedMessage key="behandlet" id="UttakPanel.Aksjonspunkt.Behandlet" />);
  }
  return texts;
};

export const UttakPanelImpl = ({
  aksjonspunkter,
  soknad,
  person,
  behandlingId,
  behandlingType,
  behandlingStatus,
  alleKodeverk,
  behandlingVersjon,
  employeeHasAccess,
  behandlingsresultat,
  readOnly,
  manuellOverstyring,
  fagsak,
  isApOpen,
  intl,
  ...formProps
}) => (
  <>
    <Undertittel>
      <FormattedMessage id="UttakPanel.Title" />
    </Undertittel>
    <VerticalSpacer twentyPx />
    {aksjonspunkter.length > 0
        && (
          <ElementWrapper>
            <AksjonspunktHelpTextTemp isAksjonspunktOpen={isApOpen}>
              {hentApTekst(uttaksresultat, isApOpen, aksjonspunkter)}
            </AksjonspunktHelpTextTemp>
            <VerticalSpacer twentyPx />
          </ElementWrapper>
        )}
    {true
        && (
          <form onSubmit={formProps.handleSubmit}>
            <Uttak
              intl={intl}
              submitting={formProps.submitting}
              isDirty={formProps.dirty}
              formName={formName}
              manuellOverstyring={manuellOverstyring}
              person={person}
              behandlingId={behandlingId}
              behandlingType={behandlingType}
              behandlingVersjon={behandlingVersjon}
              behandlingStatus={behandlingStatus}
              fagsak={fagsak}
              alleKodeverk={alleKodeverk}
              readOnly={readOnly}
              isApOpen={isApOpen}
              aksjonspunkter={aksjonspunkter}
              employeeHasAccess={employeeHasAccess}
              behandlingsresultat={behandlingsresultat}
              mottattDato={soknad.mottattDato}

            />
          </form>
        )}
    {formProps.error && formProps.submitFailed
        && formProps.error}
  </>
);

UttakPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  soknad: PropTypes.shape().isRequired,
  manuellOverstyring: PropTypes.bool,
  apCodes: PropTypes.arrayOf(PropTypes.string),
  isApOpen: PropTypes.bool,
  person: PropTypes.shape().isRequired,
  uttakPeriodeGrense: PropTypes.shape().isRequired,
  behandlingType: PropTypes.shape().isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingStatus: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  fagsak: PropTypes.shape().isRequired,
  employeeHasAccess: PropTypes.bool.isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
  ...formPropTypes,
};

UttakPanelImpl.defaultProps = {
  apCodes: undefined,
  isApOpen: false,
  manuellOverstyring: undefined,
};





const validateUttakPanelForm = (values) => {
  const { uttaksresultatActivity } = values;
  if (uttaksresultatActivity) {
// TODO (Hallvard): FIXME
  }
  return null;
};

export const buildInitialValues = createSelector(
  [(props) => props.uttaksresultat, (props) => props.stonadskonto],
  (uttaksresultat, stonadskonto) => ({
    uttaksresultatActivity: uttaksresultat.perioderSøker.map((ua, index) => ({
      ...ua,
      id: index + 1,
    })),
    stonadskonto,
  }),
);

export const transformValues = (values, apCodes, aksjonspunkter) => {
  const overstyrErOpprettet = aksjonspunkter.filter((ap) => ap.status.kode === 'OPPR' && ap.definisjon.kode === '6008');
  const removeOverstyrApCode = apCodes.filter((a) => a !== '6008');
  let aksjonspunkt = removeOverstyrApCode;

  const transformedResultat = values.uttaksresultatActivity.map((perioder) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { tilknyttetStortinget, ...uta } = perioder; // NOSONAR destruct er bedre enn delete, immutable
    const { ...transformActivity } = uta;
    if (uta.oppholdÅrsak.kode !== '-') {
      uta.aktiviteter = [];
    }

    const transformAktiviteter = uta.aktiviteter.map((a) => {
      const { days, weeks, ...transformAktivitet } = a;
      if (typeof days !== 'undefined' && typeof weeks !== 'undefined') {
        const trekkdager = parseFloat((weeks * 5) + parseFloat(days)).toFixed(1);
        transformAktivitet.trekkdagerDesimaler = trekkdager; // regner om uker og dager til trekkdager
        transformAktivitet.trekkdager = null;
      }
      return transformAktivitet;
    });
    transformActivity.aktiviteter = transformAktiviteter;
    return transformActivity;
  });

  if (values.manuellOverstyring || (aksjonspunkter.length === 1 && overstyrErOpprettet.length > 0)) {
    aksjonspunkt = [aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER];
  }

  return aksjonspunkt.map((ap) => ({
    kode: ap,
    perioder: transformedResultat,
  }));
};

const mapStateToPropsFactory = (_initialState, initOwnProps) => {
  const { behandlingId, behandlingVersjon, aksjonspunkter } = initOwnProps;
  const validate = (values) => validateUttakPanelForm(values);
  const onSubmit = (values) => initOwnProps.submitCallback(transformValues(values, initOwnProps.apCodes, aksjonspunkter));

  return (state) => {

    return {
      validate,
      onSubmit,
      manuellOverstyring: behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'manuellOverstyring'),
    };
  };
};

const UttakPanel = connect(mapStateToPropsFactory)(injectIntl(behandlingForm({
  form: formName,
  enableReinitialize: false,
})(UttakPanelImpl)));

export default UttakPanel;

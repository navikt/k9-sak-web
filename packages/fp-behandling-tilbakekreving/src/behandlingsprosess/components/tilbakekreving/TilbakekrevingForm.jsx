import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { createSelector } from 'reselect';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators } from 'redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import AlertStripe from 'nav-frontend-alertstriper';

import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import { BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-behandling-felles';
import {
  FadingPanel, VerticalSpacer, AksjonspunktHelpText,
} from '@fpsak-frontend/shared-components';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import { omit, isObjectEmpty } from '@fpsak-frontend/utils';

import {
  behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix, isBehandlingFormDirty,
  hasBehandlingFormErrorsOfType, isBehandlingFormSubmitting, getBehandlingFormValues,
} from 'behandlingTilbakekreving/src/behandlingForm';
import {
  getBehandlingVersjon, getBehandlingVilkarsvurderingsperioder, getBehandlingVilkarsvurderingsRettsgebyr, getBehandlingVilkarsvurdering,
} from 'behandlingTilbakekreving/src/selectors/tilbakekrevingBehandlingSelectors';
import { getSelectedBehandlingId, getFagsakPerson } from 'behandlingTilbakekreving/src/duckTilbake';
import tilbakekrevingAksjonspunktCodes from 'behandlingTilbakekreving/src/kodeverk/tilbakekrevingAksjonspunktCodes';
import foreldelseVurderingType from 'behandlingTilbakekreving/src/kodeverk/foreldelseVurderingType';
import BpTimelinePanel from '../felles/behandlingspunktTimelineSkjema/BpTimelinePanel';
import { AVVIST_CLASSNAME, GODKJENT_CLASSNAME } from '../felles/behandlingspunktTimelineSkjema/BpTimelineHelper';
import TilbakekrevingPeriodeForm, { TILBAKEKREVING_PERIODE_FORM_NAME } from './TilbakekrevingPeriodeForm';

const TILBAKEKREVING_FORM_NAME = 'TilbakekrevingForm';

const tilbakekrevingAksjonspunkter = [tilbakekrevingAksjonspunktCodes.VURDER_TILBAKEKREVING];

export const TilbakekrevingFormImpl = ({
  perioderFormatertForTimeline,
  behandlingFormPrefix,
  isApOpen,
  kjonn,
  readOnly,
  readOnlySubmitButton,
  reduxFormChange: formChange,
  reduxFormInitialize: formInitialize,
  antallPerioderMedAksjonspunkt,
  isDetailFormOpen,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <FadingPanel>
      <Undertittel>
        <FormattedMessage id="Behandlingspunkt.Tilbakekreving" />
      </Undertittel>
      <VerticalSpacer twentyPx />
      <AksjonspunktHelpText isAksjonspunktOpen={isApOpen}>
        {[<FormattedMessage key="AksjonspunktHjelpetekst" id="TilbakekrevingForm.AksjonspunktHjelpetekst" />] }
      </AksjonspunktHelpText>
      <VerticalSpacer twentyPx />
      {perioderFormatertForTimeline && (
        <BpTimelinePanel
          hovedsokerKjonnKode={kjonn}
          resultatActivity={perioderFormatertForTimeline}
          behandlingFormPrefix={behandlingFormPrefix}
          reduxFormChange={formChange}
          reduxFormInitialize={formInitialize}
          formName={TILBAKEKREVING_FORM_NAME}
          detailPanelForm={TILBAKEKREVING_PERIODE_FORM_NAME}
          fieldNameToStoreDetailInfo="vilkarsVurdertePerioder"
          isTilbakekreving
          readOnly={readOnly}
        >
          <TilbakekrevingPeriodeForm
            behandlingFormPrefix={behandlingFormPrefix}
            antallPerioderMedAksjonspunkt={antallPerioderMedAksjonspunkt}
            formName={TILBAKEKREVING_FORM_NAME}
            readOnly={readOnly}
          />
        </BpTimelinePanel>
      )}
      <VerticalSpacer twentyPx />
      {formProps.error && (
        <>
          <AlertStripe type="feil">
            <FormattedMessage id={formProps.error} />
          </AlertStripe>
          <VerticalSpacer twentyPx />
        </>
      )}
      <BehandlingspunktSubmitButton
        formName={TILBAKEKREVING_FORM_NAME}
        isReadOnly={readOnly}
        isSubmittable={!readOnlySubmitButton && !isDetailFormOpen}
        isBehandlingFormSubmitting={isBehandlingFormSubmitting}
        isBehandlingFormDirty={isBehandlingFormDirty}
        hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
      />
    </FadingPanel>
  </form>
);

TilbakekrevingFormImpl.propTypes = {
  perioderFormatertForTimeline: PropTypes.arrayOf(PropTypes.shape()),
  behandlingFormPrefix: PropTypes.string.isRequired,
  isApOpen: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  kjonn: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
  isDetailFormOpen: PropTypes.bool.isRequired,
  antallPerioderMedAksjonspunkt: PropTypes.number.isRequired,
};

TilbakekrevingFormImpl.defaultProps = {
  perioderFormatertForTimeline: undefined,
};

export const transformValues = values => [{
  kode: tilbakekrevingAksjonspunktCodes.VURDER_TILBAKEKREVING,
  vilkarsVurdertePerioder: values.vilkarsVurdertePerioder
    .map(periode => ({
      ...periode.storedData,
      fom: periode.fom,
      tom: periode.tom,
    }))
    .filter(storedData => !isObjectEmpty(omit(storedData, 'fom', 'tom'))),
}];

const finnOriginalPeriode = (lagretPeriode, perioder) => perioder
  .find(periode => !moment(lagretPeriode.fom).isBefore(moment(periode.fom)) && !moment(lagretPeriode.tom).isAfter(moment(periode.tom)));

const erIkkeLagret = (periode, lagredePerioder) => lagredePerioder
  .every(lagretPeriode => moment(periode.fom).isBefore(moment(lagretPeriode.fom)) || moment(periode.tom).isAfter(moment(lagretPeriode.tom)));

export const buildInitialValues = createSelector([getBehandlingVilkarsvurderingsperioder, getBehandlingVilkarsvurdering,
  getBehandlingVilkarsvurderingsRettsgebyr], (perioder, vilkarsvurdering, rettsgebyr) => {
  const totalbelop = perioder.reduce((acc, periode) => acc + periode.feilutbetaling, 0);
  const erTotalBelopUnder4Rettsgebyr = totalbelop < (rettsgebyr * 4);
  const lagredeVilkarsvurdertePerioder = vilkarsvurdering.vilkarsVurdertePerioder;

  const lagredePerioder = lagredeVilkarsvurdertePerioder
    .map(lagretPeriode => ({
      ...finnOriginalPeriode(lagretPeriode, perioder),
      fom: lagretPeriode.fom,
      tom: lagretPeriode.tom,
      storedData: lagretPeriode,
      erTotalBelopUnder4Rettsgebyr,
    }));

  const originaleUrortePerioder = perioder
    .filter(periode => erIkkeLagret(periode, lagredePerioder))
    .map(periode => ({
      ...periode,
      storedData: {},
      erTotalBelopUnder4Rettsgebyr,
    }));

  return {
    vilkarsVurdertePerioder: originaleUrortePerioder.concat(lagredePerioder),
  };
});

const leggTilTimelineData = createSelector([state => behandlingFormValueSelector(TILBAKEKREVING_FORM_NAME)(state, 'vilkarsVurdertePerioder')],
  (perioder) => {
    if (!perioder) {
      return undefined;
    }

    return perioder.map((periode, index) => {
      const erBehandlet = periode.storedData.begrunnelse ? GODKJENT_CLASSNAME : 'undefined';
      const erForeldet = periode.erForeldet !== undefined ? periode.erForeldet : periode.foreldet;
      const erBelopetIBehold = periode.storedData && periode.storedData.vilkarResultatInfo
        ? periode.storedData.vilkarResultatInfo.erBelopetIBehold : undefined;
      const statusClassName = erForeldet || erBelopetIBehold === false ? AVVIST_CLASSNAME : erBehandlet;
      return {
        ...periode,
        className: statusClassName,
        id: index + 1,
        group: 1,
        arsak: periode.årsak.årsak,
        foreldet: erForeldet || periode.storedData.begrunnelse ? undefined : foreldelseVurderingType.UDEFINERT,
        erForeldet,
      };
    });
});

const getAntallPerioderMedAksjonspunkt = createSelector([state => behandlingFormValueSelector(TILBAKEKREVING_FORM_NAME)(state, 'vilkarsVurdertePerioder')],
  (perioder = []) => perioder.reduce((sum, periode) => (periode.erForeldet ? sum + 1 : sum), 0));

const mapStateToPropsFactory = (initialState, ownProps) => {
  const submitCallback = values => ownProps.submitCallback(transformValues(values));
  return (state) => {
    const periodFormValues = getBehandlingFormValues(TILBAKEKREVING_PERIODE_FORM_NAME)(state) || {};
    return {
      initialValues: buildInitialValues(state),
      kjonn: getFagsakPerson(state).erKvinne ? navBrukerKjonn.KVINNE : navBrukerKjonn.MANN,
      perioderFormatertForTimeline: leggTilTimelineData(state),
      behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), getBehandlingVersjon(state)),
      onSubmit: submitCallback,
      isDetailFormOpen: periodFormValues !== undefined && !isObjectEmpty(periodFormValues),
      readOnly: ownProps.readOnly || periodFormValues.erForeldet === true,
      antallPerioderMedAksjonspunkt: getAntallPerioderMedAksjonspunkt(state),
    };
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    reduxFormChange,
    reduxFormInitialize,
  }, dispatch),
});

const validateForm = (values) => {
  const errors = {};
  const perioder = values.vilkarsVurdertePerioder;
  const antallPerioderMedAksjonspunkt = perioder.reduce((sum, periode) => (periode.erForeldet ? sum + 1 : sum), 0);
  if (antallPerioderMedAksjonspunkt < 2) {
    return errors;
  }

  const antallValgt = perioder.reduce((sum, periode) => {
    if (!periode.storedData) {
      return sum;
    }
    const { vilkarResultatInfo } = periode.storedData;
    const info = vilkarResultatInfo ? vilkarResultatInfo.aktsomhetInfo : undefined;
    if (info) {
      return info.tilbakekrevSelvOmBeloepErUnder4Rettsgebyr === false ? sum + 1 : sum;
    }
    return sum;
  }, 0);
  if (antallValgt > 0 && antallValgt !== perioder.length) {
    // eslint-disable-next-line no-underscore-dangle
    errors._error = 'TilbakekrevingPeriodeForm.TotalbelopetUnder4Rettsgebyr';
  }
  return errors;
};

const TilbakekrevingForm = connect(mapStateToPropsFactory, mapDispatchToProps)(injectIntl(behandlingForm({
  form: TILBAKEKREVING_FORM_NAME,
  validate: validateForm,
})(TilbakekrevingFormImpl)));

TilbakekrevingForm.supports = (bp, apCodes) => bp === behandlingspunktCodes.TILBAKEKREVING || tilbakekrevingAksjonspunkter.some(ap => apCodes.includes(ap));

export default TilbakekrevingForm;

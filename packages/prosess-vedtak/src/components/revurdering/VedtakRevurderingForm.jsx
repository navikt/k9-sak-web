/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearFields, formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix } from '@fpsak-frontend/form';
import { isAvslag, isInnvilget, isOpphor } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import BehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { decodeHtmlEntity, getKodeverknavnFn, safeJSONParse } from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import { Column, Row } from 'nav-frontend-grid';
import { dokumentdatatype } from '@k9-sak-web/konstanter';
import {
  kanHaFritekstbrev,
  harBareFritekstbrev,
  harOverstyrtMedFritekstbrev,
  harOverstyrtMedIngenBrev,
} from '@fpsak-frontend/utils/src/formidlingUtils';
import vedtakBeregningsresultatPropType from '../../propTypes/vedtakBeregningsresultatPropType';

import VedtakCheckbox from '../VedtakCheckbox';
import VedtakAksjonspunktPanel from '../VedtakAksjonspunktPanel';
import VedtakRevurderingSubmitPanel from './VedtakRevurderingSubmitPanel';
import VedtakInnvilgetRevurderingPanel from './VedtakInnvilgetRevurderingPanel';
import VedtakAvslagRevurderingPanel from './VedtakAvslagRevurderingPanel';
import VedtakOpphorRevurderingPanel from './VedtakOpphorRevurderingPanel';
import vedtakVarselPropType from '../../propTypes/vedtakVarselPropType';
import VedtakRedusertUtbetalingArsaker from './VedtakRedusertUtbetalingArsaker';
import redusertUtbetalingArsak from '../../kodeverk/redusertUtbetalingArsak';
import BrevPanel from '../brev/BrevPanel';
import RevurderingPaneler from './RevurderingPaneler';

export const VEDTAK_REVURDERING_FORM_NAME = 'VEDTAK_REVURDERING_FORM';

const isVedtakSubmission = true;

const transformRedusertUtbetalingÅrsaker = formProps =>
  Object.values(redusertUtbetalingArsak).filter(name =>
    Object.keys(formProps).some(key => key === name && formProps[key]),
  );

/**
 * VedtakRevurderingForm
 *
 * Redux-form-komponent for revurdering-vedtak.
 */
export class VedtakRevurderingFormImpl extends Component {
  constructor(props) {
    super(props);
    this.onToggleOverstyring = this.onToggleOverstyring.bind(this);
    this.state = {
      skalBrukeOverstyrendeFritekstBrev: props.skalBrukeOverstyrendeFritekstBrev,
      erSendtInnUtenArsaker: false,
    };
  }

  onToggleOverstyring() {
    const { behandlingFormPrefix, clearFields: clearFormFields } = this.props;
    const { skalBrukeOverstyrendeFritekstBrev } = this.state;
    this.setState({
      skalBrukeOverstyrendeFritekstBrev: !skalBrukeOverstyrendeFritekstBrev,
    });
    const fields = ['begrunnelse', 'overskrift', 'brødtekst'];
    clearFormFields(`${behandlingFormPrefix}.${VEDTAK_REVURDERING_FORM_NAME}`, false, false, ...fields);
  }

  render() {
    const {
      intl,
      readOnly,
      behandlingStatusKode,
      behandlingresultat,
      aksjonspunkter,
      previewCallback,
      begrunnelse,
      overstyrtMottaker,
      aksjonspunktKoder,
      antallBarn,
      ytelseTypeKode,
      revurderingsAarsakString,
      sprakkode,
      skalBrukeOverstyrendeFritekstBrev,
      brødtekst,
      overskrift,
      resultatstruktur,
      alleKodeverk,
      tilbakekrevingvalg,
      simuleringResultat,
      vilkar,
      resultatstrukturOriginalBehandling,
      medlemskapFom,
      vedtakVarsel,
      bgPeriodeMedAvslagsårsak,
      tilgjengeligeVedtaksbrev,
      informasjonsbehovVedtaksbrev,
      dokumentdata,
      arbeidsgiverOpplysningerPerId,
      KONTINUERLIG_TILSYN,
      OMSORGEN_FOR,
      VILKAR_FOR_TO,
      UNNTAK_FRA_TILSYNSORDNING,
      BEREGNING_25_PROSENT_AVVIK,
      OVER_18_AAR,
      REVURDERING_ENDRING,
      lagreDokumentdata,
      personopplysninger,
      overlappendeYtelser,
      ...formProps
    } = this.props;

    const informasjonsbehovValues = {
      KONTINUERLIG_TILSYN,
      OMSORGEN_FOR,
      VILKAR_FOR_TO,
      UNNTAK_FRA_TILSYNSORDNING,
      BEREGNING_25_PROSENT_AVVIK,
      OVER_18_AAR,
      REVURDERING_ENDRING,
    };

    const { erSendtInnUtenArsaker } = this.state;

    const harRedusertUtbetaling = ytelseTypeKode === fagsakYtelseType.FRISINN;
    return (
      <>
        <VedtakAksjonspunktPanel
          behandlingStatusKode={behandlingStatusKode}
          aksjonspunktKoder={aksjonspunktKoder}
          readOnly={readOnly}
          overlappendeYtelser={overlappendeYtelser}
          alleKodeverk={alleKodeverk}
        >
          <VerticalSpacer eightPx />
          <>
            {ytelseTypeKode === fagsakYtelseType.FRISINN ? (
              <VedtakCheckbox readOnly={readOnly} keyName="skalUndertrykkeBrev" readOnlyHideEmpty={false} />
            ) : (
              kanHaFritekstbrev(tilgjengeligeVedtaksbrev) && (
                <VedtakCheckbox
                  toggleCallback={this.onToggleOverstyring}
                  readOnly={readOnly || harBareFritekstbrev(tilgjengeligeVedtaksbrev)}
                  keyName="skalBrukeOverstyrendeFritekstBrev"
                  readOnlyHideEmpty={false}
                />
              )
            )}
            <RevurderingPaneler
              ytelseTypeKode={ytelseTypeKode}
              behandlingresultat={behandlingresultat}
              antallBarn={antallBarn}
              revurderingsAarsakString={revurderingsAarsakString}
              resultatstruktur={resultatstruktur}
              tilbakekrevingvalg={tilbakekrevingvalg}
              simuleringResultat={simuleringResultat}
              alleKodeverk={alleKodeverk}
              resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
              bgPeriodeMedAvslagsårsak={bgPeriodeMedAvslagsårsak}
              behandlingStatusKode={behandlingStatusKode}
              vilkar={vilkar}
              aksjonspunkter={aksjonspunkter}
              sprakkode={sprakkode}
              readOnly={readOnly}
              vedtakVarsel={vedtakVarsel}
              medlemskapFom={medlemskapFom}
              harRedusertUtbetaling={harRedusertUtbetaling}
              redusertUtbetalingArsak={redusertUtbetalingArsak}
              formProps={formProps}
              erSendtInnUtenArsaker={erSendtInnUtenArsaker}
              dokumentdata={dokumentdata}
            />
            {/* <BrevPanel
              intl={intl}
              readOnly={readOnly}
              sprakkode={sprakkode}
              personopplysninger={personopplysninger}
              arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
              tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
              informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
              informasjonsbehovValues={informasjonsbehovValues}
              skalBrukeOverstyrendeFritekstBrev={skalBrukeOverstyrendeFritekstBrev}
              begrunnelse={begrunnelse}
              previewCallback={previewCallback}
              redusertUtbetalingÅrsaker={
                readOnly ? vedtakVarsel?.redusertUtbetalingÅrsaker : transformRedusertUtbetalingÅrsaker(formProps)
              }
              brødtekst={brødtekst}
              overskrift={overskrift}
              overstyrtMottaker={overstyrtMottaker}
              formProps={formProps}
              dokumentdata={dokumentdata}
              lagreDokumentdata={lagreDokumentdata}
            /> */}
            {behandlingStatusKode === behandlingStatusCode.BEHANDLING_UTREDES && (
              <VedtakRevurderingSubmitPanel
                formProps={formProps}
                skalBrukeOverstyrendeFritekstBrev={skalBrukeOverstyrendeFritekstBrev}
                ytelseTypeKode={ytelseTypeKode}
                readOnly={readOnly}
                harRedusertUtbetaling={harRedusertUtbetaling}
                visFeilmeldingFordiArsakerMangler={() => this.setState({ erSendtInnUtenArsaker: true })}
              />
            )}
          </>
        </VedtakAksjonspunktPanel>
      </>
    );
  }
}

VedtakRevurderingFormImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  begrunnelse: PropTypes.string,
  brødtekst: PropTypes.string,
  overskrift: PropTypes.string,
  previewCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  antallBarn: PropTypes.number,
  behandlingStatusKode: PropTypes.string.isRequired,
  behandlingresultat: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  resultatstruktur: vedtakBeregningsresultatPropType,
  revurderingsAarsakString: PropTypes.string,
  kanOverstyre: PropTypes.bool,
  skalBrukeOverstyrendeFritekstBrev: PropTypes.bool,
  bgPeriodeMedAvslagsårsak: PropTypes.shape(),
  vedtakVarsel: vedtakVarselPropType,
  tilgjengeligeVedtaksbrev: PropTypes.oneOfType([PropTypes.shape(), PropTypes.arrayOf(PropTypes.string)]),
  informasjonsbehovVedtaksbrev: PropTypes.shape({
    informasjonsbehov: PropTypes.arrayOf(PropTypes.shape({ type: PropTypes.string })),
  }),
  dokumentdata: PropTypes.shape(),
  KONTINUERLIG_TILSYN: PropTypes.string,
  OMSORGEN_FOR: PropTypes.string,
  VILKAR_FOR_TO: PropTypes.string,
  UNNTAK_FRA_TILSYNSORDNING: PropTypes.string,
  BEREGNING_25_PROSENT_AVVIK: PropTypes.string,
  OVER_18_AAR: PropTypes.string,
  REVURDERING_ENDRING: PropTypes.string,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  personopplysninger: PropTypes.shape().isRequired,
  ...formPropTypes,
};

VedtakRevurderingFormImpl.defaultProps = {
  begrunnelse: undefined,
  brødtekst: undefined,
  overskrift: undefined,
  antallBarn: undefined,
  revurderingsAarsakString: undefined,
  kanOverstyre: undefined,
  resultatstruktur: undefined,
  skalBrukeOverstyrendeFritekstBrev: false,
  bgPeriodeMedAvslagsårsak: undefined,
  tilgjengeligeVedtaksbrev: undefined,
  KONTINUERLIG_TILSYN: undefined,
  OMSORGEN_FOR: undefined,
  VILKAR_FOR_TO: undefined,
  UNNTAK_FRA_TILSYNSORDNING: undefined,
  BEREGNING_25_PROSENT_AVVIK: undefined,
  OVER_18_AAR: undefined,
  REVURDERING_ENDRING: undefined,
};

const buildInitialValues = createSelector(
  [
    ownProps => ownProps.resultatstruktur,
    ownProps => ownProps.behandlingStatusKode,
    ownProps => ownProps.aksjonspunkter,
    ownProps => ownProps.ytelseTypeKode,
    ownProps => ownProps.behandlingresultat,
    ownProps => ownProps.sprakkode,
    ownProps => ownProps.vedtakVarsel,
    ownProps => ownProps.dokumentdata,
    ownProps => ownProps.tilgjengeligeVedtaksbrev,
    ownProps => ownProps.readOnly,
  ],
  (
    beregningResultat,
    behandlingstatusKode,
    aksjonspunkter,
    ytelseTypeKode,
    behandlingresultat,
    sprakkode,
    vedtakVarsel,
    dokumentdata,
    tilgjengeligeVedtaksbrev,
    readonly,
  ) => {
    const aksjonspunktKoder = aksjonspunkter
      .filter(ap => ap.erAktivt)
      .filter(ap => ap.kanLoses)
      .map(ap => ap.definisjon.kode);

    return {
      sprakkode,
      aksjonspunktKoder,
      skalBrukeOverstyrendeFritekstBrev:
        harBareFritekstbrev(tilgjengeligeVedtaksbrev) || harOverstyrtMedFritekstbrev(dokumentdata, vedtakVarsel),
      skalUndertrykkeBrev: readonly && harOverstyrtMedIngenBrev(dokumentdata, vedtakVarsel),
      overskrift: decodeHtmlEntity(dokumentdata?.[dokumentdatatype.FRITEKSTBREV]?.overskrift),
      brødtekst: decodeHtmlEntity(dokumentdata?.[dokumentdatatype.FRITEKSTBREV]?.brødtekst),
      overstyrtMottaker: JSON.stringify(dokumentdata?.[dokumentdatatype.OVERSTYRT_MOTTAKER]),
      begrunnelse: dokumentdata?.[dokumentdatatype.BEREGNING_FRITEKST],
      KONTINUERLIG_TILSYN: dokumentdata?.KONTINUERLIG_TILSYN,
      OMSORGEN_FOR: dokumentdata?.OMSORGEN_FOR,
      VILKAR_FOR_TO: dokumentdata?.VILKAR_FOR_TO,
      UNNTAK_FRA_TILSYNSORDNING: dokumentdata?.UNNTAK_FRA_TILSYNSORDNING,
      BEREGNING_25_PROSENT_AVVIK: dokumentdata?.BEREGNING_25_PROSENT_AVVIK,
      OVER_18_AAR: dokumentdata?.OVER_18_AAR,
      REVURDERING_ENDRING: dokumentdata?.REVURDERING_ENDRING,
    };
  },
);

const transformValuesForFlereInformasjonsbehov = (values, informasjonsbehov, tilgjengeligeVedtaksbrev) => {
  const begrunnelser = informasjonsbehov.map(({ kode }) => ({ kode, begrunnelse: values[kode] }));
  return values.aksjonspunktKoder.map(apCode => {
    const transformedValues = {
      kode: apCode,
      begrunnelse: values.begrunnelse,
      overstyrtMottaker: safeJSONParse(values.overstyrtMottaker),
      fritekstbrev: { brødtekst: values.brødtekst, overskrift: values.overskrift },
      skalBrukeOverstyrendeFritekstBrev: values.skalBrukeOverstyrendeFritekstBrev,
      skalUndertrykkeBrev: values.skalUndertrykkeBrev,
      isVedtakSubmission,
      begrunnelserMedInformasjonsbehov: begrunnelser,
      tilgjengeligeVedtaksbrev,
    };
    if (apCode === aksjonspunktCodes.FORESLA_VEDTAK_MANUELT) {
      transformedValues.redusertUtbetalingÅrsaker = transformRedusertUtbetalingÅrsaker(values);
    }
    return transformedValues;
  });
};

const transformValues = (values, tilgjengeligeVedtaksbrev) =>
  values.aksjonspunktKoder.map(apCode => {
    const transformedValues = {
      kode: apCode,
      begrunnelse: values.begrunnelse,
      overstyrtMottaker: safeJSONParse(values.overstyrtMottaker),
      fritekstbrev: { brødtekst: values.brødtekst, overskrift: values.overskrift },
      skalBrukeOverstyrendeFritekstBrev: values.skalBrukeOverstyrendeFritekstBrev,
      skalUndertrykkeBrev: values.skalUndertrykkeBrev,
      isVedtakSubmission,
      tilgjengeligeVedtaksbrev,
    };
    if (apCode === aksjonspunktCodes.FORESLA_VEDTAK_MANUELT) {
      transformedValues.redusertUtbetalingÅrsaker = transformRedusertUtbetalingÅrsaker(values);
    }
    return transformedValues;
  });

const createAarsakString = (revurderingAarsaker, getKodeverknavn) => {
  if (revurderingAarsaker === undefined || revurderingAarsaker.length < 1) {
    return '';
  }
  const aarsakTekstList = [];
  const endringFraBrukerAarsak = revurderingAarsaker.find(
    aarsak => aarsak.kode === BehandlingArsakType.RE_ENDRING_FRA_BRUKER,
  );
  const alleAndreAarsakerNavn = revurderingAarsaker
    .filter(aarsak => aarsak.kode !== BehandlingArsakType.RE_ENDRING_FRA_BRUKER)
    .map(aarsak => getKodeverknavn(aarsak));
  // Dersom en av årsakene er "RE_ENDRING_FRA_BRUKER" skal alltid denne vises først
  if (endringFraBrukerAarsak !== undefined) {
    aarsakTekstList.push(getKodeverknavn(endringFraBrukerAarsak));
  }
  aarsakTekstList.push(...alleAndreAarsakerNavn);
  return aarsakTekstList.join(', ');
};

const harPotensieltFlereInformasjonsbehov = informasjonsbehovVedtaksbrev => {
  if (informasjonsbehovVedtaksbrev) {
    const { informasjonsbehov } = informasjonsbehovVedtaksbrev;
    return informasjonsbehov.length > 0;
  }
  return false;
};

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = values => {
    const { informasjonsbehovVedtaksbrev, submitCallback } = initialOwnProps;
    if (harPotensieltFlereInformasjonsbehov(informasjonsbehovVedtaksbrev)) {
      const transformedValuesForFlereInformasjonsbehov = transformValuesForFlereInformasjonsbehov(
        values,
        informasjonsbehovVedtaksbrev.informasjonsbehov,
        initialOwnProps.tilgjengeligeVedtaksbrev,
      );
      return submitCallback(transformedValuesForFlereInformasjonsbehov);
    }
    const transformedValues = transformValues(values, initialOwnProps.tilgjengeligeVedtaksbrev);
    return submitCallback(transformedValues);
  };
  const aksjonspunktKoder =
    initialOwnProps.aksjonspunkter && initialOwnProps.aksjonspunkter.map(ap => ap.definisjon.kode);
  const behandlingArsaker =
    initialOwnProps.behandlingArsaker &&
    initialOwnProps.behandlingArsaker.map(({ behandlingArsakType }) => behandlingArsakType);
  const revurderingsAarsakString = createAarsakString(
    behandlingArsaker,
    getKodeverknavnFn(initialOwnProps.alleKodeverk, kodeverkTyper),
  );

  return (state, ownProps) => {
    const { informasjonsbehovVedtaksbrev } = initialOwnProps;
    const informasjonsbehovFieldNames = [];
    if (harPotensieltFlereInformasjonsbehov(informasjonsbehovVedtaksbrev)) {
      informasjonsbehovVedtaksbrev.informasjonsbehov.forEach(({ kode }) => {
        informasjonsbehovFieldNames.push(kode);
      });
    }

    return {
      onSubmit,
      aksjonspunktKoder,
      revurderingsAarsakString,
      initialValues: buildInitialValues(ownProps),
      ...behandlingFormValueSelector(VEDTAK_REVURDERING_FORM_NAME, ownProps.behandlingId, ownProps.behandlingVersjon)(
        state,
        'antallBarn',
        'aksjonspunktKoder',
        'skalBrukeOverstyrendeFritekstBrev',
        'skalUndertrykkeBrev',
        'brødtekst',
        'overskrift',
        'begrunnelse',
        'overstyrtMottaker',
        ...Object.values(redusertUtbetalingArsak),
        ...informasjonsbehovFieldNames,
      ),
      behandlingFormPrefix: getBehandlingFormPrefix(ownProps.behandlingId, ownProps.behandlingVersjon),
    };
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      clearFields,
    },
    dispatch,
  ),
});

const VedtakRevurderingForm = connect(
  mapStateToPropsFactory,
  mapDispatchToProps,
)(
  injectIntl(
    behandlingForm({
      form: VEDTAK_REVURDERING_FORM_NAME,
    })(VedtakRevurderingFormImpl),
  ),
);

export default VedtakRevurderingForm;

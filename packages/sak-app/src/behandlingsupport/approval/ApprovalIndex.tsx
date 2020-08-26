import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { RouteProps } from 'react-router';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import vurderPaNyttArsakType from '@fpsak-frontend/kodeverk/src/vurderPaNyttArsakType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { featureToggle } from '@k9-sak-web/konstanter';
import { NavAnsatt, Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import { requireProps, LoadingPanel } from '@fpsak-frontend/shared-components';
import TotrinnskontrollSakIndex, { FatterVedtakApprovalModalSakIndex } from '@fpsak-frontend/sak-totrinnskontroll';
import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import { DataFetcher, DataFetcherTriggers } from '@fpsak-frontend/rest-api-redux';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';

import { createLocationForSkjermlenke } from '../../app/paths';
import { getNavAnsatt, getFeatureToggles } from '../../app/duck';
import {
  getBehandlingAnsvarligSaksbehandler,
  getBehandlingIdentifier,
  getBehandlingToTrinnsBehandling,
  getBehandlingVersjon,
  previewMessage,
  getBehandlingStatus,
  getBehandlingType,
  getBehandlingArsaker,
  getSelectedBehandlingId,
  getBehandlingsresultat,
} from '../../behandling/duck';
import { getBehandlingerUuidsMappedById } from '../../behandling/selectors/behandlingerSelectors';
import fpsakApi from '../../data/fpsakApi';
import { getAktorid, getFagsakYtelseType, getSaksnummer, isForeldrepengerFagsak } from '../../fagsak/fagsakSelectors';
import { getAlleKodeverkForBehandlingstype, getKodeverkForBehandlingstype } from '../../kodeverk/duck';
import BehandlingIdentifier from '../../behandling/BehandlingIdentifier';

const getArsaker = approval =>
  [
    {
      code: vurderPaNyttArsakType.FEIL_FAKTA,
      isSet: approval.feilFakta,
    },
    {
      code: vurderPaNyttArsakType.FEIL_LOV,
      isSet: approval.feilLov,
    },
    {
      code: vurderPaNyttArsakType.FEIL_REGEL,
      isSet: approval.feilRegel,
    },
    {
      code: vurderPaNyttArsakType.ANNET,
      isSet: approval.annet,
    },
  ]
    .filter(arsak => arsak.isSet)
    .map(arsak => arsak.code);

const klageData = [fpsakApi.TOTRINNS_KLAGE_VURDERING];
const revurderingData = [fpsakApi.HAR_REVURDERING_SAMME_RESULTAT];
const ingenData = [];

interface OwnProps {
  totrinnskontrollSkjermlenkeContext?: {}[];
  totrinnskontrollReadOnlySkjermlenkeContext?: {}[];
  approve: (params: {}) => Promise<any>;
  previewMessage: (erTilbakekreving: boolean, erHenleggelse: boolean, data: {}) => void;
  behandlingIdentifier: BehandlingIdentifier;
  selectedBehandlingVersjon?: number;
  ansvarligSaksbehandler?: string;
  behandlingStatus: Kodeverk;
  toTrinnsBehandling?: boolean;
  push: (location: string) => void;
  resetApproval: () => void;
  location: RouteProps['location'];
  navAnsatt: NavAnsatt;
  skjemalenkeTyper: {}[];
  erTilbakekreving: boolean;
  behandlingUuid: string;
  fagsakYtelseType: Kodeverk;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  erBehandlingEtterKlage?: boolean;
  isForeldrepenger: boolean;
  disableGodkjennKnapp: boolean;
  erGodkjenningFerdig?: boolean;
  behandlingsresultat?: {};
  behandlingId?: number;
  behandlingTypeKode?: string;
  aktørId: string;
  saksnummer: string;
  tilgjengeligeVedtaksbrev: string[];
}

interface StateProps {
  showBeslutterModal: boolean;
  allAksjonspunktApproved?: boolean;
}

/**
 * ApprovalIndex
 *
 * Containerklass ansvarlig for att rita opp vilkår og aksjonspunkter med toTrinnskontroll
 */
export class ApprovalIndex extends Component<OwnProps, StateProps> {
  static defaultProps = {
    toTrinnsBehandling: false,
    erBehandlingEtterKlage: false,
    erGodkjenningFerdig: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      showBeslutterModal: false,
      allAksjonspunktApproved: undefined,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.goToSearchPage = this.goToSearchPage.bind(this);
    this.forhandsvisVedtaksbrev = this.forhandsvisVedtaksbrev.bind(this);
  }

  componentWillUnmount() {
    const { resetApproval: reset } = this.props;
    reset();
  }

  onSubmit(values) {
    const { behandlingIdentifier, selectedBehandlingVersjon, approve: approveAp, erTilbakekreving } = this.props;
    const aksjonspunkter = values.approvals.map(context => context.aksjonspunkter).reduce((a, b) => a.concat(b));

    const aksjonspunktGodkjenningDtos = aksjonspunkter.map(toTrinnsAksjonspunkt => ({
      aksjonspunktKode: toTrinnsAksjonspunkt.aksjonspunktKode,
      godkjent: toTrinnsAksjonspunkt.totrinnskontrollGodkjent,
      begrunnelse: toTrinnsAksjonspunkt.besluttersBegrunnelse,
      arsaker: getArsaker(toTrinnsAksjonspunkt),
    }));

    // TODO (TOR) Fjern hardkodinga av 5005
    const fatterVedtakAksjonspunktDto = {
      '@type': erTilbakekreving ? '5005' : aksjonspunktCodes.FATTER_VEDTAK,
      begrunnelse: null,
      aksjonspunktGodkjenningDtos,
    };
    const params = {
      ...behandlingIdentifier.toJson(),
      behandlingVersjon: selectedBehandlingVersjon,
      bekreftedeAksjonspunktDtoer: [fatterVedtakAksjonspunktDto],
    };
    this.setAksjonspunktApproved(aksjonspunkter);
    this.setState({
      showBeslutterModal: true,
    });
    return approveAp(params);
  }

  setAksjonspunktApproved(toTrinnsAksjonspunkter) {
    this.setState({
      allAksjonspunktApproved: toTrinnsAksjonspunkter.every(
        ap => ap.totrinnskontrollGodkjent && ap.totrinnskontrollGodkjent === true,
      ),
    });
  }

  forhandsvisVedtaksbrev() {
    const {
      previewMessage: fetchPreview,
      fagsakYtelseType,
      behandlingUuid,
      erTilbakekreving,
      aktørId,
      saksnummer,
      behandlingTypeKode,
    } = this.props;
    fetchPreview(erTilbakekreving, false, {
      behandlingUuid,
      ytelseType: fagsakYtelseType,
      aktørId,
      saksnummer,
      dokumentMal: behandlingTypeKode === BehandlingType.KLAGE ? dokumentMalType.UTLED_KLAGE : dokumentMalType.UTLED,
    });
  }

  async goToSearchPage() {
    const { push: pushLocation } = this.props;
    pushLocation('/');
  }

  render() {
    const {
      totrinnskontrollSkjermlenkeContext,
      totrinnskontrollReadOnlySkjermlenkeContext,
      behandlingStatus,
      location,
      navAnsatt,
      ansvarligSaksbehandler,
      toTrinnsBehandling,
      skjemalenkeTyper,
      behandlingIdentifier,
      selectedBehandlingVersjon,
      alleKodeverk,
      erBehandlingEtterKlage,
      isForeldrepenger,
      disableGodkjennKnapp,
      fagsakYtelseType,
      erGodkjenningFerdig,
      behandlingsresultat,
      behandlingId,
      behandlingTypeKode,
      erTilbakekreving,
      tilgjengeligeVedtaksbrev,
    } = this.props;
    const { showBeslutterModal, allAksjonspunktApproved } = this.state;
    const { brukernavn, kanVeilede } = navAnsatt;
    const readOnly = brukernavn === ansvarligSaksbehandler || kanVeilede;

    if (!totrinnskontrollSkjermlenkeContext && !totrinnskontrollReadOnlySkjermlenkeContext) {
      return null;
    }

    const harKlageEndepunkter = klageData.some(kd => kd.isEndpointEnabled());

    return (
      <DataFetcher
        fetchingTriggers={
          new DataFetcherTriggers(
            { behandlingId: behandlingIdentifier.behandlingId, behandlingVersion: selectedBehandlingVersjon },
            true,
          )
        }
        key={harKlageEndepunkter ? 0 : 1}
        endpoints={harKlageEndepunkter ? klageData : ingenData}
        loadingPanel={<LoadingPanel />}
        render={(props: {
          totrinnsKlageVurdering?: {
            klageVurdering?: string;
            klageVurderingOmgjoer?: string;
            klageVurderingResultatNFP?: {};
            klageVurderingResultatNK?: {};
          };
        }) => (
          <>
            <TotrinnskontrollSakIndex
              behandlingId={behandlingIdentifier.behandlingId}
              behandlingVersjon={selectedBehandlingVersjon}
              behandlingStatus={behandlingStatus}
              totrinnskontrollSkjermlenkeContext={totrinnskontrollSkjermlenkeContext}
              totrinnskontrollReadOnlySkjermlenkeContext={totrinnskontrollReadOnlySkjermlenkeContext}
              location={location}
              readOnly={readOnly}
              onSubmit={this.onSubmit}
              forhandsvisVedtaksbrev={this.forhandsvisVedtaksbrev}
              toTrinnsBehandling={toTrinnsBehandling}
              skjemalenkeTyper={skjemalenkeTyper}
              isForeldrepengerFagsak={isForeldrepenger}
              alleKodeverk={alleKodeverk}
              behandlingKlageVurdering={props.totrinnsKlageVurdering}
              erBehandlingEtterKlage={erBehandlingEtterKlage}
              disableGodkjennKnapp={disableGodkjennKnapp}
              erTilbakekreving={erTilbakekreving}
              createLocationForSkjermlenke={createLocationForSkjermlenke}
              tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
            />
            {showBeslutterModal && (
              <DataFetcher
                fetchingTriggers={
                  new DataFetcherTriggers(
                    {
                      behandlingId: behandlingIdentifier.behandlingId,
                      behandlingVersion: selectedBehandlingVersjon,
                    },
                    true,
                  )
                }
                key={revurderingData.some(rd => rd.isEndpointEnabled()) ? 0 : 1}
                endpoints={revurderingData.some(rd => rd.isEndpointEnabled()) ? revurderingData : ingenData}
                loadingPanel={<LoadingPanel />}
                render={(modalProps: { harRevurderingSammeResultat: boolean }) => (
                  <FatterVedtakApprovalModalSakIndex
                    showModal={showBeslutterModal}
                    closeEvent={this.goToSearchPage}
                    allAksjonspunktApproved={allAksjonspunktApproved}
                    fagsakYtelseType={fagsakYtelseType}
                    erGodkjenningFerdig={erGodkjenningFerdig}
                    erKlageWithKA={
                      props.totrinnsKlageVurdering ? !!props.totrinnsKlageVurdering.klageVurderingResultatNK : undefined
                    }
                    behandlingsresultat={behandlingsresultat}
                    behandlingId={behandlingId}
                    behandlingStatusKode={behandlingStatus.kode}
                    behandlingTypeKode={behandlingTypeKode}
                    harSammeResultatSomOriginalBehandling={modalProps.harRevurderingSammeResultat}
                  />
                )}
              />
            )}
          </>
        )}
      />
    );
  }
}

const erArsakTypeBehandlingEtterKlage = createSelector(
  [getBehandlingArsaker],
  (behandlingArsaker: { behandlingArsakType: Kodeverk }[] = []) =>
    behandlingArsaker
      .map(({ behandlingArsakType }) => behandlingArsakType)
      .some(
        (bt: Kodeverk) =>
          bt.kode === klageBehandlingArsakType.ETTER_KLAGE ||
          bt.kode === klageBehandlingArsakType.KLAGE_U_INNTK ||
          bt.kode === klageBehandlingArsakType.KLAGE_M_INNTK,
      ),
);

const mapStateToPropsFactory = initialState => {
  return state => {
    const behandlingType = getBehandlingType(state);
    const behandlingTypeKode = behandlingType ? behandlingType.kode : undefined;
    const erTilbakekreving =
      BehandlingType.TILBAKEKREVING === behandlingTypeKode ||
      BehandlingType.TILBAKEKREVING_REVURDERING === behandlingTypeKode;
    const behandlingIdentifier = getBehandlingIdentifier(state);
    return {
      totrinnskontrollSkjermlenkeContext: fpsakApi.TOTRINNSAKSJONSPUNKT_ARSAKER.getRestApiData()(state),
      totrinnskontrollReadOnlySkjermlenkeContext: fpsakApi.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY.getRestApiData()(
        state,
      ),
      selectedBehandlingVersjon: getBehandlingVersjon(state),
      ansvarligSaksbehandler: getBehandlingAnsvarligSaksbehandler(state),
      behandlingStatus: getBehandlingStatus(state),
      toTrinnsBehandling: getBehandlingToTrinnsBehandling(state),
      navAnsatt: getNavAnsatt(state),
      alleKodeverk: getAlleKodeverkForBehandlingstype(behandlingTypeKode)(state),
      skjemalenkeTyper: getKodeverkForBehandlingstype(behandlingTypeKode, kodeverkTyper.SKJERMLENKE_TYPE)(initialState),
      location: state.router.location,
      behandlingUuid: getBehandlingerUuidsMappedById(state)[behandlingIdentifier.behandlingId],
      fagsakYtelseType: getFagsakYtelseType(state),
      erGodkjenningFerdig: fpsakApi.SAVE_TOTRINNSAKSJONSPUNKT.getRestApiFinished()(state),
      isForeldrepenger: isForeldrepengerFagsak(state),
      erBehandlingEtterKlage: erArsakTypeBehandlingEtterKlage(state),
      behandlingsresultat: getBehandlingsresultat(state),
      behandlingId: getSelectedBehandlingId(state),
      disableGodkjennKnapp: erTilbakekreving ? !getFeatureToggles(state)[featureToggle.BESLUTT_TILBAKEKREVING] : false,
      aktørId: getAktorid(state),
      saksnummer: getSaksnummer(state),
      behandlingIdentifier,
      erTilbakekreving,
      behandlingTypeKode,
      tilgjengeligeVedtaksbrev: fpsakApi.TILGJENGELIGE_VEDTAKSBREV.getRestApiData()(state),
    };
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      push,
      approve: fpsakApi.SAVE_TOTRINNSAKSJONSPUNKT.makeRestApiRequest(),
      resetApproval: fpsakApi.SAVE_TOTRINNSAKSJONSPUNKT.resetRestApi(),
      previewMessage,
    },
    dispatch,
  ),
});

const comp = requireProps(['behandlingIdentifier', 'selectedBehandlingVersjon'])(ApprovalIndex);
export default withRouter(connect(mapStateToPropsFactory, mapDispatchToProps)(comp));

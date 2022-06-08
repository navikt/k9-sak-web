import React from 'react';

import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { FadingPanel, LoadingPanel } from '@fpsak-frontend/shared-components';
import { Fagsak, Behandling, KodeverkMedNavn, FeatureToggles } from '@k9-sak-web/types';

import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import { Options, EndpointData, RestApiData } from '@k9-sak-web/rest-api-hooks/src/local-data/useMultipleRestApi';

import MargMarkering from './MargMarkering';
import InngangsvilkarPanel from './InngangsvilkarPanel';
import BehandlingHenlagtPanel from './BehandlingHenlagtPanel';
import ProsessStegIkkeBehandletPanel from './ProsessStegIkkeBehandletPanel';
import prosessStegHooks from '../util/prosessSteg/prosessStegHooks';
import { ProsessStegUtledet } from '../util/prosessSteg/ProsessStegUtledet';

interface OwnProps {
  fagsak: Fagsak;
  behandling: Behandling;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  valgtProsessSteg?: ProsessStegUtledet;
  apentFaktaPanelInfo?: { urlCode: string; textCode: string };
  oppdaterProsessStegOgFaktaPanelIUrl?: (punktnavn?: string, faktanavn?: string) => void;
  lagringSideeffekterCallback: (
    aksjonspunktModeller: [{ kode: string; isVedtakSubmission?: boolean; sendVarsel?: boolean }],
  ) => any;
  lagreAksjonspunkter: (params: any, keepData?: boolean) => Promise<any>;
  lagreOverstyrteAksjonspunkter?: (params: any, keepData?: boolean) => Promise<any>;
  useMultipleRestApi: (endpoints: EndpointData[], options: Options) => RestApiData<any>;
  featureToggles?: FeatureToggles;
}

const ProsessStegPanel = ({
  valgtProsessSteg,
  fagsak,
  behandling,
  alleKodeverk,
  apentFaktaPanelInfo,
  oppdaterProsessStegOgFaktaPanelIUrl,
  lagringSideeffekterCallback,
  lagreAksjonspunkter,
  lagreOverstyrteAksjonspunkter,
  useMultipleRestApi,
  featureToggles,
}: OwnProps) => {
  const erHenlagtOgVedtakStegValgt =
    behandling.behandlingHenlagt && valgtProsessSteg && valgtProsessSteg.getUrlKode() === prosessStegCodes.VEDTAK;

  const panelKeys = valgtProsessSteg
    ? valgtProsessSteg
      .getDelPaneler()[0]
      .getProsessStegDelPanelDef()
      .getEndepunkter(featureToggles)
      .map(e => ({ key: e }))
    : [];

  const suspendRequest = !!(
    panelKeys.length === 0 ||
    erHenlagtOgVedtakStegValgt ||
    !valgtProsessSteg ||
    (!valgtProsessSteg.getErStegBehandlet() && valgtProsessSteg.getUrlKode())
  );

  const { data, state: hentDataState } = useMultipleRestApi(panelKeys, {
    keepData: true,
    isCachingOn: true,
    suspendRequest,
    updateTriggers: [behandling?.versjon, suspendRequest, valgtProsessSteg],
  });

  const bekreftAksjonspunktCallback = prosessStegHooks.useBekreftAksjonspunkt(
    fagsak,
    behandling,
    lagringSideeffekterCallback,
    lagreAksjonspunkter,
    lagreOverstyrteAksjonspunkter,
    valgtProsessSteg,
  );

  if (erHenlagtOgVedtakStegValgt) {
    return <BehandlingHenlagtPanel />;
  }
  if (!valgtProsessSteg) {
    return null;
  }
  if (!valgtProsessSteg.getErStegBehandlet() && valgtProsessSteg.getUrlKode()) {
    return <ProsessStegIkkeBehandletPanel />;
  }

  const harHentetData = panelKeys.length === 0 || hentDataState === RestApiState.SUCCESS;
  const delPaneler = valgtProsessSteg.getDelPaneler();

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {valgtProsessSteg.getErStegBehandlet() && (
        <MargMarkering
          behandlingStatus={behandling.status}
          aksjonspunkter={valgtProsessSteg.getAksjonspunkter()}
          isReadOnly={valgtProsessSteg.getErReadOnly()}
          visAksjonspunktMarkering={delPaneler.length === 1}
        >
          {delPaneler.length === 1 && (
            <FadingPanel>
              {!harHentetData && <LoadingPanel />}
              {harHentetData && (
                <>
                  {delPaneler[0].getProsessStegDelPanelDef().getKomponent({
                    behandling,
                    featureToggles,
                    alleKodeverk,
                    submitCallback: bekreftAksjonspunktCallback,
                    ...delPaneler[0].getKomponentData(),
                    ...data,
                  })}
                </>
              )}
            </FadingPanel>
          )}
          {delPaneler.length > 1 && (
            <InngangsvilkarPanel
              behandling={behandling}
              alleKodeverk={alleKodeverk}
              prosessStegData={delPaneler}
              submitCallback={bekreftAksjonspunktCallback}
              apentFaktaPanelInfo={apentFaktaPanelInfo}
              oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
              useMultipleRestApi={useMultipleRestApi}
            />
          )}
        </MargMarkering>
      )}
    </>
  );
};

export default ProsessStegPanel;

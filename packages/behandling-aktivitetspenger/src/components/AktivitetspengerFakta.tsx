import { useEffect, useMemo, useState } from 'react';

import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { useSetBehandlingVedEndring } from '@k9-sak-web/behandling-felles';
import ErrorBoundary from '@k9-sak-web/gui/app/feilmeldinger/ErrorBoundary.js';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { Behandling, Fagsak } from '@k9-sak-web/types';

import { ung_sak_kontrakt_behandling_BehandlingDto } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { FaktaMeny } from '@k9-sak-web/gui/behandling/fakta/FaktaMeny.js';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { restApiUngdomsytelseHooks, UngdomsytelseBehandlingApiKeys } from '../data/ungdomsytelseBehandlingApi';
import { UngSakBackendClient } from '../data/UngSakBackendClient';
import { useBekreftAksjonspunkt } from '../hooks/useBekreftAksjonspunkt';
import { TestFaktaPanel } from './fakta/TestFaktaPanel';
import { TestFaktaPanel2 } from './fakta/TestFaktaPanel2';
import { useFaktamotor } from './Faktamotor';

const overstyringApCodes = [ac.OVERSTYRING_AV_BEREGNINGSAKTIVITETER, ac.OVERSTYRING_AV_BEREGNINGSGRUNNLAG];

interface OwnProps {
  // data: FetchedData;
  fagsak: Fagsak;
  // fagsakPerson: FagsakPerson;
  behandling: ung_sak_kontrakt_behandling_BehandlingDto;
  // alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  // rettigheter: Rettigheter;
  // hasFetchError: boolean;
  oppdaterProsessStegOgFaktaPanelIUrl: (prosessPanel?: string, faktanavn?: string) => void;
  // valgtFaktaSteg?: string;
  // valgtProsessSteg?: string;
  // setApentFaktaPanel: (faktaPanelInfo: { urlCode: string; textCode: string }) => void;
  setBehandling: (behandling: Behandling) => void;
  // arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  // dokumenter: Dokument[];
  // featureToggles: FeatureToggles;
  // beregningErBehandlet?: boolean;
}

export const AktivitetspengerFakta = ({
  data,
  behandling,
  fagsak,
  // fagsakPerson,
  // rettigheter,
  // alleKodeverk,
  oppdaterProsessStegOgFaktaPanelIUrl,
  // valgtFaktaSteg,
  // valgtProsessSteg,
  // hasFetchError,
  // setApentFaktaPanel,
  setBehandling,
  // arbeidsgiverOpplysningerPerId,
  // dokumenter,
  // featureToggles,
  // beregningErBehandlet,
}: OwnProps) => {
  // const { aksjonspunkter, ...rest } = data;
  const { addErrorMessage } = useRestApiErrorDispatcher();

  const { startRequest: lagreAksjonspunkter, data: apBehandlingRes } =
    restApiUngdomsytelseHooks.useRestApiRunner<Behandling>(UngdomsytelseBehandlingApiKeys.SAVE_AKSJONSPUNKT);
  useSetBehandlingVedEndring(apBehandlingRes, setBehandling);

  const { startRequest: lagreOverstyrteAksjonspunkter, data: apOverstyrtBehandlingRes } =
    restApiUngdomsytelseHooks.useRestApiRunner<Behandling>(UngdomsytelseBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT);
  useSetBehandlingVedEndring(apOverstyrtBehandlingRes, setBehandling);

  // const dataTilUtledingAvPleiepengerPaneler = {
  //   fagsak,
  //   fagsakPerson,
  //   behandling,
  //   hasFetchError,
  //   arbeidsgiverOpplysningerPerId,
  //   ...rest,
  // };

  // const [faktaPaneler, valgtPanel, sidemenyPaneler] = faktaHooks.useFaktaPaneler(
  //   faktaPanelDefinisjoner,
  //   dataTilUtledingAvPleiepengerPaneler,
  //   behandling,
  //   rettigheter,
  //   aksjonspunkter,
  //   valgtFaktaSteg,
  //   featureToggles,
  // );

  // faktaHooks.useFaktaAksjonspunktNotifikator(faktaPaneler, setApentFaktaPanel, behandling.versjon, featureToggles);

  // const [velgFaktaPanelCallback, bekreftAksjonspunktCallback] = faktaHooks.useCallbacks(
  //   faktaPaneler,
  //   fagsak,
  //   behandling,
  //   oppdaterProsessStegOgFaktaPanelIUrl,
  //   valgtProsessSteg,
  //   overstyringApCodes,
  //   lagreAksjonspunkter,
  //   lagreOverstyrteAksjonspunkter,
  // );

  // const endepunkter = valgtPanel
  //   ? valgtPanel
  //       .getPanelDef()
  //       .getEndepunkter()
  //       .map(e => ({ key: e }))
  //   : [];
  // const endepunkterUtenCaching = valgtPanel
  //   ? valgtPanel
  //       .getPanelDef()
  //       .getEndepunkterUtenCaching()
  //       .map(e => ({ key: e }))
  //   : [];
  // TODO FetchedData er feil type her
  // const { data: faktaData, state } = restApiPleiepengerHooks.useMultipleRestApi<FetchedData>(endepunkter, {
  //   updateTriggers: [behandling.versjon, valgtPanel],
  //   suspendRequest: !valgtPanel,
  //   isCachingOn: true,
  // });

  // const { data: faktaDataUtenCaching, state: stateForEndepunkterUtenCaching } =
  //   restApiPleiepengerHooks.useMultipleRestApi<FetchedData>(endepunkterUtenCaching, {
  //     updateTriggers: [behandling.versjon, valgtPanel],
  //     suspendRequest: !valgtPanel,
  //   });

  const bekreftAksjonspunktCallback = useBekreftAksjonspunkt({
    fagsak,
    behandling,
    lagreAksjonspunkter,
    lagreOverstyrteAksjonspunkter,
    oppdaterProsessStegOgFaktaPanelIUrl,
  });

  const [formData, setFormData] = useState({});
  const ungSakApi = useMemo(() => new UngSakBackendClient(), []);
  const faktapaneler = useFaktamotor({ api: ungSakApi, behandling });
  useEffect(() => {
    if (formData) {
      setFormData(undefined);
    }
  }, [behandling.versjon, formData]);

  // if (sidemenyPaneler.length > 0) {
  //   const isLoading =
  //     state === RestApiState.NOT_STARTED ||
  //     state === RestApiState.LOADING ||
  //     stateForEndepunkterUtenCaching === RestApiState.NOT_STARTED ||
  //     stateForEndepunkterUtenCaching === RestApiState.LOADING;
  return (
    <FaktaMeny paneler={faktapaneler}>
      <ErrorBoundary errorMessageCallback={addErrorMessage}>
        {/* {valgtPanel && isLoading && <LoadingPanel />} */}
        {/* {valgtPanel && !isLoading && (
            {valgtPanel.getPanelDef().getKomponent({
              ...faktaData,
              ...faktaDataUtenCaching,
              behandling,
              alleKodeverk,
              featureToggles,
              submitCallback: bekreftAksjonspunktCallback,
              ...valgtPanel.getKomponentData(
                rettigheter,
                dataTilUtledingAvPleiepengerPaneler,
                hasFetchError,
                featureToggles,
              ),
              dokumenter,
              beregningErBehandlet,
              formData,
              setFormData,
            })}
          )} */}
        {faktapaneler.map(panel => {
          const urlKode = panel.urlKode;
          if (urlKode === faktaPanelCodes.MEDLEMSKAPSVILKARET) {
            return <TestFaktaPanel key={urlKode} api={ungSakApi} behandling={behandling} />;
          }
          if (urlKode === faktaPanelCodes.BEREGNING) {
            return <TestFaktaPanel2 key={urlKode} api={ungSakApi} behandling={behandling} />;
          }
          return null;
        })}
      </ErrorBoundary>
    </FaktaMeny>
  );
  // }
};

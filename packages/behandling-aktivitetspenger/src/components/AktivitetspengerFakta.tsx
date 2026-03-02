import { useEffect, useState } from 'react';

import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import ErrorBoundary from '@k9-sak-web/gui/app/feilmeldinger/ErrorBoundary.js';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { Fagsak } from '@k9-sak-web/types';

import {
  ung_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto,
  ung_sak_kontrakt_aksjonspunkt_BekreftetOgOverstyrteAksjonspunkterDto,
  ung_sak_kontrakt_behandling_BehandlingDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { FaktaMeny } from '@k9-sak-web/gui/behandling/fakta/FaktaMeny.js';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { useMutation } from '@tanstack/react-query';
import { UngSakBackendClient } from '../data/UngSakBackendClient';
import { useBekreftAksjonspunkt } from '../hooks/useBekreftAksjonspunkt';
import { usePollBehandlingStatus } from '../hooks/usePollBehandlingStatus';
import { TestFaktaPanel } from './fakta/TestFaktaPanel';
import { TestFaktaPanel2 } from './fakta/TestFaktaPanel2';
import { useFaktamotor } from './Faktamotor';

const overstyringApCodes = [ac.OVERSTYRING_AV_BEREGNINGSAKTIVITETER, ac.OVERSTYRING_AV_BEREGNINGSGRUNNLAG];

interface OwnProps {
  fagsak: Fagsak;
  behandling: ung_sak_kontrakt_behandling_BehandlingDto;
  oppdaterProsessStegOgFaktaPanelIUrl: (prosessPanel?: string, faktanavn?: string) => void;
  setBehandling: (behandling: ung_sak_kontrakt_behandling_BehandlingDto) => void;
  api: UngSakBackendClient;
}

export const AktivitetspengerFakta = ({
  api,
  behandling,
  fagsak,
  oppdaterProsessStegOgFaktaPanelIUrl,
  setBehandling,
}: OwnProps) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  const { pollTilBehandlingErKlar } = usePollBehandlingStatus(api, behandling, setBehandling);
  const { mutateAsync: lagreAksjonspunktMutation } = useMutation({
    mutationFn: (aksjonspunktData: ung_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto) =>
      api.lagreAksjonspunkt({
        behandlingId: `${behandling.id}`,
        behandlingVersjon: behandling.versjon,
        bekreftedeAksjonspunktDtoer: aksjonspunktData.bekreftedeAksjonspunktDtoer,
      }),
    onSuccess: () => pollTilBehandlingErKlar(),
  });

  const { mutateAsync: lagreOverstyrteAksjonspunktMutation } = useMutation({
    mutationFn: (aksjonspunktData: ung_sak_kontrakt_aksjonspunkt_BekreftetOgOverstyrteAksjonspunkterDto) =>
      api.lagreAksjonspunktOverstyr({
        behandlingId: `${behandling.id}`,
        behandlingVersjon: behandling.versjon,
        bekreftedeAksjonspunktDtoer: [],
        overstyrteAksjonspunktDtoer: aksjonspunktData.overstyrteAksjonspunktDtoer,
      }),
    onSuccess: () => pollTilBehandlingErKlar(),
  });

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
    lagreAksjonspunkter: lagreAksjonspunktMutation,
    lagreOverstyrteAksjonspunkter: lagreOverstyrteAksjonspunktMutation,
    oppdaterProsessStegOgFaktaPanelIUrl,
  });

  const [formData, setFormData] = useState({});
  const faktapaneler = useFaktamotor({ api, behandling });
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
            return <TestFaktaPanel key={urlKode} api={api} behandling={behandling} />;
          }
          if (urlKode === faktaPanelCodes.BEREGNING) {
            return <TestFaktaPanel2 key={urlKode} api={api} behandling={behandling} />;
          }
          return null;
        })}
      </ErrorBoundary>
    </FaktaMeny>
  );
  // }
};

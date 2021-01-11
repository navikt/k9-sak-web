import React, { FunctionComponent } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import { Rettigheter, SideMenuWrapper, faktaHooks, useSetBehandlingVedEndring } from '@k9-sak-web/behandling-felles';
import { KodeverkMedNavn, Behandling, Fagsak, FagsakPerson, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { LoadingPanel } from '@fpsak-frontend/shared-components';

import { restApiFrisinnHooks, FrisinnBehandlingApiKeys } from '../data/frisinnBehandlingApi';
import faktaPanelDefinisjoner from '../panelDefinisjoner/faktaFrisinnPanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';

const overstyringApCodes = [
  ac.OVERSTYR_AVKLAR_STARTDATO,
  ac.OVERSTYR_AVKLAR_FAKTA_UTTAK,
  ac.OVERSTYR_AVKLAR_STARTDATO,
  ac.MANUELL_AVKLAR_FAKTA_UTTAK,
  ac.OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
  ac.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
];

interface OwnProps {
  data: FetchedData;
  fagsak: Fagsak;
  fagsakPerson: FagsakPerson;
  behandling: Behandling;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  rettigheter: Rettigheter;
  hasFetchError: boolean;
  oppdaterProsessStegOgFaktaPanelIUrl: (prosessPanel?: string, faktanavn?: string) => void;
  valgtFaktaSteg?: string;
  valgtProsessSteg?: string;
  setApentFaktaPanel: (faktaPanelInfo: { urlCode: string; textCode: string }) => void;
  setBehandling: (behandling: Behandling) => void;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

const FrisinnFakta: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  data,
  behandling,
  fagsak,
  fagsakPerson,
  rettigheter,
  alleKodeverk,
  oppdaterProsessStegOgFaktaPanelIUrl,
  valgtFaktaSteg,
  valgtProsessSteg,
  hasFetchError,
  setApentFaktaPanel,
  setBehandling,
  arbeidsgiverOpplysningerPerId,
}) => {
  const { aksjonspunkter, ...rest } = data;

  const { startRequest: lagreAksjonspunkter, data: apBehandlingRes } = restApiFrisinnHooks.useRestApiRunner<Behandling>(
    FrisinnBehandlingApiKeys.SAVE_AKSJONSPUNKT,
  );
  useSetBehandlingVedEndring(apBehandlingRes, setBehandling);

  const {
    startRequest: lagreOverstyrteAksjonspunkter,
    data: apOverstyrtBehandlingRes,
  } = restApiFrisinnHooks.useRestApiRunner<Behandling>(FrisinnBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT);
  useSetBehandlingVedEndring(apOverstyrtBehandlingRes, setBehandling);

  const dataTilUtledingAvFpPaneler = {
    fagsak,
    fagsakPerson,
    behandling,
    hasFetchError,
    arbeidsgiverOpplysningerPerId,
    ...rest,
  };

  const [faktaPaneler, valgtPanel, sidemenyPaneler] = faktaHooks.useFaktaPaneler(
    faktaPanelDefinisjoner,
    dataTilUtledingAvFpPaneler,
    behandling,
    rettigheter,
    aksjonspunkter,
    valgtFaktaSteg,
    intl,
  );

  faktaHooks.useFaktaAksjonspunktNotifikator(faktaPaneler, setApentFaktaPanel, behandling.versjon);

  const [velgFaktaPanelCallback, bekreftAksjonspunktCallback] = faktaHooks.useCallbacks(
    faktaPaneler,
    fagsak,
    behandling,
    oppdaterProsessStegOgFaktaPanelIUrl,
    valgtProsessSteg,
    overstyringApCodes,
    lagreAksjonspunkter,
    lagreOverstyrteAksjonspunkter,
  );

  const endepunkter = valgtPanel
    ? valgtPanel
        .getPanelDef()
        .getEndepunkter()
        .map(e => ({ key: e }))
    : [];
  // TODO FetchedData er feil type
  const { data: faktaData, state } = restApiFrisinnHooks.useMultipleRestApi<FetchedData>(endepunkter, {
    updateTriggers: [behandling.versjon, valgtPanel],
    suspendRequest: !valgtPanel,
    isCachingOn: true,
  });

  if (sidemenyPaneler.length > 0) {
    const isLoading = state === RestApiState.NOT_STARTED || state === RestApiState.LOADING;
    return (
      <SideMenuWrapper paneler={sidemenyPaneler} onClick={velgFaktaPanelCallback}>
        {valgtPanel && isLoading && <LoadingPanel />}
        {valgtPanel &&
          !isLoading &&
          valgtPanel.getPanelDef().getKomponent({
            ...faktaData,
            behandling,
            alleKodeverk,
            submitCallback: bekreftAksjonspunktCallback,
            ...valgtPanel.getKomponentData(rettigheter, dataTilUtledingAvFpPaneler, hasFetchError),
          })}
      </SideMenuWrapper>
    );
  }
  return null;
};

export default injectIntl(FrisinnFakta);

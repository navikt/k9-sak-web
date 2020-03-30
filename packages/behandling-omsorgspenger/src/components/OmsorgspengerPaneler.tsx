import React, { FunctionComponent, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  Kodeverk,
  NavAnsatt,
  Behandling,
  FagsakInfo,
  BehandlingPaVent,
  SettPaVentParams,
} from '@fpsak-frontend/behandling-felles';

import OmsorgspengerProsess from './OmsorgspengerProsess';
import OmsorgspengerFakta from './OmsorgspengerFakta';
import FetchedData from '../types/fetchedDataTsType';

interface OwnProps {
  fetchedData: FetchedData;
  fagsak: FagsakInfo;
  behandling: Behandling;
  alleKodeverk: { [key: string]: Kodeverk[] };
  navAnsatt: NavAnsatt;

  valgtProsessSteg?: string;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  valgtFaktaSteg?: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, { keepData: boolean }) => Promise<any>;
  opneSokeside: () => void;
  hasFetchError: boolean;
  featureToggles: {};
}

const OmsorgspengerPaneler: FunctionComponent<OwnProps> = ({
  fetchedData,
  fagsak,
  behandling,
  alleKodeverk,
  navAnsatt,
  valgtProsessSteg,
  oppdaterProsessStegOgFaktaPanelIUrl,
  valgtFaktaSteg,
  oppdaterBehandlingVersjon,
  settPaVent,
  hentBehandling,
  opneSokeside,
  hasFetchError,
  featureToggles,
}) => {
  const [apentFaktaPanelInfo, setApentFaktaPanel] = useState();
  // TODO (TOR) Har trekt denne ut hit grunna redux test-oppsett. Fiks
  const dispatch = useDispatch();

  return (
    <>
      <BehandlingPaVent
        behandling={behandling}
        aksjonspunkter={fetchedData.aksjonspunkter}
        kodeverk={alleKodeverk}
        settPaVent={settPaVent}
        hentBehandling={hentBehandling}
      />
      <OmsorgspengerProsess
        data={fetchedData}
        fagsak={fagsak}
        behandling={behandling}
        alleKodeverk={alleKodeverk}
        navAnsatt={navAnsatt}
        valgtProsessSteg={valgtProsessSteg}
        valgtFaktaSteg={valgtFaktaSteg}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
        opneSokeside={opneSokeside}
        hasFetchError={hasFetchError}
        featureToggles={featureToggles}
        apentFaktaPanelInfo={apentFaktaPanelInfo}
        dispatch={dispatch}
      />
      <OmsorgspengerFakta
        behandling={behandling}
        data={fetchedData}
        fagsak={fagsak}
        alleKodeverk={alleKodeverk}
        navAnsatt={navAnsatt}
        hasFetchError={hasFetchError}
        valgtFaktaSteg={valgtFaktaSteg}
        valgtProsessSteg={valgtProsessSteg}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        setApentFaktaPanel={setApentFaktaPanel}
        dispatch={dispatch}
      />
    </>
  );
};

export default OmsorgspengerPaneler;

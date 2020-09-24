import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { FagsakInfo, Rettigheter, BehandlingPaVent, SettPaVentParams } from '@fpsak-frontend/behandling-felles';
import { Behandling, Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';

import KlageProsess from './KlageProsess';
import FetchedData from '../types/fetchedDataTsType';

interface OwnProps {
  fagsak: FagsakInfo;
  behandling: Behandling;
  fetchedData: FetchedData;
  kodeverk: { [key: string]: KodeverkMedNavn[] };
  rettigheter: Rettigheter;
  valgtProsessSteg?: string;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, { keepData: boolean }) => Promise<any>;
  opneSokeside: () => void;
  alleBehandlinger: {
    id: number;
    uuid: string;
    type: Kodeverk;
    status: Kodeverk;
    opprettet: string;
    avsluttet?: string;
  }[];
  featureToggles: {};
}

const KlagePaneler: FunctionComponent<OwnProps> = ({
  fagsak,
  behandling,
  fetchedData,
  kodeverk,
  rettigheter,
  valgtProsessSteg,
  oppdaterProsessStegOgFaktaPanelIUrl,
  oppdaterBehandlingVersjon,
  settPaVent,
  hentBehandling,
  opneSokeside,
  alleBehandlinger,
  featureToggles,
}) => {
  // TODO (TOR) Har trekt denne ut hit grunna redux test-oppsett. Fiks
  const dispatch = useDispatch();

  return (
    <>
      <BehandlingPaVent
        behandling={behandling}
        aksjonspunkter={fetchedData.aksjonspunkter}
        kodeverk={kodeverk}
        settPaVent={settPaVent}
        hentBehandling={hentBehandling}
      />
      <KlageProsess
        data={fetchedData}
        fagsak={fagsak}
        behandling={behandling}
        rettigheter={rettigheter}
        valgtProsessSteg={valgtProsessSteg}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
        opneSokeside={opneSokeside}
        alleBehandlinger={alleBehandlinger}
        dispatch={dispatch}
        alleKodeverk={kodeverk}
        featureToggles={featureToggles}
      />
    </>
  );
};

export default KlagePaneler;

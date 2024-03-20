import React from 'react';

import { BehandlingPaVent, SettPaVentParams, Rettigheter } from '@k9-sak-web/behandling-felles';
import { Fagsak, Behandling, KodeverkMedNavn, FagsakPerson } from '@k9-sak-web/types';

import AnkeProsess from './AnkeProsess';
import FetchedData from '../types/fetchedDataTsType';

interface OwnProps {
  fagsak: Fagsak;
  fagsakPerson: FagsakPerson;
  behandling: Behandling;
  fetchedData: FetchedData;
  rettigheter: Rettigheter;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  valgtProsessSteg?: string;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  setBehandling: (behandling: Behandling) => void;
  opneSokeside: () => void;
  alleBehandlinger: {
    id: number;
    type: string;
    avsluttet?: string;
  }[];
}

const AnkePaneler = ({
  fagsak,
  fagsakPerson,
  behandling,
  fetchedData,
  rettigheter,
  alleKodeverk,
  valgtProsessSteg,
  oppdaterProsessStegOgFaktaPanelIUrl,
  oppdaterBehandlingVersjon,
  settPaVent,
  opneSokeside,
  alleBehandlinger,
  setBehandling,
}: OwnProps) => (
  <>
    <BehandlingPaVent
      behandling={behandling}
      aksjonspunkter={fetchedData?.aksjonspunkter}
      kodeverk={alleKodeverk}
      settPaVent={settPaVent}
    />
    <AnkeProsess
      data={fetchedData}
      fagsak={fagsak}
      fagsakPerson={fagsakPerson}
      behandling={behandling}
      rettigheter={rettigheter}
      valgtProsessSteg={valgtProsessSteg}
      oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
      oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
      opneSokeside={opneSokeside}
      alleBehandlinger={alleBehandlinger}
      alleKodeverk={alleKodeverk}
      setBehandling={setBehandling}
    />
  </>
);

export default AnkePaneler;

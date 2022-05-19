import React from 'react';

import { Rettigheter, BehandlingPaVent, SettPaVentParams } from '@k9-sak-web/behandling-felles';
import { Fagsak, KodeverkMedNavn, Behandling, FeatureToggles, FagsakPerson } from '@k9-sak-web/types';

import InnsynProsess from './InnsynProsess';
import FetchedData from '../types/fetchedDataTsType';

interface OwnProps {
  fagsak: Fagsak;
  fagsakPerson: FagsakPerson;
  behandling: Behandling;
  fetchedData: FetchedData;
  kodeverk: { [key: string]: KodeverkMedNavn[] };
  rettigheter: Rettigheter;
  valgtProsessSteg?: string;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  opneSokeside: () => void;
  setBehandling: (behandling: Behandling) => void;
  featureToggles: FeatureToggles;
}

const InnsynPaneler = ({
  fagsak,
  fagsakPerson,
  behandling,
  fetchedData,
  kodeverk,
  rettigheter,
  valgtProsessSteg,
  oppdaterProsessStegOgFaktaPanelIUrl,
  oppdaterBehandlingVersjon,
  settPaVent,
  opneSokeside,
  setBehandling,
  featureToggles,
}: OwnProps) => (
  <>
    <BehandlingPaVent
      behandling={behandling}
      aksjonspunkter={fetchedData?.aksjonspunkter}
      kodeverk={kodeverk}
      settPaVent={settPaVent}
    />
    <InnsynProsess
      fagsak={fagsak}
      fagsakPerson={fagsakPerson}
      behandling={behandling}
      data={fetchedData}
      alleKodeverk={kodeverk}
      rettigheter={rettigheter}
      valgtProsessSteg={valgtProsessSteg}
      oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
      oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
      opneSokeside={opneSokeside}
      setBehandling={setBehandling}
      featureToggles={featureToggles}
    />
  </>
);

export default InnsynPaneler;

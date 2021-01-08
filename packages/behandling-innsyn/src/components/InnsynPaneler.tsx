import React, { FunctionComponent } from 'react';

import { Rettigheter, BehandlingPaVent, SettPaVentParams } from '@fpsak-frontend/behandling-felles';
import { Fagsak, KodeverkMedNavn, Behandling, FeatureToggles } from '@k9-sak-web/types';

import InnsynProsess from './InnsynProsess';
import FetchedData from '../types/fetchedDataTsType';

interface OwnProps {
  fagsak: Fagsak;
  behandling: Behandling;
  fetchedData: FetchedData;
  kodeverk: { [key: string]: KodeverkMedNavn[] };
  rettigheter: Rettigheter;
  valgtProsessSteg?: string;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: (params: { behandlingId: number }, keepData: boolean) => Promise<any>;
  opneSokeside: () => void;
  setBehandling: (behandling: Behandling) => void;
  featureToggles: FeatureToggles;
}

const InnsynPaneler: FunctionComponent<OwnProps> = ({
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
  setBehandling,
  featureToggles,
}) => (
  <>
    <BehandlingPaVent
      behandling={behandling}
      aksjonspunkter={fetchedData.aksjonspunkter}
      kodeverk={kodeverk}
      settPaVent={settPaVent}
      hentBehandling={hentBehandling}
    />
    <InnsynProsess
      fagsak={fagsak}
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

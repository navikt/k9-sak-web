import React from 'react';

import { BehandlingPaVent, SettPaVentParams, Rettigheter } from '@k9-sak-web/behandling-felles';
import { Behandling, Fagsak, FagsakPerson } from '@k9-sak-web/types';
import { AlleKodeverk } from '@k9-sak-web/lib/types/index.js';
import TilbakekrevingProsess from './TilbakekrevingProsess';
import TilbakekrevingFakta from './TilbakekrevingFakta';
import FetchedData from '../types/fetchedDataTsType';

interface OwnProps {
  fetchedData: FetchedData;
  fagsak: Fagsak;
  fagsakPerson: FagsakPerson;
  behandling: Behandling;
  kodeverk: AlleKodeverk;
  fpsakKodeverk: AlleKodeverk;
  rettigheter: Rettigheter;
  valgtProsessSteg?: string;
  valgtFaktaSteg?: string;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  opneSokeside: () => void;
  harApenRevurdering: boolean;
  hasFetchError: boolean;
  setBehandling: (behandling: Behandling) => void;
}

const TilbakekrevingPaneler = ({
  fetchedData,
  fagsak,
  fagsakPerson,
  behandling,
  kodeverk,
  fpsakKodeverk,
  rettigheter,
  valgtProsessSteg,
  valgtFaktaSteg,
  oppdaterProsessStegOgFaktaPanelIUrl,
  oppdaterBehandlingVersjon,
  settPaVent,
  opneSokeside,
  harApenRevurdering,
  hasFetchError,
  setBehandling,
}: OwnProps) => (
  <>
    <BehandlingPaVent
      behandling={behandling}
      aksjonspunkter={fetchedData?.aksjonspunkter}
      kodeverk={kodeverk}
      settPaVent={settPaVent}
      erTilbakekreving
    />
    <TilbakekrevingProsess
      data={fetchedData}
      fagsak={fagsak}
      fagsakPerson={fagsakPerson}
      behandling={behandling}
      alleKodeverk={kodeverk}
      valgtProsessSteg={valgtProsessSteg}
      oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
      oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
      opneSokeside={opneSokeside}
      harApenRevurdering={harApenRevurdering}
      hasFetchError={hasFetchError}
      rettigheter={rettigheter}
      setBehandling={setBehandling}
    />
    <TilbakekrevingFakta
      data={fetchedData}
      fagsak={fagsak}
      behandling={behandling}
      rettigheter={rettigheter}
      alleKodeverk={kodeverk}
      fpsakKodeverk={fpsakKodeverk}
      valgtFaktaSteg={valgtFaktaSteg}
      oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
      hasFetchError={hasFetchError}
      setBehandling={setBehandling}
    />
  </>
);

export default TilbakekrevingPaneler;

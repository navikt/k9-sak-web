import React, { FunctionComponent } from 'react';

import { FagsakInfo, BehandlingPaVent, SettPaVentParams } from '@fpsak-frontend/behandling-felles';
import { Behandling, Kodeverk, NavAnsatt, Vilkar, Aksjonspunkt } from '@k9-sak-web/types';

import KlageProsess from './KlageProsess';
import KlageVurdering from '../types/klageVurderingTsType';

interface OwnProps {
  fagsak: FagsakInfo;
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  klageVurdering: KlageVurdering;
  kodeverk: { [key: string]: Kodeverk[] };
  navAnsatt: NavAnsatt;
  valgtProsessSteg?: string;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, { keepData: boolean }) => Promise<any>;
  opneSokeside: () => void;
  alleBehandlinger: [
    {
      id: number;
      type: Kodeverk;
      avsluttet?: string;
      status: Kodeverk;
      uuid: string;
    },
  ];
}

const KlageGrid: FunctionComponent<OwnProps> = ({
  fagsak,
  behandling,
  aksjonspunkter,
  vilkar,
  klageVurdering,
  kodeverk,
  navAnsatt,
  valgtProsessSteg,
  oppdaterProsessStegOgFaktaPanelIUrl,
  oppdaterBehandlingVersjon,
  settPaVent,
  hentBehandling,
  opneSokeside,
  alleBehandlinger,
}) => (
  <>
    <BehandlingPaVent
      behandling={behandling}
      aksjonspunkter={aksjonspunkter}
      kodeverk={kodeverk}
      settPaVent={settPaVent}
      hentBehandling={hentBehandling}
    />
    <KlageProsess
      fagsak={fagsak}
      behandling={behandling}
      aksjonspunkter={aksjonspunkter}
      vilkar={vilkar}
      klageVurdering={klageVurdering}
      kodeverk={kodeverk}
      navAnsatt={navAnsatt}
      valgtProsessSteg={valgtProsessSteg}
      oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
      oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
      opneSokeside={opneSokeside}
      alleBehandlinger={alleBehandlinger}
    />
  </>
);

export default KlageGrid;

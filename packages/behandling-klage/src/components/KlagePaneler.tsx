import React from 'react';

import { Rettigheter, BehandlingPaVent, SettPaVentParams } from '@k9-sak-web/behandling-felles';
import {
  Fagsak,
  Behandling,
  Kodeverk,
  KodeverkMedNavn,
  FagsakPerson,
  ArbeidsgiverOpplysningerPerId,
  FeatureToggles,
} from '@k9-sak-web/types';

import KlageProsess from './KlageProsess';
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
  alleBehandlinger: {
    id: number;
    uuid: string;
    type: string;
    status: string;
    opprettet: string;
    avsluttet?: string;
  }[];
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  setBehandling: (behandling: Behandling) => void;
  featureToggles: FeatureToggles;
}

const KlagePaneler = ({
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
  alleBehandlinger,
  arbeidsgiverOpplysningerPerId,
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
    <KlageProsess
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
      alleKodeverk={kodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      setBehandling={setBehandling}
      featureToggles={featureToggles}
    />
  </>
);

export default KlagePaneler;

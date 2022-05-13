import React, { useState } from 'react';

import { Rettigheter, BehandlingPaVent, SettPaVentParams } from '@k9-sak-web/behandling-felles';
import {
  Fagsak,
  KodeverkMedNavn,
  Behandling,
  FeatureToggles,
  ArbeidsgiverOpplysningerPerId,
  FagsakPerson,
} from '@k9-sak-web/types';

import FrisinnProsess from './FrisinnProsess';
import FrisinnFakta from './FrisinnFakta';
import FetchedData from '../types/fetchedDataTsType';

interface OwnProps {
  fetchedData: FetchedData;
  fagsak: Fagsak;
  fagsakPerson: FagsakPerson;
  behandling: Behandling;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  rettigheter: Rettigheter;
  valgtProsessSteg?: string;
  valgtFaktaSteg?: string;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  opneSokeside: () => void;
  hasFetchError: boolean;
  setBehandling: (behandling: Behandling) => void;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  featureToggles: FeatureToggles;
}

interface FaktaPanelInfo {
  urlCode: string;
  textCode: string;
}

const FrisinnPaneler = ({
  fetchedData,
  fagsak,
  fagsakPerson,
  behandling,
  alleKodeverk,
  rettigheter,
  valgtProsessSteg,
  oppdaterProsessStegOgFaktaPanelIUrl,
  valgtFaktaSteg,
  oppdaterBehandlingVersjon,
  settPaVent,
  opneSokeside,
  hasFetchError,
  featureToggles,
  setBehandling,
  arbeidsgiverOpplysningerPerId,
}: OwnProps) => {
  const [apentFaktaPanelInfo, setApentFaktaPanel] = useState<FaktaPanelInfo>();

  return (
    <>
      <BehandlingPaVent
        behandling={behandling}
        aksjonspunkter={fetchedData?.aksjonspunkter}
        kodeverk={alleKodeverk}
        settPaVent={settPaVent}
      />
      <FrisinnProsess
        data={fetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling}
        alleKodeverk={alleKodeverk}
        rettigheter={rettigheter}
        valgtProsessSteg={valgtProsessSteg}
        valgtFaktaSteg={valgtFaktaSteg}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
        opneSokeside={opneSokeside}
        hasFetchError={hasFetchError}
        featureToggles={featureToggles}
        apentFaktaPanelInfo={apentFaktaPanelInfo}
        setBehandling={setBehandling}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />
      <FrisinnFakta
        behandling={behandling}
        data={fetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        alleKodeverk={alleKodeverk}
        rettigheter={rettigheter}
        hasFetchError={hasFetchError}
        valgtFaktaSteg={valgtFaktaSteg}
        valgtProsessSteg={valgtProsessSteg}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        setApentFaktaPanel={setApentFaktaPanel}
        setBehandling={setBehandling}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />
    </>
  );
};

export default FrisinnPaneler;

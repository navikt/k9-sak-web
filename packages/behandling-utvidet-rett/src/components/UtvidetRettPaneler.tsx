import React, { useState } from 'react';
import { BehandlingPaVent } from '@k9-sak-web/behandling-felles';
import UtvidetRettProsess from './UtvidetRettProsess';
import UtvidetRettFakta from './UtvidetRettFakta';
import { PanelerProps } from '../types/PanelerProps';
import { FaktaPanelInfoProps } from '../types/FaktaPanelInfoProps';

const UtvidetRettPaneler = ({
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
}: PanelerProps) => {
  const [apentFaktaPanelInfo, setApentFaktaPanel] = useState<FaktaPanelInfoProps>();

  return (
    <>
      <BehandlingPaVent
        behandling={behandling}
        aksjonspunkter={fetchedData?.aksjonspunkter}
        kodeverk={alleKodeverk}
        settPaVent={settPaVent}
      />
      <UtvidetRettProsess
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
        apentFaktaPanelInfo={apentFaktaPanelInfo}
        setBehandling={setBehandling}
        featureToggles={featureToggles}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />
      <UtvidetRettFakta
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
        featureToggles={featureToggles}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />
    </>
  );
};

export default UtvidetRettPaneler;

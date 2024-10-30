import { BehandlingPaVent, Rettigheter, SettPaVentParams } from '@k9-sak-web/behandling-felles';
import { ArbeidsgiverOpplysningerPerId, Behandling, Fagsak, FagsakPerson, FeatureToggles } from '@k9-sak-web/types';
import FetchedData from '../types/FetchedData';
import UngdomsytelseProsess from './UngdomsytelseProsess';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';

interface OwnProps {
  fetchedData: FetchedData;
  fagsak: Fagsak;
  fagsakPerson: FagsakPerson;
  behandling: Behandling;
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

const UngdomsytelsePaneler = ({
  fetchedData,
  fagsak,
  fagsakPerson,
  behandling,
  rettigheter,
  valgtProsessSteg,
  oppdaterProsessStegOgFaktaPanelIUrl,
  valgtFaktaSteg,
  oppdaterBehandlingVersjon,
  settPaVent,
  opneSokeside,
  hasFetchError,
  setBehandling,
  arbeidsgiverOpplysningerPerId,
  featureToggles,
}: OwnProps) => {
  const { kodeverk } = useKodeverkContext();
  return (
    <>
      <BehandlingPaVent
        behandling={behandling}
        aksjonspunkter={fetchedData?.aksjonspunkter}
        kodeverk={kodeverk}
        settPaVent={settPaVent}
      />

      <UngdomsytelseProsess
        data={fetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling}
        alleKodeverk={kodeverk}
        rettigheter={rettigheter}
        valgtProsessSteg={valgtProsessSteg}
        valgtFaktaSteg={valgtFaktaSteg}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
        opneSokeside={opneSokeside}
        hasFetchError={hasFetchError}
        setBehandling={setBehandling}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={featureToggles}
      />
    </>
  );
};

export default UngdomsytelsePaneler;

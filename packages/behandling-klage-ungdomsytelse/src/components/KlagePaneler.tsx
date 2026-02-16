import { BehandlingPaVent, type Rettigheter, type SettPaVentParams } from '@k9-sak-web/behandling-felles';
import type { FeatureToggles } from '@k9-sak-web/gui/featuretoggles/FeatureToggles.js';
import type {
  ArbeidsgiverOpplysningerPerId,
  Behandling,
  Fagsak,
  FagsakPerson,
  Kodeverk,
  KodeverkMedNavn,
} from '@k9-sak-web/types';

import type { ung_sak_kontrakt_behandling_BehandlingVisningsnavn } from '@navikt/ung-sak-typescript-client/types';
import type FetchedData from '../types/fetchedDataTsType';
import KlageProsess from './KlageProsess';

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
    type: Kodeverk;
    status: Kodeverk;
    opprettet: string;
    avsluttet?: string;
    visningsnavn: ung_sak_kontrakt_behandling_BehandlingVisningsnavn;
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

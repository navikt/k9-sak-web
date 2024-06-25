import { ArbeidsgiverOpplysningerPerId, Behandling, Fagsak, FagsakPerson, FeatureToggles } from '@k9-sak-web/types';
import { Rettigheter } from '@k9-sak-web/behandling-felles';
import { AlleKodeverk } from '@k9-sak-web/lib/types/index.js';
import FetchedData from './fetchedDataTsType';

export interface ProsessProps {
  data: FetchedData;
  fagsak: Fagsak;
  fagsakPerson: FagsakPerson;
  behandling: Behandling;
  alleKodeverk: AlleKodeverk;
  rettigheter: Rettigheter;
  valgtProsessSteg?: string;
  valgtFaktaSteg?: string;
  hasFetchError: boolean;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  opneSokeside: () => void;
  apentFaktaPanelInfo?: { urlCode: string; textCode: string };
  setBehandling: (behandling: Behandling) => void;
  featureToggles: FeatureToggles;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

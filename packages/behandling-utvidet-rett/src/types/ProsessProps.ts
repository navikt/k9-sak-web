import { ArbeidsgiverOpplysningerPerId, Behandling, Fagsak, FagsakPerson, KodeverkMedNavn } from '@k9-sak-web/types';
import type { FeatureToggles } from '@k9-sak-web/gui/featuretoggles/FeatureToggles.js';
import { Rettigheter } from '@k9-sak-web/behandling-felles';
import FetchedData from './fetchedDataTsType';

export interface ProsessProps {
  data: FetchedData;
  fagsak: Fagsak;
  fagsakPerson: FagsakPerson;
  behandling: Behandling;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
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

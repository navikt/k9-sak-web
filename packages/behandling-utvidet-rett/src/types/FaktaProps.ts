import { ArbeidsgiverOpplysningerPerId, Behandling, Fagsak, FagsakPerson, FeatureToggles } from '@k9-sak-web/types';
import { Rettigheter } from '@k9-sak-web/behandling-felles';
import { AlleKodeverk } from '@k9-sak-web/lib/types/index.js';
import FetchedData from './fetchedDataTsType';

export interface FaktaProps {
  data: FetchedData;
  fagsak: Fagsak;
  fagsakPerson: FagsakPerson;
  behandling: Behandling;
  alleKodeverk: AlleKodeverk;
  rettigheter: Rettigheter;
  hasFetchError: boolean;
  oppdaterProsessStegOgFaktaPanelIUrl: (prosessPanel?: string, faktanavn?: string) => void;
  valgtFaktaSteg?: string;
  valgtProsessSteg?: string;
  setApentFaktaPanel: (faktaPanelInfo: { urlCode: string; textCode: string }) => void;
  setBehandling: (behandling: Behandling) => void;
  featureToggles?: FeatureToggles;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

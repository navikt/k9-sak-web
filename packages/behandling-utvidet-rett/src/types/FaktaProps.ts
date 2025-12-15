import { ArbeidsgiverOpplysningerPerId, Behandling, Fagsak, FagsakPerson, KodeverkMedNavn } from '@k9-sak-web/types';
import type { FeatureToggles } from '@k9-sak-web/gui/featuretoggles/FeatureToggles.js';
import { Rettigheter } from '@k9-sak-web/behandling-felles';
import FetchedData from './fetchedDataTsType';

export interface FaktaProps {
  data: FetchedData;
  fagsak: Fagsak;
  fagsakPerson: FagsakPerson;
  behandling: Behandling;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
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

import { ArbeidsgiverOpplysningerPerId, Behandling, Fagsak, FagsakPerson, FeatureToggles } from '@k9-sak-web/types';
import { AlleKodeverk } from '@k9-sak-web/lib/types/index.js';
import { Rettigheter, SettPaVentParams } from '@k9-sak-web/behandling-felles';
import FetchedData from './fetchedDataTsType';

export interface PanelerProps {
  fetchedData: FetchedData;
  fagsak: Fagsak;
  fagsakPerson: FagsakPerson;
  behandling: Behandling;
  alleKodeverk: AlleKodeverk;
  rettigheter: Rettigheter;
  valgtProsessSteg?: string;
  valgtFaktaSteg?: string;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId }: { behandlingId: number }, keepData: boolean) => Promise<any>;
  opneSokeside: () => void;
  hasFetchError: boolean;
  featureToggles: FeatureToggles;
  setBehandling: (behandling: Behandling) => void;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

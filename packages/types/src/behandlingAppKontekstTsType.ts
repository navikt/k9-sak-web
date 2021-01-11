import Kodeverk from './kodeverkTsType';
import Behandlingsresultat from './behandlingsresultatTsType';

type BehandlingAppKontekst = Readonly<{
  id: number;
  versjon: number;
  uuid?: string;
  status: Kodeverk;
  type: Kodeverk;
  fristBehandlingPaaVent?: string;
  venteArsakKode?: string;
  behandlingPaaVent: boolean;
  behandlingHenlagt: boolean;
  behandlingsresultat?: Behandlingsresultat;
  links: {
    href: string;
    rel: string;
    requestPayload?: any;
    type: string;
  }[];
  opprettet: string;
  avsluttet?: string;
  gjeldendeVedtak: boolean;
  sprakkode: Kodeverk;
  behandlendeEnhetId: string;
  behandlendeEnhetNavn: string;
  behandlingKoet: boolean;
  toTrinnsBehandling: boolean;
  behandlingArsaker: {
    behandlingArsakType: Kodeverk;
    manueltOpprettet: boolean;
    erAutomatiskRevurdering: boolean;
  }[];
  ansvarligSaksbehandler?: string;
  kanHenleggeBehandling?: boolean;
  harVerge?: boolean;
  førsteÅrsak?: {
    behandlingArsakType: Kodeverk;
    manueltOpprettet: boolean;
    erAutomatiskRevurdering?: boolean;
  };
}>;

export default BehandlingAppKontekst;

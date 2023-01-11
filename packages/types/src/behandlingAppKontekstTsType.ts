import Behandlingsresultat from './behandlingsresultatTsType';

export type BehandlingAppKontekst = Readonly<{
  id: number;
  versjon: number;
  uuid?: string;
  status: string;
  type: string;
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
  sprakkode: string;
  behandlendeEnhetId: string;
  stegTilstand?: {
    stegType: {
      kode: string;
    };
  };
  behandlendeEnhetNavn: string;
  behandlingKoet: boolean;
  toTrinnsBehandling: boolean;
  behandlingÅrsaker: BehandlingÅrsak[];
  ansvarligSaksbehandler?: string;
  kanHenleggeBehandling?: boolean;
  harVerge?: boolean;
  førsteÅrsak?: {
    behandlingArsakType: string;
    manueltOpprettet: boolean;
    erAutomatiskRevurdering?: boolean;
  };
}>;

export type BehandlingÅrsak = {
  behandlingArsakType: string;
  manueltOpprettet: boolean;
  erAutomatiskRevurdering: boolean;
};

export default BehandlingAppKontekst;

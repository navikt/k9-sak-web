import type { Implements } from '@k9-sak-web/gui/utils/typehelp/Implements.js';
import type { BehandlingInfo } from '@k9-sak-web/gui/sak/BehandlingInfo.js';
import type { Språkkode } from '@k9-sak-web/backend/k9sak/kodeverk/Språkkode.js';
import { BehandlingTypeKodeverk } from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingType.js';
import Kodeverk from './kodeverkTsType';
import Behandlingsresultat from './behandlingsresultatTsType';

export type BehandlingAppKontekst = Implements<
  BehandlingInfo,
  Readonly<{
    id: number;
    versjon: number;
    uuid: string;
    status: Kodeverk;
    type: BehandlingTypeKodeverk;
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
    sprakkode: Språkkode;
    behandlendeEnhetId: string;
    stegTilstand?: {
      stegType: {
        kode: string;
      };
    };
    behandlendeEnhetNavn: string;
    behandlingKoet: boolean;
    toTrinnsBehandling: boolean;
    behandlingÅrsaker: {
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
  }>
>;

export default BehandlingAppKontekst;

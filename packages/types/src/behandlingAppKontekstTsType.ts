import { BehandlingTypeKodeverk } from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingType.js';
import { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { Språkkode } from '@k9-sak-web/backend/k9sak/kodeverk/Språkkode.js';
import type { BehandlingInfo } from '@k9-sak-web/gui/sak/BehandlingInfo.js';
import type { Implements } from '@k9-sak-web/gui/utils/typehelp/Implements.js';
import { ung_sak_kontrakt_behandling_BehandlingVisningsnavn } from '@navikt/ung-sak-typescript-client/types';
import Behandlingsresultat from './behandlingsresultatTsType';
import Kodeverk from './kodeverkTsType';

export type BehandlingAppKontekst = Implements<
  BehandlingInfo,
  Readonly<{
    id: number;
    versjon: number;
    uuid: string;
    status: Kodeverk;
    type: BehandlingTypeKodeverk;
    fristBehandlingPåVent?: string;
    venteÅrsakKode?: string;
    behandlingPåVent: boolean;
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
    språkkode: Språkkode;
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
    sakstype: FagsakYtelsesType;
    visningsnavn: ung_sak_kontrakt_behandling_BehandlingVisningsnavn;
  }>
>;

export default BehandlingAppKontekst;

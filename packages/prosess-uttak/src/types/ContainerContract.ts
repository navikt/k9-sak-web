import { Aksjonspunkt, Behandling, KodeverkMedNavn } from '@k9-sak-web/types';
import ArbeidsgiverOpplysninger from './ArbeidsgiverOpplysninger';
import Uttaksperioder from './Uttaksperioder';
import { Inntektsgradering } from '.';
import { ReactNode } from 'react';
import { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { k9_sak_kontrakt_behandling_BehandlingDto as BehandlingDto } from '@k9-sak-web/backend/k9sak/generated';

interface ContainerContract {
  behandling: Pick<Behandling, 'uuid' | 'versjon' | 'status'>; // Pick<BehandlingDto, 'uuid' | 'versjon' | 'status'>;
  httpErrorHandler?: (status: number, locationHeader?: string) => void;
  endpoints?: {
    behandlingUttakOverstyrbareAktiviteter: string;
    behandlingUttakOverstyrt: string;
  };
  uttaksperioder: Uttaksperioder;
  inntektsgraderinger?: Inntektsgradering[];
  perioderTilVurdering?: string[];
  utsattePerioder: string[];
  aktivBehandlingUuid: string;
  arbeidsforhold: Record<string, ArbeidsgiverOpplysninger>;
  aksjonspunktkoder: string[];
  ytelsetype: FagsakYtelsesType;
  kodeverkUtenlandsoppholdÅrsak: KodeverkMedNavn[];
  hentBehandling?: (params?: any, keepData?: boolean) => Promise<Behandling | BehandlingDto>;
  løsAksjonspunktVurderDatoNyRegelUttak: ({
    begrunnelse,
    virkningsdato,
  }: {
    begrunnelse: string;
    virkningsdato: string;
  }) => void;
  virkningsdatoUttakNyeRegler: string | undefined;
  aksjonspunkter?: Aksjonspunkt[];
  versjon?: number;
  erOverstyrer?: boolean;
  status?: string | false;
  readOnly: boolean;
  vurderOverlappendeSakComponent?: ReactNode;
}

export default ContainerContract;

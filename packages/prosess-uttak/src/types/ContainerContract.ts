import { OverstyringUttakRequest } from '@k9-sak-web/behandling-pleiepenger';
import { Aksjonspunkt } from '@k9-sak-web/types';
import ArbeidsgiverOpplysninger from './ArbeidsgiverOpplysninger';
import KodeverkMedNavn from './kodeverkMedNavnTsType';
import Uttaksperioder from './Uttaksperioder';
import { Inntektsgradering } from '.';
import { ReactNode } from 'react';
import { BehandlingDto } from '@k9-sak-web/backend/k9sak/generated';

interface ContainerContract {
  behandling: Pick<BehandlingDto, 'uuid' | 'versjon' | 'status'>;
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
  erFagytelsetypeLivetsSluttfase: boolean;
  kodeverkUtenlandsoppholdÅrsak: KodeverkMedNavn[];
  handleOverstyringAksjonspunkt?: (data: OverstyringUttakRequest) => Promise<void>;
  løsAksjonspunktVurderDatoNyRegelUttak: ({
    begrunnelse,
    virkningsdato,
  }: {
    begrunnelse: string;
    virkningsdato: string;
  }) => void;
  virkningsdatoUttakNyeRegler: string;
  aksjonspunkter?: Aksjonspunkt[];
  versjon?: number;
  erOverstyrer?: boolean;
  status?: string | false;
  readOnly: boolean;
  vurderOverlappendeSakComponent?: ReactNode;
}

export default ContainerContract;

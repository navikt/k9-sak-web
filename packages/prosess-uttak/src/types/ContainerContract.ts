import { OverstyringUttakRequest } from '@k9-sak-web/behandling-pleiepenger';
import { Aksjonspunkt } from '@k9-sak-web/types';
import ArbeidsgiverOpplysninger from './ArbeidsgiverOpplysninger';
import KodeverkMedNavn from './kodeverkMedNavnTsType';
import Uttaksperioder from './Uttaksperioder';

interface ContainerContract {
  httpErrorHandler?: (status: number, locationHeader?: string) => void;
  endpoints?: {
    behandlingUttakOverstyrbareAktiviteter: string;
    behandlingUttakOverstyrt: string;
  };
  uttaksperioder: Uttaksperioder;
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
}

export default ContainerContract;

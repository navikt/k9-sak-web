import Uttaksperioder from './Uttaksperioder';
import ArbeidsgiverOpplysninger from './ArbeidsgiverOpplysninger';
import KodeverkMedNavn from './kodeverkMedNavnTsType';
import Kodeverk from './kodeverkTsType';

export type Aksjonspunkt = Readonly<{
  definisjon: Kodeverk;
  status: Kodeverk;
  begrunnelse?: string;
  vilkarType?: Kodeverk;
  toTrinnsBehandling?: boolean;
  toTrinnsBehandlingGodkjent?: boolean;
  vurderPaNyttArsaker?: Kodeverk[];
  besluttersBegrunnelse?: string;
  aksjonspunktType?: Kodeverk;
  kanLoses: boolean;
  erAktivt: boolean;
  venteårsakVariant?: string;
}>;

interface ContainerContract {
  httpErrorHandlerCaller: (status: number, locationHeader?: string) => void;
  endpoints: {
    behandlingUttakOverstyrbareAktiviteter: string;
    behandlingUttakOverstyrt: string;
  };
  uttaksperioder: Uttaksperioder;
  utsattePerioder: string[];
  aktivBehandlingUuid: string;
  arbeidsforhold: Record<string, ArbeidsgiverOpplysninger>;
  aksjonspunktkoder: string[];
  erFagytelsetypeLivetsSluttfase: boolean;
  kodeverkUtenlandsoppholdÅrsak: KodeverkMedNavn[];
  handleOverstyringAksjonspunkt: (data: any) => Promise<any>;
  løsAksjonspunktVurderDatoNyRegelUttak: ({
    begrunnelse,
    virkningsdato,
  }: {
    begrunnelse: string;
    virkningsdato: string;
  }) => void;
  virkningsdatoUttakNyeRegler: string;
  aksjonspunkter?: Aksjonspunkt[];
  versjon: number;
  featureToggles: { [key: string]: boolean };
}

export default ContainerContract;

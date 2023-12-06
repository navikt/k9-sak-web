import { ArbeidsgiverOpplysninger, KodeverkMedNavn, Uttaksperioder } from '.';

interface ContainerContract {
  httpErrorHandler: (error: any) => void;
  endpoints: {
    behandlingUttakOverstyrbareAktiviteter: string;
    behandlingUttakOverstyrt: string;
  };
  uttaksperioder: Uttaksperioder;
  utsattePerioder: string[];
  aktivBehandlingUuid: string;
  erFagytelsetypeLivetsSluttfase: boolean;
  kodeverkUtenlandsoppholdÅrsak: KodeverkMedNavn[];
  handleOverstyringAksjonspunkt: (data: any) => Promise<any>;
  versjon: string;
  featureToggles: { [key: string]: boolean };
}
export default ContainerContract;

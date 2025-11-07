import type { FeatureToggles } from '@k9-sak-web/gui/featuretoggles/FeatureToggles.js';
import type {
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  k9_sak_kontrakt_behandling_BehandlingDto as BehandlingDto,
  k9_sak_kontrakt_person_PersonopplysningDto as PersonopplysningDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { useQuery } from '@tanstack/react-query';
import TilkjentYtelsePanel from './components/TilkjentYtelsePanel';
import type { ArbeidsgiverOpplysningerPerId } from './types/arbeidsgiverOpplysningerType';
import type { BeregningsresultatMedUtbetaltePeriodeDto } from './types/BeregningsresultatMedUtbetaltePeriode';
import TilkjentYtelseBackendClient from './TilkjentYtelseBackendClient.js';

interface OwnProps {
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  behandling: BehandlingDto;
  beregningsresultat: BeregningsresultatMedUtbetaltePeriodeDto;
  aksjonspunkter: AksjonspunktDto[];
  isReadOnly: boolean;
  submitCallback: (data: any) => Promise<any>;
  readOnlySubmitButton: boolean;
  featureToggles?: FeatureToggles;
  personopplysninger: PersonopplysningDto;
  showAndelDetails?: boolean;
}

const TilkjentYtelseProsessIndex = ({
  beregningsresultat,
  aksjonspunkter,
  isReadOnly,
  submitCallback,
  readOnlySubmitButton,
  arbeidsgiverOpplysningerPerId,
  featureToggles,
  personopplysninger,
  showAndelDetails,
  behandling,
}: OwnProps) => {
  const tilkjentYtelseBackendClient = new TilkjentYtelseBackendClient();

  const { data: feriepengegrunnlag } = useQuery({
    queryKey: ['feriepengegrunnlag', behandling?.uuid],
    queryFn: async () => {
      if (!behandling?.uuid) {
        return null;
      }
      return await tilkjentYtelseBackendClient.hentFeriepengegrunnlag(behandling.uuid);
    },
    enabled: !!behandling?.uuid,
  });

  return (
    <TilkjentYtelsePanel
      beregningsresultat={beregningsresultat}
      aksjonspunkter={aksjonspunkter}
      readOnly={isReadOnly}
      submitCallback={submitCallback}
      readOnlySubmitButton={readOnlySubmitButton}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      featureToggles={featureToggles}
      personopplysninger={personopplysninger}
      showAndelDetails={showAndelDetails}
      feriepengegrunnlag={feriepengegrunnlag}
    />
  );
};

export default TilkjentYtelseProsessIndex;

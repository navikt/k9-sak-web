import type { FeatureToggles } from '@k9-sak-web/gui/featuretoggles/FeatureToggles.js';
import type {
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  k9_sak_kontrakt_behandling_BehandlingDto as BehandlingDto,
  k9_sak_kontrakt_person_PersonopplysningDto as PersonopplysningDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { useSuspenseQuery } from '@tanstack/react-query';
import TilkjentYtelsePanel from './components/TilkjentYtelsePanel';
import type { ArbeidsgiverOpplysningerPerId } from './types/arbeidsgiverOpplysningerType';
import type { BeregningsresultatMedUtbetaltePeriodeDto } from './types/BeregningsresultatMedUtbetaltePeriode';
import TilkjentYtelseBackendClient from './TilkjentYtelseBackendClient.js';
import type { FeriepengerPrÅr } from './components/feriepenger/FeriepengerPanel.tsx';

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

const emptyResult: FeriepengerPrÅr = new Map();

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

  const { data: feriepengerPrÅr } = useSuspenseQuery({
    queryKey: ['feriepengegrunnlag', behandling?.uuid],
    queryFn: async () => {
      return behandling?.uuid != null
        ? await tilkjentYtelseBackendClient.hentFeriepengegrunnlagPrÅr(behandling.uuid)
        : null;
    },
    select: data => (data != null ? data : emptyResult),
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
      feriepengerPrÅr={feriepengerPrÅr}
    />
  );
};

export default TilkjentYtelseProsessIndex;

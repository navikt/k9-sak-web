import type { FeatureToggles } from '@k9-sak-web/gui/featuretoggles/FeatureToggles.js';
import type { AksjonspunktDto, PersonopplysningDto } from '@navikt/k9-sak-typescript-client';
import TilkjentYtelsePanel from './components/TilkjentYtelsePanel';
import type { ArbeidsgiverOpplysningerPerId } from './types/arbeidsgiverOpplysningerType';
import type { BeregningsresultatMedUtbetaltePeriodeDto } from './types/BeregningsresultatMedUtbetaltePeriode';

interface OwnProps {
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
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
}: OwnProps) => (
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
  />
);

export default TilkjentYtelseProsessIndex;

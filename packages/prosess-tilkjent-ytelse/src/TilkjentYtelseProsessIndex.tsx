import {
  Aksjonspunkt,
  ArbeidsgiverOpplysningerPerId,
  BeregningsresultatUtbetalt,
  KodeverkMedNavn,
} from '@k9-sak-web/types';
import TilkjentYtelsePanel from './components/TilkjentYtelsePanel';

interface OwnProps {
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  beregningsresultat: BeregningsresultatUtbetalt;
  aksjonspunkter: Aksjonspunkt[];
  isReadOnly: boolean;
  submitCallback: (data: any) => Promise<any>;
  readOnlySubmitButton: boolean;
}

const TilkjentYtelseProsessIndex = ({
  beregningsresultat,
  aksjonspunkter,
  alleKodeverk,
  isReadOnly,
  submitCallback,
  readOnlySubmitButton,
  arbeidsgiverOpplysningerPerId,
}: OwnProps) => (
  <TilkjentYtelsePanel
    beregningsresultat={beregningsresultat}
    aksjonspunkter={aksjonspunkter}
    alleKodeverk={alleKodeverk}
    readOnly={isReadOnly}
    submitCallback={submitCallback}
    readOnlySubmitButton={readOnlySubmitButton}
    arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
  />
);

export default TilkjentYtelseProsessIndex;

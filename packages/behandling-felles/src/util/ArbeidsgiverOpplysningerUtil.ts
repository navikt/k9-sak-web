import type { ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';

class ArbeidsgiverOpplysningerUtil {
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;

  constructor(arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId) {
    this.arbeidsgiverOpplysningerPerId = arbeidsgiverOpplysningerPerId;
  }

  finnArbeidsgiversNavn(organisasjonsnummer: string) {
    return this.arbeidsgiverOpplysningerPerId[organisasjonsnummer]?.navn;
  }
}

export default ArbeidsgiverOpplysningerUtil;

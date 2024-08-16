import {
  Aksjonspunkt,
  ArbeidsgiverOpplysningerPerId,
  Behandling,
  BeregningsresultatUtbetalt,
  Fagsak,
  KodeverkMedNavn,
} from '@k9-sak-web/types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import TilkjentYtelsePanel from './components/TilkjentYtelsePanel';

interface OwnProps {
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  behandling: Behandling;
  beregningsresultat: BeregningsresultatUtbetalt;
  fagsak: Fagsak;
  aksjonspunkter: Aksjonspunkt[];
  isReadOnly: boolean;
  submitCallback: (data: any) => Promise<any>;
  readOnlySubmitButton: boolean;
}

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const TilkjentYtelseProsessIndex = ({
  behandling,
  beregningsresultat,
  fagsak,
  aksjonspunkter,
  alleKodeverk,
  isReadOnly,
  submitCallback,
  readOnlySubmitButton,
  arbeidsgiverOpplysningerPerId,
}: OwnProps) => (
  <RawIntlProvider value={intl}>
    <TilkjentYtelsePanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      beregningsresultat={beregningsresultat}
      fagsakYtelseTypeKode={fagsak.sakstype?.kode}
      aksjonspunkter={aksjonspunkter}
      alleKodeverk={alleKodeverk}
      readOnly={isReadOnly}
      submitCallback={submitCallback}
      readOnlySubmitButton={readOnlySubmitButton}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
    />
  </RawIntlProvider>
);

export default TilkjentYtelseProsessIndex;

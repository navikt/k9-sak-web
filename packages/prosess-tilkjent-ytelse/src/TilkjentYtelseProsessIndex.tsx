import React from 'react';
import {
  ArbeidsgiverOpplysningerPerId,
  Behandling,
  BeregningsresultatUtbetalt,
  Aksjonspunkt,
  KodeverkMedNavn,
  Fagsak,
} from '@k9-sak-web/types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
import TilkjentYtelsePanel from './components/TilkjentYtelsePanel';
import messages from '../i18n/nb_NO.json';

interface OwnProps {
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  behandling: Behandling;
  beregningsresultat: BeregningsresultatUtbetalt;
  fagsak: Fagsak;
  aksjonspunkter: Aksjonspunkt[];
  isReadOnly: boolean;
  submitCallback: () => void;
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
      fagsakYtelseTypeKode={fagsak.sakstype}
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

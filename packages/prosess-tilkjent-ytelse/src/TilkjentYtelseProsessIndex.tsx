import React, { FC } from 'react';
import {
  InntektArbeidYtelse,
  Behandling,
  BeregningsresultatUtbetalt,
  Aksjonspunkt,
  KodeverkMedNavn,
  FagsakInfo,
} from '@k9-sak-web/types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import TilkjentYtelsePanel from './components/TilkjentYtelsePanel';
import messages from '../i18n/nb_NO.json';

interface OwnProps {
  inntektArbeidYtelse: InntektArbeidYtelse;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  behandling: Behandling;
  beregningsresultat: BeregningsresultatUtbetalt;
  fagsak: FagsakInfo;
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

const TilkjentYtelseProsessIndex: FC<OwnProps> = ({
  behandling,
  beregningsresultat,
  fagsak,
  aksjonspunkter,
  alleKodeverk,
  isReadOnly,
  submitCallback,
  readOnlySubmitButton,
  inntektArbeidYtelse,
}) => (
  <RawIntlProvider value={intl}>
    <TilkjentYtelsePanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      beregningsresultat={beregningsresultat}
      // @ts-ignore
      fagsakYtelseTypeKode={fagsak.fagsakYtelseType.kode}
      aksjonspunkter={aksjonspunkter}
      alleKodeverk={alleKodeverk}
      readOnly={isReadOnly}
      submitCallback={submitCallback}
      readOnlySubmitButton={readOnlySubmitButton}
      inntektArbeidYtelse={inntektArbeidYtelse}
    />
  </RawIntlProvider>
);

export default TilkjentYtelseProsessIndex;

import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { ArbeidsgiverOpplysningerPerId, Fagsak } from '@k9-sak-web/types';
import {
  AksjonspunktDto,
  BehandlingDto,
  BeregningsresultatMedUtbetaltePeriodeDto,
} from '@navikt/k9-sak-typescript-client';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import TilkjentYtelsePanel from './components/TilkjentYtelsePanel';

interface OwnProps {
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  behandling: BehandlingDto;
  beregningsresultat: BeregningsresultatMedUtbetaltePeriodeDto;
  fagsak: Fagsak;
  aksjonspunkter: AksjonspunktDto[];
  isReadOnly: boolean;
  submitCallback: (data: any) => Promise<any>;
  readOnlySubmitButton: boolean;
}

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
  },
  cache,
);

const TilkjentYtelseProsessIndex = ({
  beregningsresultat,
  aksjonspunkter,
  isReadOnly,
  submitCallback,
  readOnlySubmitButton,
  arbeidsgiverOpplysningerPerId,
  fagsak,
}: OwnProps) => (
  <RawIntlProvider value={intl}>
    <TilkjentYtelsePanel
      beregningsresultat={beregningsresultat}
      aksjonspunkter={aksjonspunkter}
      readOnly={isReadOnly}
      submitCallback={submitCallback}
      readOnlySubmitButton={readOnlySubmitButton}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      isUngdomsytelseFagsak={fagsak.sakstype === fagsakYtelsesType.UNGDOMSYTELSEDOMSYTELSE}
    />
  </RawIntlProvider>
);

export default TilkjentYtelseProsessIndex;

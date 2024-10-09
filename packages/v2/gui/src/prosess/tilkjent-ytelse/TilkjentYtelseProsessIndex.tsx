import type { FeatureToggles } from '@k9-sak-web/lib/kodeverk/types/FeatureTogglesType.js';
import type { AksjonspunktDto, BehandlingDto } from '@navikt/k9-sak-typescript-client';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import TilkjentYtelsePanel from './components/TilkjentYtelsePanel';
import type { ArbeidsgiverOpplysningerPerId } from './types/arbeidsgiverOpplysningerType';
import type { BeregningsresultatMedUtbetaltePeriodeDto } from './types/BeregningsresultatMedUtbetaltePeriode';

interface OwnProps {
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  behandling: BehandlingDto;
  beregningsresultat: BeregningsresultatMedUtbetaltePeriodeDto;
  aksjonspunkter: AksjonspunktDto[];
  isReadOnly: boolean;
  submitCallback: (data: any) => Promise<any>;
  readOnlySubmitButton: boolean;
  featureToggles?: FeatureToggles;
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
  featureToggles,
}: OwnProps) => (
  <RawIntlProvider value={intl}>
    <TilkjentYtelsePanel
      beregningsresultat={beregningsresultat}
      aksjonspunkter={aksjonspunkter}
      readOnly={isReadOnly}
      submitCallback={submitCallback}
      readOnlySubmitButton={readOnlySubmitButton}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      featureToggles={featureToggles}
    />
  </RawIntlProvider>
);

export default TilkjentYtelseProsessIndex;

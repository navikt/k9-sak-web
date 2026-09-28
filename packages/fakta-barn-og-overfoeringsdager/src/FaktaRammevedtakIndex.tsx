import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { Behandling } from '@k9-sak-web/types';
import { Rammevedtak } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import messages from '../i18n/nb_NO.json';
import OverforingerFaktaForm from './components/OverforingerFaktaForm';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface FaktaRammevedtakIndexProps {
  rammevedtak: Rammevedtak[];
  behandling: Behandling;
}

const FaktaRammevedtakIndex = ({ behandling, rammevedtak }: FaktaRammevedtakIndexProps) => (
  <RawIntlProvider value={intl}>
    <OverforingerFaktaForm
      rammevedtak={rammevedtak}
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
    />
  </RawIntlProvider>
);

export default FaktaRammevedtakIndex;

// Kompileringsfeil her betyr at BRUK_V2_DELING_AV_DAGER er fjernet fra FeatureToggles.
// Slett denne fila (med tilhørende spec/css) og fjern v1-grenen i UttakFaktaPanelDef når migreringen er ferdig.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting =
  import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_V2_DELING_AV_DAGER'];

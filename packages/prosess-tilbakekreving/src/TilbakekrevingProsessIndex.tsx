import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Aksjonspunkt, Behandling, KodeverkMedNavn } from '@k9-sak-web/types';
import TilbakekrevingForm from './components/TilbakekrevingForm';
import FeilutbetalingPerioderWrapper from './types/feilutbetalingPerioderTsType';
import DetaljerteFeilutbetalingsperioder from './types/detaljerteFeilutbetalingsperioderTsType';
import VilkarsVurdertePerioderWrapper from './types/vilkarsVurdertePerioderTsType';

import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface OwnProps {
  behandling: Behandling;
  perioderForeldelse: FeilutbetalingPerioderWrapper;
  vilkarvurderingsperioder: DetaljerteFeilutbetalingsperioder;
  vilkarvurdering: VilkarsVurdertePerioderWrapper;
  navBrukerKjonn: string;
  alleMerknaderFraBeslutter: { [key: string]: { notAccepted?: boolean } };
  beregnBelop: (data: any) => Promise<any>;
  submitCallback: (aksjonspunktData: { kode: string }[]) => Promise<any>;
  isReadOnly: boolean;
  readOnlySubmitButton: boolean;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  aksjonspunkter: Aksjonspunkt[];
}

const TilbakekrevingProsessIndex = ({
  behandling,
  perioderForeldelse,
  vilkarvurderingsperioder,
  vilkarvurdering,
  submitCallback,
  isReadOnly,
  readOnlySubmitButton,
  navBrukerKjonn,
  alleMerknaderFraBeslutter,
  alleKodeverk,
  beregnBelop,
  aksjonspunkter,
}: OwnProps) => (
  <RawIntlProvider value={intl}>
    <TilbakekrevingForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      perioderForeldelse={perioderForeldelse}
      perioder={vilkarvurderingsperioder.perioder}
      rettsgebyr={vilkarvurderingsperioder.rettsgebyr}
      vilkarvurdering={vilkarvurdering}
      submitCallback={submitCallback}
      readOnly={isReadOnly}
      // @ts-ignore tror denne trengs fordi fpsak-frontend/form ikkje er fullstendig konvertert til typescript
      apCodes={Array.isArray(aksjonspunkter) && aksjonspunkter.map(a => a.definisjon)}
      readOnlySubmitButton={readOnlySubmitButton}
      navBrukerKjonn={navBrukerKjonn}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      alleKodeverk={alleKodeverk}
      beregnBelop={beregnBelop}
    />
  </RawIntlProvider>
);

export default TilbakekrevingProsessIndex;

import { Aksjonspunkt } from '@k9-sak-web/types';
import { action } from '@storybook/addon-actions';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { messages } from '../i18n';
import DirekteOvergangFaktaIndex from './DirekteOvergangFaktaIndex';

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages: { ...messages },
  },
  createIntlCache(),
);

const manglendePeriodeAP: Aksjonspunkt = {
  aksjonspunktType: 'MANU', // AKSJONSPUNKT_TYPE
  begrunnelse: null,
  besluttersBegrunnelse: null,
  definisjon: '9007', // AKSJONSPUNKT_DEF
  erAktivt: true,
  kanLoses: true,
  status: 'OPPR', // AKSJONSPUNKT_STATUS
  toTrinnsBehandling: true,
  toTrinnsBehandlingGodkjent: null,
  vilkarType: null,
  vurderPaNyttArsaker: null,
};

const manglendePeriodeAnnenPartAP: Aksjonspunkt = {
  aksjonspunktType: 'MANU', // AKSJONSPUNKT_TYPE
  begrunnelse: null,
  besluttersBegrunnelse: null,
  definisjon: '9008', // AKSJONSPUNKT_DEF
  erAktivt: true,
  kanLoses: true,
  status: 'OPPR', // AKSJONSPUNKT_STATUS
  toTrinnsBehandling: true,
  toTrinnsBehandlingGodkjent: null,
  vilkarType: null,
  vurderPaNyttArsaker: null,
};

export default {
  title: 'fakta/direkte-overgang',
  component: DirekteOvergangFaktaIndex,
};

export const visDirekteOvergangForManglendePeriode = () => (
  <RawIntlProvider value={intl}>
    <DirekteOvergangFaktaIndex
      submitCallback={action('button-click')}
      readOnly={false}
      submittable
      aksjonspunkter={[manglendePeriodeAP]}
    />
  </RawIntlProvider>
);

export const visDirekteOvergangForManglendePeriodeAnnenPart = () => (
  <RawIntlProvider value={intl}>
    <DirekteOvergangFaktaIndex
      submitCallback={action('button-click')}
      readOnly={false}
      submittable
      aksjonspunkter={[manglendePeriodeAnnenPartAP]}
    />
  </RawIntlProvider>
);

export const visDirekteOvergangForManglendePeriodSøkerOgAnnenPart = () => (
  <RawIntlProvider value={intl}>
    <DirekteOvergangFaktaIndex
      submitCallback={action('button-click')}
      readOnly={false}
      submittable
      aksjonspunkter={[manglendePeriodeAnnenPartAP, manglendePeriodeAP]}
    />
  </RawIntlProvider>
);

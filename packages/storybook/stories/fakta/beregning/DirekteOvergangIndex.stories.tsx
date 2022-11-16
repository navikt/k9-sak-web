import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '@fpsak-frontend/fakta-direkte-overgang/i18n';
import DirekteOvergangFaktaIndex from '@fpsak-frontend/fakta-direkte-overgang';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { action } from '@storybook/addon-actions';

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages: { ...messages },
  },
  createIntlCache(),
);

const manglendePeriodeAP: Aksjonspunkt = {
  aksjonspunktType: 'MANU',
  begrunnelse: null,
  besluttersBegrunnelse: null,
  definisjon: '9007',
  erAktivt: true,
  kanLoses: true,
  status: 'OPPR',
  toTrinnsBehandling: true,
  toTrinnsBehandlingGodkjent: null,
  vilkarType: null,
  vurderPaNyttArsaker: null,
};

const manglendePeriodeAnnenPartAP: Aksjonspunkt = {
  aksjonspunktType: 'MANU',
  begrunnelse: null,
  besluttersBegrunnelse: null,
  definisjon: '9008',
  erAktivt: true,
  kanLoses: true,
  status: 'OPPR',
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

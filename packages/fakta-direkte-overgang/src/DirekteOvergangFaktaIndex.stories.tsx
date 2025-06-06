import { Aksjonspunkt } from '@k9-sak-web/types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { action } from 'storybook/actions';
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
  aksjonspunktType: {
    kode: 'MANU',
    kodeverk: 'AKSJONSPUNKT_TYPE',
  },
  begrunnelse: null,
  besluttersBegrunnelse: null,
  definisjon: {
    kode: '9007',
    kodeverk: 'AKSJONSPUNKT_DEF',
  },
  erAktivt: true,
  kanLoses: true,
  status: {
    kode: 'OPPR',
    kodeverk: 'AKSJONSPUNKT_STATUS',
  },
  toTrinnsBehandling: true,
  toTrinnsBehandlingGodkjent: null,
  vilkarType: null,
  vurderPaNyttArsaker: null,
};

const manglendePeriodeAnnenPartAP: Aksjonspunkt = {
  aksjonspunktType: {
    kode: 'MANU',
    kodeverk: 'AKSJONSPUNKT_TYPE',
  },
  begrunnelse: null,
  besluttersBegrunnelse: null,
  definisjon: {
    kode: '9008',
    kodeverk: 'AKSJONSPUNKT_DEF',
  },
  erAktivt: true,
  kanLoses: true,
  status: {
    kode: 'OPPR',
    kodeverk: 'AKSJONSPUNKT_STATUS',
  },
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

import React from 'react';
import { RawIntlProvider, createIntl, createIntlCache } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import SoknadsperiodestripeIndex from './Soknadsperiodestripe';

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages: { ...messages },
  },
  createIntlCache(),
);

export default {
  title: 'sak/sak-soknadsperiodestripe',
  component: SoknadsperiodestripeIndex,
};

const data = {
  perioderMedÅrsak: {
    perioderTilVurdering: [{ fom: '2022-01-05', tom: '2022-04-05' }],
    perioderMedÅrsak: [
      { periode: { fom: '2022-01-05', tom: '2022-02-05' }, årsaker: ['REVURDERER_BERØRT_PERIODE'] },
      {
        periode: { fom: '2022-02-06', tom: '2022-04-05' },
        årsaker: ['REVURDERER_BERØRT_PERIODE', 'REVURDERER_ETABLERT_TILSYN_ENDRING_FRA_ANNEN_OMSORGSPERSON'],
      },
    ],
    dokumenterTilBehandling: [],
    årsakMedPerioder: [
      {
        årsak: 'REVURDERER_BERØRT_PERIODE',
        perioder: [
          { fom: '2022-01-04', tom: '2022-02-05' },
          { fom: '2022-02-06', tom: '2022-04-05' },
        ],
      },
      {
        årsak: 'REVURDERER_ETABLERT_TILSYN_ENDRING_FRA_ANNEN_OMSORGSPERSON',
        perioder: [{ fom: '2022-02-06', tom: '2022-04-05' }],
      },
    ],
  },
  periodeMedUtfall: [
    {
      periode: { fom: '2022-01-05', tom: '2022-04-05' },
      utfall: 'OPPFYLT', // VILKAR_UTFALL_TYPE
    },
  ],
  forrigeVedtak: [
    {
      periode: { fom: '2022-01-05', tom: '2022-02-05' },
      utfall: 'OPPFYLT', // VILKAR_UTFALL_TYPE
    },
  ],
};

export const visSoknadsperiodestripe = () => (
  <RawIntlProvider value={intl}>
    <SoknadsperiodestripeIndex behandlingPerioderMedVilkår={data} />
  </RawIntlProvider>
);

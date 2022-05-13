import React from 'react';
import SoknadsperiodestripeIndex from '@k9-sak-web/sak-soknadsperiodestripe';

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
      utfall: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
    },
  ],
  forrigeVedtak: [
    {
      periode: { fom: '2022-01-05', tom: '2022-02-05' },
      utfall: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
    },
  ],
};

export const visSoknadsperiodestripe = () => <SoknadsperiodestripeIndex behandlingPerioderMedVilkår={data} />;

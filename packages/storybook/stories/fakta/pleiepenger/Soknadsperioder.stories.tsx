import SoknadsperioderIndex from '@k9-sak-web/fakta-soknadsperioder';
import { withKnobs } from '@storybook/addon-knobs';
import React from 'react';
import withReduxProvider from '../../../decorators/withRedux';

export default {
  title: 'fakta/pleiepenger/fakta-soknadsperioder',
  component: SoknadsperioderIndex,
  decorators: [withKnobs, withReduxProvider],
};

const data = {
  perioderMedÅrsak: {
    perioderTilVurdering: [{ fom: '2021-12-28', tom: '2022-03-28' }],
    perioderMedÅrsak: [{ periode: { fom: '2021-12-28', tom: '2022-03-28' }, årsaker: ['FØRSTEGANGSVURDERING'] }],
    dokumenterTilBehandling: [
      {
        journalpostId: '22295004',
        innsendingsTidspunkt: '2022-02-22T09:51:10.637',
        type: 'SØKNAD',
        søktePerioder: [
          {
            periode: { fom: '2021-12-28', tom: '2022-03-28' },
            type: null,
            arbeidsgiver: null,
            arbeidsforholdRef: null,
          },
        ],
      },
    ],
  },
  periodeMedUtfall: [
    { periode: { fom: '2021-12-28', tom: '2022-01-28' }, utfall: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' } },
  ],
  forrigeVedtak: [],
};

export const visFaktaOmSøknadsperioder = () => <SoknadsperioderIndex behandlingPerioderårsakMedVilkår={data} />;

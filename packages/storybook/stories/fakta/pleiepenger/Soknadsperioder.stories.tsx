import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import SoknadsperioderIndex from '@k9-sak-web/fakta-soknadsperioder';
import { withKnobs } from '@storybook/addon-knobs';
import React from 'react';
import withReduxProvider from '../../../decorators/withRedux';

export default {
  title: 'fakta/pleiepenger/fakta-soknadsperioder',
  component: SoknadsperioderIndex,
  decorators: [withKnobs, withReduxProvider],
};

const alleKodeverk = {
  [kodeverkTyper.ÅRSAK_TIL_VURDERING]: [
    {
      kode: 'REVURDERER_ENDRING_FRA_ANNEN_PART',
      navn: 'Annen parts vedtak endrer uttak',
      kodeverk: 'ÅRSAK_TIL_VURDERING',
    },
    {
      kode: 'REVURDERER_ETABLERT_TILSYN_ENDRING_FRA_ANNEN_OMSORGSPERSON',
      navn: 'Endring i felles opplysninger om etablert tilsyn',
      kodeverk: 'ÅRSAK_TIL_VURDERING',
    },
    {
      kode: 'REVURDERER_SYKDOM_ENDRING_FRA_ANNEN_OMSORGSPERSON',
      navn: 'Endring i felles opplysninger om sykdom',
      kodeverk: 'ÅRSAK_TIL_VURDERING',
    },
    {
      kode: 'ENDRING_FRA_BRUKER',
      navn: 'Endring fra digital søknad/Punsj',
      kodeverk: 'ÅRSAK_TIL_VURDERING',
    },
    {
      kode: 'REVURDERER_NATTEVÅKBEREDSKAP_ENDRING_FRA_ANNEN_OMSORGSPERSON',
      navn: 'Endring i felles opplysninger om nattevåk/beredskap',
      kodeverk: 'ÅRSAK_TIL_VURDERING',
    },
    {
      kode: 'G_REGULERING',
      navn: 'G-regulering',
      kodeverk: 'ÅRSAK_TIL_VURDERING',
    },
    {
      kode: 'REVURDERER_BERØRT_PERIODE',
      navn: 'Tilstøtende periode',
      kodeverk: 'ÅRSAK_TIL_VURDERING',
    },
    {
      kode: 'FØRSTEGANGSVURDERING',
      navn: 'Ny periode',
      kodeverk: 'ÅRSAK_TIL_VURDERING',
    },
    {
      kode: 'MANUELT_REVURDERER_PERIODE',
      navn: 'Manuell revurdering',
      kodeverk: 'ÅRSAK_TIL_VURDERING',
    },
    {
      kode: 'REVURDERER_NY_INNTEKTSMELDING',
      navn: 'Ny inntektsmelding',
      kodeverk: 'ÅRSAK_TIL_VURDERING',
    },
    {
      kode: 'TRUKKET_KRAV',
      navn: 'Endret/fjernet søknadsperiode',
      kodeverk: 'ÅRSAK_TIL_VURDERING',
    },
  ],
};

const data = {
  perioderMedÅrsak: {
    perioderTilVurdering: [{ fom: '2022-01-03', tom: '2022-03-09' }],
    perioderMedÅrsak: [
      {
        periode: { fom: '2022-01-03', tom: '2022-01-03' },
        årsaker: ['REVURDERER_SYKDOM_ENDRING_FRA_ANNEN_OMSORGSPERSON'],
      },
      { periode: { fom: '2022-01-04', tom: '2022-03-09' }, årsaker: ['REVURDERER_BERØRT_PERIODE'] },
    ],
    dokumenterTilBehandling: [],
  },
  periodeMedUtfall: [
    {
      periode: { fom: '2022-01-03', tom: '2022-03-09' },
      utfall: { kode: 'IKKE_VURDERT', kodeverk: 'VILKAR_UTFALL_TYPE' },
    },
  ],
  forrigeVedtak: [
    { periode: { fom: '2022-01-03', tom: '2022-03-09' }, utfall: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' } },
  ],
};

export const visFaktaOmSøknadsperioder = () => (
  <SoknadsperioderIndex behandlingPerioderårsakMedVilkår={data} alleKodeverk={alleKodeverk} />
);

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import React from 'react';
import SoknadsperioderIndex from './SoknadsperioderIndex';

export default {
  title: 'fakta/pleiepenger/fakta-soknadsperioder',
  component: SoknadsperioderIndex,
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
    perioderTilVurdering: [{ fom: '2021-11-01', tom: '2022-05-06' }],
    perioderMedÅrsak: [
      { periode: { fom: '2021-11-01', tom: '2022-01-06' }, årsaker: ['REVURDERER_BERØRT_PERIODE'] },
      {
        periode: { fom: '2022-01-07', tom: '2022-01-14' },
        årsaker: ['ENDRING_FRA_BRUKER', 'REVURDERER_ENDRING_FRA_ANNEN_PART'],
      },
      { periode: { fom: '2022-01-15', tom: '2022-01-16' }, årsaker: ['ENDRING_FRA_BRUKER'] },
      {
        periode: { fom: '2022-01-17', tom: '2022-01-28' },
        årsaker: ['ENDRING_FRA_BRUKER', 'REVURDERER_ENDRING_FRA_ANNEN_PART'],
      },
      { periode: { fom: '2022-01-29', tom: '2022-01-30' }, årsaker: ['ENDRING_FRA_BRUKER'] },
      {
        periode: { fom: '2022-01-31', tom: '2022-01-31' },
        årsaker: ['ENDRING_FRA_BRUKER', 'REVURDERER_ENDRING_FRA_ANNEN_PART'],
      },
      { periode: { fom: '2022-02-01', tom: '2022-05-06' }, årsaker: ['FØRSTEGANGSVURDERING'] },
    ],
    årsakMedPerioder: [
      {
        årsak: 'REVURDERER_ENDRING_FRA_ANNEN_PART',
        perioder: [
          { fom: '2022-01-07', tom: '2022-01-14' },
          { fom: '2022-01-17', tom: '2022-01-28' },
          { fom: '2022-01-31', tom: '2022-01-31' },
        ],
      },
      { årsak: 'ENDRING_FRA_BRUKER', perioder: [{ fom: '2022-01-07', tom: '2022-01-31' }] },
      { årsak: 'FØRSTEGANGSVURDERING', perioder: [{ fom: '2022-02-01', tom: '2022-05-06' }] },
      { årsak: 'REVURDERER_BERØRT_PERIODE', perioder: [{ fom: '2021-11-01', tom: '2022-01-06' }] },
    ],
    dokumenterTilBehandling: [
      {
        journalpostId: '524986893',
        innsendingsTidspunkt: '2022-03-13T13:07:00',
        type: 'SØKNAD',
        søktePerioder: [
          {
            periode: { fom: '2022-01-07', tom: '2022-02-28' },
            type: null,
            arbeidsgiver: null,
            arbeidsforholdRef: null,
          },
        ],
      },
      {
        journalpostId: '524986898',
        innsendingsTidspunkt: '2022-03-15T13:15:15.667',
        type: 'SØKNAD',
        søktePerioder: [
          {
            periode: { fom: '2022-02-28', tom: '2022-05-06' },
            type: null,
            arbeidsgiver: null,
            arbeidsforholdRef: null,
          },
        ],
      },
    ],
  },
  periodeMedUtfall: [
    {
      periode: { fom: '2021-11-01', tom: '2022-05-06' },
      utfall: { kode: 'IKKE_VURDERT', kodeverk: 'VILKAR_UTFALL_TYPE' },
    },
  ],
  forrigeVedtak: [
    { periode: { fom: '2021-11-01', tom: '2022-01-31' }, utfall: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' } },
  ],
};

export const visFaktaOmSøknadsperioder = () => (
  <SoknadsperioderIndex behandlingPerioderårsakMedVilkår={data} alleKodeverk={alleKodeverk} />
);

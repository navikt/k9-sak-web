/* eslint-disable max-len */
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import relasjonsRolleType from '@fpsak-frontend/kodeverk/src/relasjonsRolleType';
import BehandlingVelgerSakIndex from '@k9-sak-web/sak-behandling-velger';
import { Fagsak, Kodeverk } from '@k9-sak-web/types';
import React, { useState } from 'react';
import withReduxAndRouterProvider from '../../decorators/withReduxAndRouter';
import alleKodeverk from '../mocks/alleKodeverk.json';

const behandlinger = [
  {
    ansvarligSaksbehandler: 'beslut',
    avsluttet: '2021-12-20T09:23:01',
    behandlendeEnhetId: '4409',
    behandlendeEnhetNavn: 'NAV Arbeid og ytelser Arendal',
    behandlingÅrsaker: [
      {
        erAutomatiskRevurdering: false,
        behandlingArsakType: { kode: 'RE-END-INNTEKTSMELD', kodeverk: 'BEHANDLING_AARSAK' },
        manueltOpprettet: false,
      },
    ],
    behandlingKoet: false,
    behandlingPaaVent: false,
    behandlingsfristTid: '2022-01-31',
    behandlingsresultat: {
      erRevurderingMedUendretUtfall: false,
      type: 'INNVILGET',
      vilkårResultat: {
        MEDLEMSKAPSVILKÅRET: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: null,
            utfall: { kode: '-', kodeverk: 'VILKAR_UTFALL_TYPE' },
          },
        ],
        MEDISINSKEVILKÅR_UNDER_18_ÅR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: null,
            utfall: { kode: '-', kodeverk: 'VILKAR_UTFALL_TYPE' },
          },
        ],
        OPPTJENINGSPERIODEVILKÅR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: null,
            utfall: { kode: '-', kodeverk: 'VILKAR_UTFALL_TYPE' },
          },
        ],
        ALDERSVILKÅR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: { kode: '-', kodeverk: 'AVSLAGSARSAK' },
            utfall: { kode: '-', kodeverk: 'VILKAR_UTFALL_TYPE' },
          },
        ],
        SØKNADSFRIST: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: { kode: '-', kodeverk: 'AVSLAGSARSAK' },
            utfall: { kode: '-', kodeverk: 'VILKAR_UTFALL_TYPE' },
          },
        ],
        BEREGNINGSGRUNNLAGVILKÅR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: null,
            utfall: { kode: '-', kodeverk: 'VILKAR_UTFALL_TYPE' },
          },
        ],
        OPPTJENINGSVILKÅRET: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: null,
            utfall: { kode: '-', kodeverk: 'VILKAR_UTFALL_TYPE' },
          },
        ],
        OMSORGEN_FOR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: null,
            utfall: { kode: '-', kodeverk: 'VILKAR_UTFALL_TYPE' },
          },
        ],
      },
      vedtaksdato: '2021-12-20',
    },
    behandlingResultatType: 'INNVILGET',
    endret: '2021-12-20T09:23:01.248',
    endretAvBrukernavn: 'vtp',
    erPaaVent: false,
    fagsakId: 999951,
    førsteÅrsak: {
      erAutomatiskRevurdering: false,
      behandlingArsakType: 'RE-END-INNTEKTSMELD',
      manueltOpprettet: false,
    },
    gjeldendeVedtak: true,
    id: 999955,
    links: [],
    opprettet: '2021-12-20T09:22:38',
    originalVedtaksDato: '2021-12-20',
    sprakkode: { kode: 'NB', kodeverk: 'SPRAAK_KODE' },
    status: { kode: 'AVSLU', kodeverk: 'BEHANDLING_STATUS' },
    toTrinnsBehandling: false,
    type: { kode: 'BT-004', kodeverk: 'BEHANDLING_TYPE' },
    uuid: 'ca887118-87b1-4afd-a886-b0503d3fc787',
    behandlingHenlagt: false,
    versjon: 102,
  },
  {
    ansvarligSaksbehandler: 'saksbeh',
    avsluttet: '2021-12-20T09:22:36',
    behandlendeEnhetId: '4409',
    behandlendeEnhetNavn: 'NAV Arbeid og ytelser Arendal',
    behandlingÅrsaker: [
      {
        erAutomatiskRevurdering: false,
        behandlingArsakType: { kode: 'RE_ANNEN_SAK', kodeverk: 'BEHANDLING_AARSAK' },
        manueltOpprettet: false,
      },
      {
        erAutomatiskRevurdering: true,
        behandlingArsakType: { kode: 'RE-END-INNTEKTSMELD', kodeverk: 'BEHANDLING_AARSAK' },
        manueltOpprettet: false,
      },
    ],
    behandlingKoet: false,
    behandlingPaaVent: false,
    behandlingsfristTid: '2022-01-31',
    behandlingsresultat: {
      erRevurderingMedUendretUtfall: false,
      type: 'INNVILGET',
      vilkårResultat: {
        MEDLEMSKAPSVILKÅRET: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: null,
            utfall: { kode: '-', kodeverk: 'VILKAR_UTFALL_TYPE' },
          },
        ],
        MEDISINSKEVILKÅR_UNDER_18_ÅR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: null,
            utfall: { kode: '-', kodeverk: 'VILKAR_UTFALL_TYPE' },
          },
        ],
        OPPTJENINGSPERIODEVILKÅR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: null,
            utfall: { kode: '-', kodeverk: 'VILKAR_UTFALL_TYPE' },
          },
        ],
        ALDERSVILKÅR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: { kode: '-', kodeverk: 'AVSLAGSARSAK' },
            utfall: { kode: '-', kodeverk: 'VILKAR_UTFALL_TYPE' },
          },
        ],
        SØKNADSFRIST: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: { kode: '-', kodeverk: 'AVSLAGSARSAK' },
            utfall: { kode: '-', kodeverk: 'VILKAR_UTFALL_TYPE' },
          },
        ],
        BEREGNINGSGRUNNLAGVILKÅR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: null,
            utfall: { kode: '-', kodeverk: 'VILKAR_UTFALL_TYPE' },
          },
        ],
        OPPTJENINGSVILKÅRET: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: null,
            utfall: { kode: '-', kodeverk: 'VILKAR_UTFALL_TYPE' },
          },
        ],
        OMSORGEN_FOR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: null,
            utfall: { kode: '-', kodeverk: 'VILKAR_UTFALL_TYPE' },
          },
        ],
      },
      vedtaksdato: '2021-12-20',
    },
    behandlingResultatType: 'INNVILGET',
    endret: '2021-12-20T09:22:36.118',
    endretAvBrukernavn: 'vtp',
    erPaaVent: false,
    fagsakId: 999951,
    førsteÅrsak: {
      erAutomatiskRevurdering: false,
      behandlingArsakType: 'RE-END-INNTEKTSMELD',
      manueltOpprettet: false,
    },
    gjeldendeVedtak: false,
    id: 999951,
    links: [],
    opprettet: '2021-12-20T09:21:41',
    originalVedtaksDato: '2021-12-20',
    sprakkode: { kode: 'NB', kodeverk: 'SPRAAK_KODE' },
    status: { kode: 'AVSLU', kodeverk: 'BEHANDLING_STATUS' },
    toTrinnsBehandling: true,
    type: { kode: 'BT-002', kodeverk: 'BEHANDLING_TYPE' },
    uuid: 'e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
    behandlingHenlagt: false,
    versjon: 118,
  },
];

const fagsak = {
  saksnummer: '35425245',
  sakstype: {
    kode: fagsakYtelseType.PLEIEPENGER,
    kodeverk: '',
  },
  relasjonsRolleType: {
    kode: relasjonsRolleType.MOR,
    kodeverk: '',
  },
  status: {
    kode: fagsakStatus.UNDER_BEHANDLING,
    kodeverk: '',
  },
  barnFodt: '2020-01-01',
  opprettet: '2020-01-01',
  endret: '2020-01-01',
  antallBarn: 1,
  kanRevurderingOpprettes: false,
  skalBehandlesAvInfotrygd: false,
  dekningsgrad: 100,
} as Fagsak;

const locationMock = {
  key: '1',
  pathname: 'test',
  search: 'test',
  state: {},
  hash: 'test',
};

const getKodeverkFn = (kodeverk: Kodeverk) => {
  const kodeverkType = kodeverkTyper[kodeverk.kodeverk];
  const kodeverkForType = alleKodeverk[kodeverkType];
  return kodeverkForType.find(k => k.kode === kodeverk.kode);
};

export default {
  title: 'sak/sak-behandling-velger',
  component: BehandlingVelgerSakIndex,
  decorators: [withReduxAndRouterProvider],
};

export const visPanelForValgAvBehandlinger = props => {
  const [visAlle, toggleVisAlle] = useState(false);
  return (
    <div style={{ width: '600px' }}>
      <BehandlingVelgerSakIndex
        getBehandlingLocation={() => locationMock}
        showAll={visAlle}
        toggleShowAll={() => toggleVisAlle(!visAlle)}
        getKodeverkFn={getKodeverkFn}
        fagsak={fagsak}
        createLocationForSkjermlenke={() => locationMock}
        {...props}
      />
    </div>
  );
};

visPanelForValgAvBehandlinger.args = {
  behandlinger,
  noExistingBehandlinger: false,
  behandlingId: 1,
};

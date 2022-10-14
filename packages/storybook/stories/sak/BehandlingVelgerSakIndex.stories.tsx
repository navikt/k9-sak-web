/* eslint-disable max-len */
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import KodeverkType from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import relasjonsRolleType from '@fpsak-frontend/kodeverk/src/relasjonsRolleType';
import BehandlingVelgerSakIndex from '@k9-sak-web/sak-behandling-velger';
import { Behandling, Fagsak } from '@k9-sak-web/types';
import { boolean, number, object, withKnobs } from '@storybook/addon-knobs';
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
        behandlingArsakType: 'RE-END-INNTEKTSMELD',
        manueltOpprettet: false,
      },
    ],
    behandlingKoet: false,
    behandlingPaaVent: false,
    behandlingsfristTid: '2022-01-31',
    behandlingsresultat: {
      erRevurderingMedUendretUtfall: false,
      type: {
        kode: 'INNVILGET', // #kodeverk
        erHenleggelse: false,
        behandlingsresultatHenlagt: false,
        behandlingsresultatOpphørt: false,
        behandlingsresultatIkkeEndret: false,
        kodeverk: 'BEHANDLING_RESULTAT_TYPE',
        behandlingHenlagt: false,
      },
      vilkårResultat: {
        MEDLEMSKAPSVILKÅRET: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: null,
            utfall: '-',
          },
        ],
        MEDISINSKEVILKÅR_UNDER_18_ÅR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: null,
            utfall: '-',
          },
        ],
        OPPTJENINGSPERIODEVILKÅR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: null,
            utfall: '-',
          },
        ],
        ALDERSVILKÅR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: '-',
            utfall: '-',
          },
        ],
        SØKNADSFRIST: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: '-',
            utfall: '-',
          },
        ],
        BEREGNINGSGRUNNLAGVILKÅR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: null,
            utfall: '-',
          },
        ],
        OPPTJENINGSVILKÅRET: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: null,
            utfall: '-',
          },
        ],
        OMSORGEN_FOR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: null,
            utfall: '-',
          },
        ],
      },
      vedtaksdato: '2021-12-20',
    },
    behandlingResultatType: {
      kode: 'INNVILGET', // #kodeverk
      erHenleggelse: false,
      behandlingsresultatHenlagt: false,
      behandlingsresultatOpphørt: false,
      behandlingsresultatIkkeEndret: false,
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      behandlingHenlagt: false,
    },
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
    sprakkode: 'NB',
    status: 'AVSLU',
    toTrinnsBehandling: false,
    type: 'BT-004',
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
        behandlingArsakType: 'RE_ANNEN_SAK',
        manueltOpprettet: false,
      },
      {
        erAutomatiskRevurdering: true,
        behandlingArsakType: 'RE-END-INNTEKTSMELD',
        manueltOpprettet: false,
      },
    ],
    behandlingKoet: false,
    behandlingPaaVent: false,
    behandlingsfristTid: '2022-01-31',
    behandlingsresultat: {
      erRevurderingMedUendretUtfall: false,
      type: {
        kode: 'INNVILGET', // #kodeverk
        erHenleggelse: false,
        behandlingsresultatHenlagt: false,
        behandlingsresultatOpphørt: false,
        behandlingsresultatIkkeEndret: false,
        kodeverk: 'BEHANDLING_RESULTAT_TYPE',
        behandlingHenlagt: false,
      },
      vilkårResultat: {
        MEDLEMSKAPSVILKÅRET: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: null,
            utfall: '-',
          },
        ],
        MEDISINSKEVILKÅR_UNDER_18_ÅR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: null,
            utfall: '-',
          },
        ],
        OPPTJENINGSPERIODEVILKÅR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: null,
            utfall: '-',
          },
        ],
        ALDERSVILKÅR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: '-',
            utfall: '-',
          },
        ],
        SØKNADSFRIST: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: '-',
            utfall: '-',
          },
        ],
        BEREGNINGSGRUNNLAGVILKÅR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: null,
            utfall: '-',
          },
        ],
        OPPTJENINGSVILKÅRET: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: null,
            utfall: '-',
          },
        ],
        OMSORGEN_FOR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: null,
            utfall: '-',
          },
        ],
      },
      vedtaksdato: '2021-12-20',
    },
    behandlingResultatType: {
      kode: 'INNVILGET', // #kodeverk
      erHenleggelse: false,
      behandlingsresultatHenlagt: false,
      behandlingsresultatOpphørt: false,
      behandlingsresultatIkkeEndret: false,
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      behandlingHenlagt: false,
    },
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
    sprakkode: 'NB',
    status: 'AVSLU',
    toTrinnsBehandling: true,
    type: 'BT-002',
    uuid: 'e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
    behandlingHenlagt: false,
    versjon: 118,
  },
];

const fagsak = {
  saksnummer: '35425245',
  sakstype: fagsakYtelseType.PLEIEPENGER,
  relasjonsRolleType: relasjonsRolleType.MOR,
  status: fagsakStatus.UNDER_BEHANDLING,
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

const getKodeverkFn = (kode: string, kodeverk: KodeverkType) => {
  const kodeverkForType = alleKodeverk[kodeverk];
  return kodeverkForType.find(k => k.kode === kode);
};

export default {
  title: 'sak/sak-behandling-velger',
  component: BehandlingVelgerSakIndex,
  decorators: [withKnobs, withReduxAndRouterProvider],
};

export const visPanelForValgAvBehandlinger = () => {
  const [visAlle, toggleVisAlle] = useState(false);
  return (
    <div style={{ width: '600px' }}>
      <BehandlingVelgerSakIndex
        behandlinger={object('behandlinger', behandlinger as Behandling[])}
        getBehandlingLocation={() => locationMock}
        noExistingBehandlinger={boolean('noExistingBehandlinger', false)}
        behandlingId={number('behandlingId', 1)}
        showAll={visAlle}
        toggleShowAll={() => toggleVisAlle(!visAlle)}
        getKodeverkFn={getKodeverkFn}
        fagsak={fagsak}
        createLocationForSkjermlenke={() => locationMock}
      />
    </div>
  );
};

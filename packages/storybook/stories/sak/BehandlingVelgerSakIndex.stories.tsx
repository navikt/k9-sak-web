/* eslint-disable max-len */
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import BehandlingVelgerSakIndex from '@k9-sak-web/sak-behandling-velger';
import { Behandling, Kodeverk } from '@k9-sak-web/types';
import { boolean, number, object, withKnobs } from '@storybook/addon-knobs';
import React, { useState } from 'react';
import withReduxAndRouterProvider from '../../decorators/withReduxAndRouter';
import alleKodeverk from '../mocks/alleKodeverk.json';

// const BEHANDLING_TYPE_KODEVERK = 'BEHANDLING_TYPE';
// const BEHANDLING_STATUS_KODEVERK = 'BEHANDLING_STATUS';

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
      type: {
        kode: 'INNVILGET',
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
    behandlingResultatType: {
      kode: 'INNVILGET',
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
      behandlingArsakType: { kode: 'RE-END-INNTEKTSMELD', kodeverk: 'BEHANDLING_AARSAK' },
      manueltOpprettet: false,
    },
    gjeldendeVedtak: true,
    id: 999955,
    links: [
      {
        href: '/k9/sak/api/behandlinger/rettigheter?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'behandling-rettigheter',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/revurdering-original?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'original-behandling',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/person/medlemskap-v2?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'soeker-medlemskap-v2',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/sykdom/aksjonspunkt?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'sykdom-aksjonspunkt',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/sykdom/vurdering/oversikt/KONTINUERLIG_TILSYN_OG_PLEIE?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'sykdom-vurdering-oversikt-ktp',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/sykdom/vurdering/oversikt/TO_OMSORGSPERSONER?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'sykdom-vurdering-oversikt-too',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/sykdom/vurdering?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'sykdom-vurdering-direkte',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/sykdom/vurdering',
        rel: 'sykdom-vurdering-opprettelse',
        requestPayload: {
          behandlingUuid: 'ca887118-87b1-4afd-a886-b0503d3fc787',
          type: null,
          tekst: null,
          resultat: null,
          perioder: [],
          tilknyttedeDokumenter: null,
          dryRun: false,
        },
        type: 'POST',
      },
      {
        href: '/k9/sak/api/behandling/sykdom/vurdering',
        rel: 'sykdom-vurdering-endring',
        requestPayload: {
          behandlingUuid: 'ca887118-87b1-4afd-a886-b0503d3fc787',
          id: null,
          versjon: null,
          tekst: null,
          resultat: null,
          perioder: [],
          tilknyttedeDokumenter: null,
          dryRun: false,
        },
        type: 'POST',
      },
      {
        href: '/k9/sak/api/behandling/sykdom/dokument/oversikt?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'sykdom-dokument-oversikt',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/sykdom/dokument/liste?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'sykdom-dokument-liste',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/sykdom/dokument/eksisterendevurderinger?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'sykdom-dokument-eksisterendevurderinger',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/sykdom/dokument/innleggelse?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'sykdom-innleggelse',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/sykdom/dokument/diagnosekoder?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'sykdom-diagnosekoder',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/pleiepenger/uttak?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'pleiepenger-sykt-barn-uttaksplan',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/pleiepenger/arbeidstid-mangler?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'psb-manglende-arbeidstid',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/omsorg-for?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'omsorgen-for',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/beregningsgrunnlag/koblinger?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'beregning-koblinger',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/ytelser?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'overlappende-ytelser',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/tilsyn?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'pleiepenger-sykt-barn-tilsyn',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/pleietrengende/dod?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'rett-ved-dod',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/pleietrengende?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'om-pleietrengende',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/vedtak/fritekstdokumenter?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'pleiepenger-fritekstdokumenter',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/saksbehandler?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'saksbehandler-info',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/uttak/fastsatt?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'uttak-fastsatt',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/uttak/oppgitt?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'uttak-oppgitt',
        requestPayload: null,
        type: 'GET',
      },
      { href: '/k9/sak/api/fagsak?saksnummer=5YC1S', rel: 'fagsak', requestPayload: null, type: 'GET' },
      {
        href: '/k9/sak/api/fagsak/relatertesaker?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'fagsak-relaterte-saker',
        requestPayload: null,
        type: 'GET',
      },
      { href: '/k9/sak/api/historikk?saksnummer=5YC1S', rel: 'historikk', requestPayload: null, type: 'GET' },
      {
        href: '/k9/sak/api/behandling/aksjonspunkt-v2?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'aksjonspunkter',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/vilkar-v3?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'vilkar-v3',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/soknad?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'soknad',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/søknadsfrist/status?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'soknadsfrist-status',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/person/personopplysninger?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'soeker-personopplysninger',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/iay/arbeidsforhold-v2?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'arbeidsforhold-v1',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/iay/arbeidsforhold-v2?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'arbeidsforhold',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/arbeidsgiver?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'arbeidsgivere',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/opptjening-v2?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'opptjening-v2',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/opptjening/inntekt?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'inntekt',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/beregningsresultat?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'beregningsresultat',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/kompletthet/beregning?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'kompletthet-beregning',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/kompletthet/beregning-v2?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'kompletthet-beregning-v2',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/beregningsresultat/utbetalt?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'beregningsresultat-utbetalt',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/beregningsgrunnlag?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'beregningsgrunnlag',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/beregningsgrunnlag/alle?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'beregningsgrunnlag-alle',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/beregningsgrunnlag/overstyrInput?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'overstyr-input-beregning',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: 'http://localhost:9000/k9/oppdrag/api/simulering/detaljert-resultat',
        rel: 'simuleringResultat',
        requestPayload: 'ca887118-87b1-4afd-a886-b0503d3fc787',
        type: 'POST',
      },
      {
        href: '/k9/sak/api/brev/vedtak?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'vedtak-varsel',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/formidling/api/brev/maler?avsenderApplikasjon=K9SAK&sakstype=PSB&eksternReferanse=ca887118-87b1-4afd-a886-b0503d3fc787&behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'brev-maler',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/formidling/api/brev/tilgjengeligevedtaksbrev?avsenderApplikasjon=K9SAK&sakstype=PSB&eksternReferanse=ca887118-87b1-4afd-a886-b0503d3fc787&behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'tilgjengelige-vedtaksbrev',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/formidling/api/brev/informasjonsbehov?avsenderApplikasjon=K9SAK&sakstype=PSB&eksternReferanse=ca887118-87b1-4afd-a886-b0503d3fc787&behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'informasjonsbehov-vedtaksbrev',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/formidling/dokumentdata/api?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'dokumentdata-hente',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/formidling/dokumentdata/api/ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'dokumentdata-lagre',
        requestPayload: null,
        type: 'POST',
      },
      {
        href: '/k9/sak/api/behandling/beregningsresultat/har-samme-resultat?behandlingUuid=ca887118-87b1-4afd-a886-b0503d3fc787',
        rel: 'har-samme-resultat',
        requestPayload: null,
        type: 'GET',
      },
    ],
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
      type: {
        kode: 'INNVILGET',
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
    behandlingResultatType: {
      kode: 'INNVILGET',
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
      behandlingArsakType: { kode: 'RE-END-INNTEKTSMELD', kodeverk: 'BEHANDLING_AARSAK' },
      manueltOpprettet: false,
    },
    gjeldendeVedtak: false,
    id: 999951,
    links: [
      {
        href: '/k9/sak/api/behandlinger/rettigheter?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'behandling-rettigheter',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/person/medlemskap-v2?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'soeker-medlemskap-v2',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/sykdom/aksjonspunkt?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'sykdom-aksjonspunkt',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/sykdom/vurdering/oversikt/KONTINUERLIG_TILSYN_OG_PLEIE?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'sykdom-vurdering-oversikt-ktp',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/sykdom/vurdering/oversikt/TO_OMSORGSPERSONER?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'sykdom-vurdering-oversikt-too',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/sykdom/vurdering?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'sykdom-vurdering-direkte',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/sykdom/vurdering',
        rel: 'sykdom-vurdering-opprettelse',
        requestPayload: {
          behandlingUuid: 'e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
          type: null,
          tekst: null,
          resultat: null,
          perioder: [],
          tilknyttedeDokumenter: null,
          dryRun: false,
        },
        type: 'POST',
      },
      {
        href: '/k9/sak/api/behandling/sykdom/vurdering',
        rel: 'sykdom-vurdering-endring',
        requestPayload: {
          behandlingUuid: 'e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
          id: null,
          versjon: null,
          tekst: null,
          resultat: null,
          perioder: [],
          tilknyttedeDokumenter: null,
          dryRun: false,
        },
        type: 'POST',
      },
      {
        href: '/k9/sak/api/behandling/sykdom/dokument/oversikt?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'sykdom-dokument-oversikt',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/sykdom/dokument/liste?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'sykdom-dokument-liste',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/sykdom/dokument/eksisterendevurderinger?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'sykdom-dokument-eksisterendevurderinger',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/sykdom/dokument/innleggelse?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'sykdom-innleggelse',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/sykdom/dokument/diagnosekoder?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'sykdom-diagnosekoder',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/pleiepenger/uttak?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'pleiepenger-sykt-barn-uttaksplan',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/pleiepenger/arbeidstid-mangler?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'psb-manglende-arbeidstid',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/omsorg-for?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'omsorgen-for',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/beregningsgrunnlag/koblinger?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'beregning-koblinger',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/ytelser?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'overlappende-ytelser',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/tilsyn?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'pleiepenger-sykt-barn-tilsyn',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/pleietrengende/dod?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'rett-ved-dod',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/pleietrengende?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'om-pleietrengende',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/vedtak/fritekstdokumenter?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'pleiepenger-fritekstdokumenter',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/saksbehandler?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'saksbehandler-info',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/uttak/fastsatt?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'uttak-fastsatt',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/uttak/oppgitt?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'uttak-oppgitt',
        requestPayload: null,
        type: 'GET',
      },
      { href: '/k9/sak/api/fagsak?saksnummer=5YC1S', rel: 'fagsak', requestPayload: null, type: 'GET' },
      {
        href: '/k9/sak/api/fagsak/relatertesaker?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'fagsak-relaterte-saker',
        requestPayload: null,
        type: 'GET',
      },
      { href: '/k9/sak/api/historikk?saksnummer=5YC1S', rel: 'historikk', requestPayload: null, type: 'GET' },
      {
        href: '/k9/sak/api/behandling/aksjonspunkt-v2?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'aksjonspunkter',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/vilkar-v3?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'vilkar-v3',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/soknad?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'soknad',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/søknadsfrist/status?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'soknadsfrist-status',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/person/personopplysninger?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'soeker-personopplysninger',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/iay/arbeidsforhold-v2?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'arbeidsforhold-v1',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/iay/arbeidsforhold-v2?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'arbeidsforhold',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/arbeidsgiver?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'arbeidsgivere',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/opptjening-v2?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'opptjening-v2',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/opptjening/inntekt?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'inntekt',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/beregningsresultat?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'beregningsresultat',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/kompletthet/beregning?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'kompletthet-beregning',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/kompletthet/beregning-v2?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'kompletthet-beregning-v2',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/beregningsresultat/utbetalt?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'beregningsresultat-utbetalt',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/beregningsgrunnlag?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'beregningsgrunnlag',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/beregningsgrunnlag/alle?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'beregningsgrunnlag-alle',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/sak/api/behandling/beregningsgrunnlag/overstyrInput?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'overstyr-input-beregning',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: 'http://localhost:9000/k9/oppdrag/api/simulering/detaljert-resultat',
        rel: 'simuleringResultat',
        requestPayload: 'e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        type: 'POST',
      },
      {
        href: '/k9/sak/api/brev/vedtak?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'vedtak-varsel',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/formidling/api/brev/maler?avsenderApplikasjon=K9SAK&sakstype=PSB&eksternReferanse=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee&behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'brev-maler',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/formidling/api/brev/tilgjengeligevedtaksbrev?avsenderApplikasjon=K9SAK&sakstype=PSB&eksternReferanse=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee&behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'tilgjengelige-vedtaksbrev',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/formidling/api/brev/informasjonsbehov?avsenderApplikasjon=K9SAK&sakstype=PSB&eksternReferanse=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee&behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'informasjonsbehov-vedtaksbrev',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/formidling/dokumentdata/api?behandlingUuid=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'dokumentdata-hente',
        requestPayload: null,
        type: 'GET',
      },
      {
        href: '/k9/formidling/dokumentdata/api/e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'dokumentdata-lagre',
        requestPayload: null,
        type: 'POST',
      },
      {
        href: '/k9/sak/api/behandling/kontrollresultat/resultat?behandlingId=e10e066e-3ccd-4f2f-ac46-9e271c0c89ee',
        rel: 'kontrollresultat',
        requestPayload: null,
        type: 'GET',
      },
    ],
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

const locationMock = {
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
      />
    </div>
  );
};

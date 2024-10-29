import { action } from '@storybook/addon-actions';
import React, { useMemo, useState } from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import avslagsarsakCodes from '@fpsak-frontend/kodeverk/src/avslagsarsakCodes';
import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { VedtakFormContext } from '@k9-sak-web/behandling-felles/src/components/ProsessStegContainer';
import alleKodeverk from '@k9-sak-web/gui/storybook/mocks/alleKodeverk.json';
import VedtakProsessIndex from './VedtakProsessIndex';

const TILBAKEKR_VIDERE_BEH_KODEVERK = 'TILBAKEKR_VIDERE_BEH';

const behandling = {
  id: 1,
  versjon: 1,
  type: behandlingType.FORSTEGANGSSOKNAD,
  status: behandlingStatus.BEHANDLING_UTREDES,
  sprakkode: 'NO',
  behandlingsresultat: {
    vedtaksbrev: {
      kode: 'FRITEKST',
    },
    type: behandlingResultatType.INNVILGET,
  },
  behandlingPaaVent: false,
  behandlingHenlagt: false,
  behandlingArsaker: [
    {
      behandlingArsakType: klageBehandlingArsakType.ETTER_KLAGE,
    },
  ],
};

const vilkar = [
  {
    lovReferanse: '§§Dette er en lovreferanse',
    vilkarType: vilkarType.OMSORGENFORVILKARET,
    vilkarStatus: vilkarUtfallType.OPPFYLT,
  },
];

const resultatstruktur = {
  antallBarn: 1,
  beregnetTilkjentYtelse: 10000,
};
const resultatstrukturOriginalBehandling = {};

export default {
  title: 'prosess/prosess-vedtak',
  component: VedtakProsessIndex,
};

export const visÅpentAksjonspunktOgInnvilgetForForeldrepenger = args => {
  const [vedtakFormState, setVedtakFormState] = useState(null);
  const value = useMemo(() => ({ vedtakFormState, setVedtakFormState }), [vedtakFormState, setVedtakFormState]);

  return (
    <VedtakFormContext.Provider value={value}>
      <VedtakProsessIndex
        behandling={behandling}
        vilkar={vilkar}
        beregningresultatForeldrepenger={resultatstruktur}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[]}
        ytelseType={fagsakYtelseType.FORELDREPENGER}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
        alleKodeverk={alleKodeverk}
        {...args}
      />
    </VedtakFormContext.Provider>
  );
};

visÅpentAksjonspunktOgInnvilgetForForeldrepenger.args = {
  sendVarselOmRevurdering: false,
  employeeHasAccess: false,
  isReadOnly: false,
};

export const visDelvisInnvilgetForOmsorgspenger = args => {
  const [vedtakFormState, setVedtakFormState] = useState(null);
  const value = useMemo(() => ({ vedtakFormState, setVedtakFormState }), [vedtakFormState, setVedtakFormState]);

  return (
    <VedtakFormContext.Provider value={value}>
      <VedtakProsessIndex
        behandling={{
          ...behandling,
          behandlingsresultat: {
            vedtaksbrev: {
              kode: 'FRITEKST',
            },
            type: behandlingResultatType.DELVIS_INNVILGET,
          },
        }}
        vilkar={vilkar}
        beregningresultatForeldrepenger={resultatstruktur}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[]}
        ytelseTypeKode={fagsakYtelseType.OMSORGSPENGER}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
        alleKodeverk={alleKodeverk}
        {...args}
      />
    </VedtakFormContext.Provider>
  );
};

visDelvisInnvilgetForOmsorgspenger.args = {
  sendVarselOmRevurdering: false,
  employeeHasAccess: false,
  isReadOnly: false,
};

export const visAvslagForForeldrepenger = args => {
  const [vedtakFormState, setVedtakFormState] = useState(null);
  const value = useMemo(() => ({ vedtakFormState, setVedtakFormState }), [vedtakFormState, setVedtakFormState]);

  return (
    <VedtakFormContext.Provider value={value}>
      <VedtakProsessIndex
        behandling={{
          ...behandling,
          behandlingsresultat: {
            vedtaksbrev: {
              kode: 'FRITEKST',
            },
            type: behandlingResultatType.AVSLATT,
            avslagsarsak: avslagsarsakCodes.INGEN_BEREGNINGSREGLER,
          },
        }}
        vilkar={[
          {
            ...vilkar[0],
            vilkarStatus: vilkarUtfallType.IKKE_OPPFYLT,
          },
        ]}
        beregningresultatForeldrepenger={resultatstruktur}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[]}
        ytelseType={fagsakYtelseType.FORELDREPENGER}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
        alleKodeverk={alleKodeverk}
        {...args}
      />
    </VedtakFormContext.Provider>
  );
};

visAvslagForForeldrepenger.args = {
  sendVarselOmRevurdering: false,
  employeeHasAccess: false,
  isReadOnly: false,
};

export const visÅpentAksjonspunktForSvangerskapspenger = args => {
  const [vedtakFormState, setVedtakFormState] = useState(null);
  const value = useMemo(() => ({ vedtakFormState, setVedtakFormState }), [vedtakFormState, setVedtakFormState]);

  return (
    <VedtakFormContext.Provider value={value}>
      <VedtakProsessIndex
        behandling={behandling}
        vilkar={vilkar}
        beregningresultatForeldrepenger={resultatstruktur}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[
          {
            definisjon: aksjonspunktCodes.FORESLA_VEDTAK,
            status: aksjonspunktStatus.OPPRETTET,
            begrunnelse: undefined,
            kanLoses: true,
            erAktivt: true,
          },
        ]}
        ytelseType={fagsakYtelseType.SVANGERSKAPSPENGER}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
        alleKodeverk={alleKodeverk}
        {...args}
      />
    </VedtakFormContext.Provider>
  );
};

visÅpentAksjonspunktForSvangerskapspenger.args = {
  sendVarselOmRevurdering: false,
  employeeHasAccess: false,
  isReadOnly: false,
};

export const visModalForObligatoriskFritekstbrevForSvangerskapspenger = args => {
  const [vedtakFormState, setVedtakFormState] = useState(null);
  const value = useMemo(() => ({ vedtakFormState, setVedtakFormState }), [vedtakFormState, setVedtakFormState]);

  return (
    <VedtakFormContext.Provider value={value}>
      <VedtakProsessIndex
        behandling={{
          ...behandling,
          behandlingsresultat: {
            vedtaksbrev: {
              kode: 'FRITEKST',
            },
            type: behandlingResultatType.AVSLATT,
            avslagsarsak: avslagsarsakCodes.INGEN_BEREGNINGSREGLER,
          },
        }}
        vilkar={[
          {
            ...vilkar[0],
            vilkarStatus: vilkarUtfallType.IKKE_OPPFYLT,
          },
        ]}
        beregningresultatForeldrepenger={resultatstruktur}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[
          {
            definisjon: aksjonspunktCodes.FORESLA_VEDTAK,
            status: aksjonspunktStatus.OPPRETTET,
            begrunnelse: undefined,
            kanLoses: true,
            erAktivt: true,
          },
        ]}
        ytelseType={fagsakYtelseType.SVANGERSKAPSPENGER}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
        alleKodeverk={alleKodeverk}
        {...args}
      />
    </VedtakFormContext.Provider>
  );
};

visModalForObligatoriskFritekstbrevForSvangerskapspenger.args = {
  sendVarselOmRevurdering: false,
  employeeHasAccess: false,
  isReadOnly: false,
};

export const visÅpentAksjonspunktForEngangsstønad = args => {
  const [vedtakFormState, setVedtakFormState] = useState(null);
  const value = useMemo(() => ({ vedtakFormState, setVedtakFormState }), [vedtakFormState, setVedtakFormState]);

  return (
    <VedtakFormContext.Provider value={value}>
      <VedtakProsessIndex
        behandling={behandling}
        vilkar={vilkar}
        beregningresultatEngangsstonad={resultatstruktur}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[
          {
            definisjon: aksjonspunktCodes.FORESLA_VEDTAK,
            status: aksjonspunktStatus.OPPRETTET,
            begrunnelse: undefined,
            kanLoses: true,
            erAktivt: true,
          },
        ]}
        ytelseType={fagsakYtelseType.ENGANGSSTONAD}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
        alleKodeverk={alleKodeverk}
        {...args}
      />
    </VedtakFormContext.Provider>
  );
};

visÅpentAksjonspunktForEngangsstønad.args = {
  sendVarselOmRevurdering: false,
  employeeHasAccess: false,
  isReadOnly: false,
};

export const visAtBehandlingErHenlagt = args => {
  const [vedtakFormState, setVedtakFormState] = useState(null);
  const value = useMemo(() => ({ vedtakFormState, setVedtakFormState }), [vedtakFormState, setVedtakFormState]);

  return (
    <VedtakFormContext.Provider value={value}>
      <VedtakProsessIndex
        behandling={{
          ...behandling,
          behandlingHenlagt: true,
        }}
        vilkar={vilkar}
        beregningresultatForeldrepenger={resultatstruktur}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[
          {
            definisjon: aksjonspunktCodes.FORESLA_VEDTAK,
            status: aksjonspunktStatus.OPPRETTET,
            begrunnelse: undefined,
            kanLoses: true,
            erAktivt: true,
          },
        ]}
        ytelseType={fagsakYtelseType.FORELDREPENGER}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
        alleKodeverk={alleKodeverk}
        {...args}
      />
    </VedtakFormContext.Provider>
  );
};

visAtBehandlingErHenlagt.args = {
  sendVarselOmRevurdering: false,
  employeeHasAccess: false,
  isReadOnly: false,
};

export const visInnvilgetForForeldrepengerRevurdering = args => {
  const [vedtakFormState, setVedtakFormState] = useState(null);
  const value = useMemo(() => ({ vedtakFormState, setVedtakFormState }), [vedtakFormState, setVedtakFormState]);

  return (
    <VedtakFormContext.Provider value={value}>
      <VedtakProsessIndex
        behandling={{
          ...behandling,
          type: behandlingType.REVURDERING,
          behandlingsresultat: {
            vedtaksbrev: {
              kode: 'FRITEKST',
            },
            type: behandlingResultatType.INNVILGET,
          },
        }}
        vilkar={vilkar}
        beregningresultatForeldrepenger={resultatstruktur}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[
          {
            definisjon: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
            status: aksjonspunktStatus.OPPRETTET,
            begrunnelse: undefined,
            kanLoses: true,
            erAktivt: true,
          },
        ]}
        tilbakekrevingvalg={{
          videreBehandling: tilbakekrevingVidereBehandling.TILBAKEKR_OPPDATER,
        }}
        ytelseType={{ kode: fagsakYtelseType.FORELDREPENGER }}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
        alleKodeverk={alleKodeverk}
        {...args}
      />
    </VedtakFormContext.Provider>
  );
};

visInnvilgetForForeldrepengerRevurdering.args = {
  sendVarselOmRevurdering: false,
  employeeHasAccess: false,
  isReadOnly: false,
};

export const visOpphørtForForeldrepengerRevurdering = args => {
  const [vedtakFormState, setVedtakFormState] = useState(null);
  const value = useMemo(() => ({ vedtakFormState, setVedtakFormState }), [vedtakFormState, setVedtakFormState]);

  return (
    <VedtakFormContext.Provider value={value}>
      <VedtakProsessIndex
        behandling={{
          ...behandling,
          type: behandlingType.REVURDERING,
          behandlingsresultat: {
            vedtaksbrev: {
              kode: 'FRITEKST',
            },
            type: behandlingResultatType.OPPHOR,
          },
        }}
        vilkar={vilkar}
        beregningresultatForeldrepenger={resultatstruktur}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[]}
        ytelseType={fagsakYtelseType.FORELDREPENGER}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
        alleKodeverk={alleKodeverk}
        {...args}
      />
    </VedtakFormContext.Provider>
  );
};

visOpphørtForForeldrepengerRevurdering.args = {
  sendVarselOmRevurdering: false,
  employeeHasAccess: false,
  isReadOnly: false,
};

export const visInnvilgetForEngangsstønadRevurdering = args => {
  const [vedtakFormState, setVedtakFormState] = useState(null);
  const value = useMemo(() => ({ vedtakFormState, setVedtakFormState }), [vedtakFormState, setVedtakFormState]);

  return (
    <VedtakFormContext.Provider value={value}>
      <VedtakProsessIndex
        behandling={{
          ...behandling,
          type: behandlingType.REVURDERING,
        }}
        vilkar={vilkar}
        beregningresultatEngangsstonad={resultatstruktur}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[]}
        ytelseType={fagsakYtelseType.ENGANGSSTONAD}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
        alleKodeverk={alleKodeverk}
        {...args}
      />
    </VedtakFormContext.Provider>
  );
};

visInnvilgetForEngangsstønadRevurdering.args = {
  sendVarselOmRevurdering: false,
  employeeHasAccess: false,
  isReadOnly: false,
};

export const visAvslåttForEngangsstønadRevurdering = args => {
  const [vedtakFormState, setVedtakFormState] = useState(null);
  const value = useMemo(() => ({ vedtakFormState, setVedtakFormState }), [vedtakFormState, setVedtakFormState]);

  return (
    <VedtakFormContext.Provider value={value}>
      <VedtakProsessIndex
        behandling={{
          ...behandling,
          type: behandlingType.REVURDERING,
          behandlingsresultat: {
            vedtaksbrev: {
              kode: 'FRITEKST',
            },
            type: behandlingResultatType.AVSLATT,
            avslagsarsak: avslagsarsakCodes.INGEN_BEREGNINGSREGLER,
          },
        }}
        vilkar={[
          {
            ...vilkar[0],
            vilkarStatus: vilkarUtfallType.IKKE_OPPFYLT,
          },
        ]}
        beregningresultatEngangsstonad={resultatstruktur}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[]}
        ytelseType={fagsakYtelseType.ENGANGSSTONAD}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
        alleKodeverk={alleKodeverk}
        {...args}
      />
    </VedtakFormContext.Provider>
  );
};

visAvslåttForEngangsstønadRevurdering.args = {
  sendVarselOmRevurdering: false,
  employeeHasAccess: false,
  isReadOnly: false,
};

export const visOverlappendeYtelser = args => {
  const [vedtakFormState, setVedtakFormState] = useState(null);
  const value = useMemo(() => ({ vedtakFormState, setVedtakFormState }), [vedtakFormState, setVedtakFormState]);

  const aksjonspunkt5040 = {
    aksjonspunktType: 'MANU',
    begrunnelse: null,
    besluttersBegrunnelse: null,
    definisjon: '5040',
    erAktivt: true,
    fristTid: null,
    kanLoses: true,
    status: 'OPPR',
    toTrinnsBehandling: false,
    toTrinnsBehandlingGodkjent: null,
    vilkarType: null,
    vurderPaNyttArsaker: null,
    venteårsak: '-',
  };

  const overlappendeYtelser = [
    {
      ytelseType: 'PSB', // FAGSAK_YTELSE
      kilde: 'INFOTRYGD', // FAGSYSTEM
      saksnummer: null,
      overlappendePerioder: [
        {
          fom: '2022-02-07',
          tom: '2022-02-10',
        },
      ],
    },
    {
      ytelseType: 'PSB', // FAGSAK_YTELSE
      kilde: 'INFOTRYGD', // FAGSYSTEM
      saksnummer: null,
      overlappendePerioder: [
        {
          fom: '2022-01-03',
          tom: '2022-01-07',
        },
        {
          fom: '2022-01-10',
          tom: '2022-01-12',
        },
      ],
    },
    {
      ytelseType: 'PSB', // FAGSAK_YTELSE
      kilde: 'INFOTRYGD', // FAGSYSTEM
      saksnummer: null,
      overlappendePerioder: [
        {
          fom: '2022-01-24',
          tom: '2022-01-28',
        },
        {
          fom: '2022-01-31',
          tom: '2022-01-31',
        },
      ],
    },
    {
      ytelseType: 'PSB', // FAGSAK_YTELSE
      kilde: 'INFOTRYGD', // FAGSYSTEM
      saksnummer: null,
      overlappendePerioder: [
        {
          fom: '2022-02-21',
          tom: '2022-02-25',
        },
        {
          fom: '2022-02-28',
          tom: '2022-02-28',
        },
      ],
    },
  ];

  return (
    <VedtakFormContext.Provider value={value}>
      <VedtakProsessIndex
        behandling={{
          ...behandling,
          type: behandlingType.FORSTEGANGSSOKNAD,
          behandlingsresultat: {
            vedtaksbrev: {
              kode: 'FRITEKST',
            },
            type: behandlingResultatType.INNVILGET,
            avslagsarsak: avslagsarsakCodes.INGEN_BEREGNINGSREGLER,
          },
        }}
        vilkar={[
          {
            ...vilkar[0],
            vilkarStatus: vilkarUtfallType.IKKE_OPPFYLT,
          },
        ]}
        beregningresultatEngangsstonad={resultatstruktur}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[aksjonspunkt5040]}
        ytelseType={fagsakYtelseType.ENGANGSSTONAD}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
        alleKodeverk={alleKodeverk}
        overlappendeYtelser={overlappendeYtelser}
        {...args}
      />
    </VedtakFormContext.Provider>
  );
};

visOverlappendeYtelser.args = {
  sendVarselOmRevurdering: false,
  employeeHasAccess: false,
  isReadOnly: false,
};

export const brevMedFritekstfelt = args => {
  const [vedtakFormState, setVedtakFormState] = useState(null);
  const value = useMemo(() => ({ vedtakFormState, setVedtakFormState }), [vedtakFormState, setVedtakFormState]);

  return (
    <VedtakFormContext.Provider value={value}>
      <VedtakProsessIndex
        behandling={behandling}
        vilkar={[]}
        beregningresultatEngangsstonad={resultatstruktur}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[]}
        ytelseType={fagsakYtelseType.PLEIEPENGER}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
        alleKodeverk={alleKodeverk}
        informasjonsbehovVedtaksbrev={{
          informasjonsbehov: [
            {
              kode: 'TOM_BEKREFTELSE',
              beskrivelse: 'Tomt informasjonsbehov som kun krever en bekreftekse av saksbehandler',
              type: 'UKJENT',
            },
            {
              kode: 'FRITEKSTVEDTAKSBREV',
              beskrivelse: 'Fritekstvedtaksbrev',
              type: 'FRITEKSTBREV',
            },
            {
              kode: 'REVURDERING_ENDRING',
              beskrivelse:
                'Fritekstbeskrivelse av endringsvedtaket. Hvor opplysningene kommer fra, hva slags nye opplysninger og hvilke perioder de gjelder',
              type: 'FRITEKST',
            },
          ],
          mangler: ['REVURDERING_ENDRING'],
        }}
        fritekstdokumenter={[]}
        tilgjengeligeVedtaksbrev={{
          alternativeMottakere: [],
          vedtaksbrevmaler: {
            FRITEKST: 'FRITKS',
            AUTOMATISK: 'ENDRING',
            INGEN: null,
          },
        }}
        {...args}
      />
    </VedtakFormContext.Provider>
  );
};

brevMedFritekstfelt.args = {
  sendVarselOmRevurdering: false,
  employeeHasAccess: true,
  isReadOnly: false,
};

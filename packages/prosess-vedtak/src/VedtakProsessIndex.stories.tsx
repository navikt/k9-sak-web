import { action } from '@storybook/addon-actions';
import { useMemo, useState } from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import avslagsarsakCodes from '@fpsak-frontend/kodeverk/src/avslagsarsakCodes';
import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { VedtakFormContext } from '@k9-sak-web/behandling-felles/src/components/ProsessStegContainer';
import VedtakProsessIndex from './VedtakProsessIndex';

const TILBAKEKR_VIDERE_BEH_KODEVERK = 'TILBAKEKR_VIDERE_BEH';

const behandling = {
  id: 1,
  versjon: 1,
  type: {
    kode: behandlingType.FORSTEGANGSSOKNAD,
  },
  status: {
    kode: behandlingStatus.BEHANDLING_UTREDES,
  },
  sprakkode: {
    kode: 'NO',
  },
  behandlingsresultat: {
    vedtaksbrev: {
      kode: 'FRITEKST',
    },
    type: {
      kode: behandlingResultatType.INNVILGET,
    },
  },
  behandlingPaaVent: false,
  behandlingHenlagt: false,
  behandlingArsaker: [
    {
      behandlingArsakType: {
        kode: klageBehandlingArsakType.ETTER_KLAGE,
      },
    },
  ],
};

const vilkar = [
  {
    lovReferanse: '§§Dette er en lovreferanse',
    vilkarType: {
      kode: vilkarType.OMSORGENFORVILKARET,
      kodeverk: kodeverkTyper.VILKAR_TYPE,
    },
    vilkarStatus: {
      kode: vilkarUtfallType.OPPFYLT,
    },
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
        ytelseType={fagsakYtelsesType.FORELDREPENGER}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
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
            type: {
              kode: behandlingResultatType.DELVIS_INNVILGET,
            },
          },
        }}
        vilkar={vilkar}
        beregningresultatForeldrepenger={resultatstruktur}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[]}
        ytelseTypeKode={fagsakYtelsesType.OMSORGSPENGER}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
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
            type: {
              kode: behandlingResultatType.AVSLATT,
            },
            avslagsarsak: {
              kode: avslagsarsakCodes.INGEN_BEREGNINGSREGLER,
              kodeverk: kodeverkTyper.AVSLAGSARSAK,
            },
          },
        }}
        vilkar={[
          {
            ...vilkar[0],
            vilkarStatus: {
              kode: vilkarUtfallType.IKKE_OPPFYLT,
            },
          },
        ]}
        beregningresultatForeldrepenger={resultatstruktur}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[]}
        ytelseType={fagsakYtelsesType.FORELDREPENGER}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
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
            definisjon: {
              kode: aksjonspunktCodes.FORESLA_VEDTAK,
            },
            status: {
              kode: aksjonspunktStatus.OPPRETTET,
            },
            begrunnelse: undefined,
            kanLoses: true,
            erAktivt: true,
          },
        ]}
        ytelseType={fagsakYtelsesType.SVANGERSKAPSPENGER}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
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
            type: {
              kode: behandlingResultatType.AVSLATT,
            },
            avslagsarsak: {
              kode: avslagsarsakCodes.INGEN_BEREGNINGSREGLER,
              kodeverk: kodeverkTyper.AVSLAGSARSAK,
            },
          },
        }}
        vilkar={[
          {
            ...vilkar[0],
            vilkarStatus: {
              kode: vilkarUtfallType.IKKE_OPPFYLT,
            },
          },
        ]}
        beregningresultatForeldrepenger={resultatstruktur}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[
          {
            definisjon: {
              kode: aksjonspunktCodes.FORESLA_VEDTAK,
            },
            status: {
              kode: aksjonspunktStatus.OPPRETTET,
            },
            begrunnelse: undefined,
            kanLoses: true,
            erAktivt: true,
          },
        ]}
        ytelseType={fagsakYtelsesType.SVANGERSKAPSPENGER}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
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
            definisjon: {
              kode: aksjonspunktCodes.FORESLA_VEDTAK,
            },
            status: {
              kode: aksjonspunktStatus.OPPRETTET,
            },
            begrunnelse: undefined,
            kanLoses: true,
            erAktivt: true,
          },
        ]}
        ytelseType={fagsakYtelsesType.ENGANGSTØNAD}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
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
            definisjon: {
              kode: aksjonspunktCodes.FORESLA_VEDTAK,
            },
            status: {
              kode: aksjonspunktStatus.OPPRETTET,
            },
            begrunnelse: undefined,
            kanLoses: true,
            erAktivt: true,
          },
        ]}
        ytelseType={fagsakYtelsesType.FORELDREPENGER}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
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
          type: {
            kode: behandlingType.REVURDERING,
          },
          behandlingsresultat: {
            vedtaksbrev: {
              kode: 'FRITEKST',
            },
            type: {
              kode: behandlingResultatType.INNVILGET,
            },
          },
        }}
        vilkar={vilkar}
        beregningresultatForeldrepenger={resultatstruktur}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[
          {
            definisjon: {
              kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
            },
            status: {
              kode: aksjonspunktStatus.OPPRETTET,
            },
            begrunnelse: undefined,
            kanLoses: true,
            erAktivt: true,
          },
        ]}
        tilbakekrevingvalg={{
          videreBehandling: {
            kode: tilbakekrevingVidereBehandling.TILBAKEKR_OPPDATER,
            kodeverk: TILBAKEKR_VIDERE_BEH_KODEVERK,
          },
        }}
        ytelseType={fagsakYtelsesType.FORELDREPENGER}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
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
          type: {
            kode: behandlingType.REVURDERING,
          },
          behandlingsresultat: {
            vedtaksbrev: {
              kode: 'FRITEKST',
            },
            type: {
              kode: behandlingResultatType.OPPHOR,
            },
          },
        }}
        vilkar={vilkar}
        beregningresultatForeldrepenger={resultatstruktur}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[]}
        ytelseType={fagsakYtelsesType.FORELDREPENGER}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
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
          type: {
            kode: behandlingType.REVURDERING,
          },
        }}
        vilkar={vilkar}
        beregningresultatEngangsstonad={resultatstruktur}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[]}
        ytelseType={fagsakYtelsesType.ENGANGSTØNAD}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
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
          type: {
            kode: behandlingType.REVURDERING,
          },
          behandlingsresultat: {
            vedtaksbrev: {
              kode: 'FRITEKST',
            },
            type: {
              kode: behandlingResultatType.AVSLATT,
            },
            avslagsarsak: {
              kode: avslagsarsakCodes.INGEN_BEREGNINGSREGLER,
              kodeverk: kodeverkTyper.AVSLAGSARSAK,
            },
          },
        }}
        vilkar={[
          {
            ...vilkar[0],
            vilkarStatus: {
              kode: vilkarUtfallType.IKKE_OPPFYLT,
            },
          },
        ]}
        beregningresultatEngangsstonad={resultatstruktur}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[]}
        ytelseType={fagsakYtelsesType.ENGANGSTØNAD}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
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
    aksjonspunktType: { kode: 'MANU', kodeverk: 'AKSJONSPUNKT_TYPE' },
    begrunnelse: null,
    besluttersBegrunnelse: null,
    definisjon: {
      kode: '5040',
      kodeverk: 'AKSJONSPUNKT_DEF',
    },
    erAktivt: true,
    fristTid: null,
    kanLoses: true,
    status: { kode: 'OPPR', kodeverk: 'AKSJONSPUNKT_STATUS' },
    toTrinnsBehandling: false,
    toTrinnsBehandlingGodkjent: null,
    vilkarType: null,
    vurderPaNyttArsaker: null,
    venteårsak: { kode: '-', kodeverk: 'VENT_AARSAK' },
  };

  const overlappendeYtelser = [
    {
      ytelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN, // FAGSAK_YTELSE
      kilde: {
        kode: 'INFOTRYGD',
        kodeverk: 'FAGSYSTEM',
      },
      saksnummer: null,
      overlappendePerioder: [
        {
          fom: '2022-02-07',
          tom: '2022-02-10',
        },
      ],
    },
    {
      ytelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN, // FAGSAK_YTELSE
      kilde: {
        kode: 'INFOTRYGD',
        kodeverk: 'FAGSYSTEM',
      },
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
      ytelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN, // FAGSAK_YTELSE
      kilde: {
        kode: 'INFOTRYGD',
        kodeverk: 'FAGSYSTEM',
      },
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
      ytelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN, // FAGSAK_YTELSE
      kilde: {
        kode: 'INFOTRYGD',
        kodeverk: 'FAGSYSTEM',
      },
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
          type: {
            kode: behandlingType.FORSTEGANGSSOKNAD,
          },
          behandlingsresultat: {
            vedtaksbrev: {
              kode: 'FRITEKST',
            },
            type: {
              kode: behandlingResultatType.INNVILGET,
            },
            avslagsarsak: {
              kode: avslagsarsakCodes.INGEN_BEREGNINGSREGLER,
              kodeverk: kodeverkTyper.AVSLAGSARSAK,
            },
          },
        }}
        vilkar={[
          {
            ...vilkar[0],
            vilkarStatus: {
              kode: vilkarUtfallType.IKKE_OPPFYLT,
            },
          },
        ]}
        beregningresultatEngangsstonad={resultatstruktur}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[aksjonspunkt5040]}
        ytelseType={fagsakYtelsesType.ENGANGSTØNAD}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
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
        ytelseType={fagsakYtelsesType.PLEIEPENGER_SYKT_BARN}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
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

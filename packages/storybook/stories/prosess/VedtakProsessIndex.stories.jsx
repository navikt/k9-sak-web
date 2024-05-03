import { action } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import React, { useMemo, useState } from 'react';

import { VedtakFormContext } from '@k9-sak-web/behandling-felles/src/components/ProsessStegContainer';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@k9-sak-web/kodeverk/src/aksjonspunktStatus';
import avslagsarsakCodes from '@k9-sak-web/kodeverk/src/avslagsarsakCodes';
import klageBehandlingArsakType from '@k9-sak-web/kodeverk/src/behandlingArsakType';
import behandlingResultatType from '@k9-sak-web/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@k9-sak-web/kodeverk/src/behandlingStatus';
import behandlingType from '@k9-sak-web/kodeverk/src/behandlingType';
import fagsakYtelseType from '@k9-sak-web/kodeverk/src/fagsakYtelseType';
import kodeverkTyper from '@k9-sak-web/kodeverk/src/kodeverkTyper';
import tilbakekrevingVidereBehandling from '@k9-sak-web/kodeverk/src/tilbakekrevingVidereBehandling';
import vilkarType from '@k9-sak-web/kodeverk/src/vilkarType';
import vilkarUtfallType from '@k9-sak-web/kodeverk/src/vilkarUtfallType';
import VedtakProsessIndex from '@k9-sak-web/prosess-vedtak';

import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

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
      kode: vilkarType.FODSELSVILKARET_MOR,
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
  decorators: [withKnobs, withReduxProvider],
};

export const visÅpentAksjonspunktOgInnvilgetForForeldrepenger = () => (
  <VedtakProsessIndex
    behandling={behandling}
    vilkar={vilkar}
    beregningresultatForeldrepenger={resultatstruktur}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
    resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    ytelseType={{ kode: fagsakYtelseType.FORELDREPENGER }}
    employeeHasAccess={boolean('employeeHasAccess', false)}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
  />
);

export const visDelvisInnvilgetForOmsorgspenger = () => (
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
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
    resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    ytelseTypeKode={fagsakYtelseType.OMSORGSPENGER}
    employeeHasAccess={boolean('employeeHasAccess', false)}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
  />
);

export const visAvslagForForeldrepenger = () => (
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
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
    resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    ytelseType={{ kode: fagsakYtelseType.FORELDREPENGER }}
    employeeHasAccess={boolean('employeeHasAccess', false)}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
  />
);

export const visÅpentAksjonspunktForSvangerskapspenger = () => (
  <VedtakProsessIndex
    behandling={behandling}
    vilkar={vilkar}
    beregningresultatForeldrepenger={resultatstruktur}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
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
    ytelseType={{ kode: fagsakYtelseType.SVANGERSKAPSPENGER }}
    employeeHasAccess={boolean('employeeHasAccess', false)}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
  />
);

export const visModalForObligatoriskFritekstbrevForSvangerskapspenger = () => {
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
        sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
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
        ytelseType={{ kode: fagsakYtelseType.SVANGERSKAPSPENGER }}
        employeeHasAccess={boolean('employeeHasAccess', false)}
        isReadOnly={boolean('isReadOnly', false)}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
        alleKodeverk={alleKodeverk}
      />
    </VedtakFormContext.Provider>
  );
};

export const visÅpentAksjonspunktForEngangsstønad = () => (
  <VedtakProsessIndex
    behandling={behandling}
    vilkar={vilkar}
    beregningresultatEngangsstonad={resultatstruktur}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
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
    ytelseType={{ kode: fagsakYtelseType.ENGANGSSTONAD }}
    employeeHasAccess={boolean('employeeHasAccess', false)}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
  />
);

export const visAtBehandlingErHenlagt = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      behandlingHenlagt: true,
    }}
    vilkar={vilkar}
    beregningresultatForeldrepenger={resultatstruktur}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
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
    ytelseType={{ kode: fagsakYtelseType.FORELDREPENGER }}
    employeeHasAccess={boolean('employeeHasAccess', false)}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
  />
);

export const visInnvilgetForForeldrepengerRevurdering = () => (
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
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
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
    ytelseType={{ kode: fagsakYtelseType.FORELDREPENGER }}
    employeeHasAccess={boolean('employeeHasAccess', false)}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
  />
);

export const visOpphørtForForeldrepengerRevurdering = () => (
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
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
    resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    ytelseType={{ kode: fagsakYtelseType.FORELDREPENGER }}
    employeeHasAccess={boolean('employeeHasAccess', false)}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
  />
);

export const visInnvilgetForEngangsstønadRevurdering = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      type: {
        kode: behandlingType.REVURDERING,
      },
    }}
    vilkar={vilkar}
    beregningresultatEngangsstonad={resultatstruktur}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
    resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    ytelseType={{ kode: fagsakYtelseType.ENGANGSSTONAD }}
    employeeHasAccess={boolean('employeeHasAccess', false)}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
  />
);

export const visAvslåttForEngangsstønadRevurdering = () => (
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
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
    resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    ytelseType={{ kode: fagsakYtelseType.ENGANGSSTONAD }}
    employeeHasAccess={boolean('employeeHasAccess', false)}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
  />
);

export const visOverlappendeYtelser = () => {
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
      ytelseType: {
        kode: 'PSB',
        kodeverk: 'FAGSAK_YTELSE',
      },
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
      ytelseType: {
        kode: 'PSB',
        kodeverk: 'FAGSAK_YTELSE',
      },
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
      ytelseType: {
        kode: 'PSB',
        kodeverk: 'FAGSAK_YTELSE',
      },
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
      ytelseType: {
        kode: 'PSB',
        kodeverk: 'FAGSAK_YTELSE',
      },
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
            kode: behandlingType.OMSORGSPENGER,
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
        sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[aksjonspunkt5040]}
        ytelseType={{ kode: fagsakYtelseType.ENGANGSSTONAD }}
        employeeHasAccess={boolean('employeeHasAccess', false)}
        isReadOnly={boolean('isReadOnly', false)}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
        alleKodeverk={alleKodeverk}
        overlappendeYtelser={overlappendeYtelser}
      />
    </VedtakFormContext.Provider>
  );
};

export const brevMedFritekstfelt = () => {
  const [vedtakFormState, setVedtakFormState] = useState(null);
  const value = useMemo(() => ({ vedtakFormState, setVedtakFormState }), [vedtakFormState, setVedtakFormState]);

  return (
    <VedtakFormContext.Provider value={value}>
      <VedtakProsessIndex
        behandling={behandling}
        vilkar={[]}
        beregningresultatEngangsstonad={resultatstruktur}
        sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
        resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[]}
        ytelseType={{ kode: fagsakYtelseType.PLEIEPENGER }}
        employeeHasAccess={boolean('employeeHasAccess', true)}
        isReadOnly={boolean('isReadOnly', false)}
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
      />
    </VedtakFormContext.Provider>
  );
};

import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import tilbakekrevingKodeverkTyper from '@fpsak-frontend/kodeverk/src/tilbakekrevingKodeverkTyper';
import vilkarResultat from '@fpsak-frontend/prosess-tilbakekreving/src/kodeverk/vilkarResultat';
import sarligGrunn from '@fpsak-frontend/prosess-tilbakekreving/src/kodeverk/sarligGrunn';
import aktsomhet from '@fpsak-frontend/prosess-tilbakekreving/src/kodeverk/aktsomhet';
import NavBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import TilbakekrevingProsessIndex from '@fpsak-frontend/prosess-tilbakekreving';
import { Aksjonspunkt, Behandling } from '@k9-sak-web/types';
import DetaljerteFeilutbetalingsperioder from '@fpsak-frontend/prosess-tilbakekreving/src/types/detaljerteFeilutbetalingsperioderTsType';
import FeilutbetalingPerioderWrapper from '@fpsak-frontend/prosess-tilbakekreving/src/types/feilutbetalingPerioderTsType';

import withReduxProvider from '../../../decorators/withRedux';

const perioderForeldelse = {
  perioder: [
    {
      fom: '2019-01-01',
      tom: '2019-02-02',
      belop: 1000,
      foreldelseVurderingType: foreldelseVurderingType.IKKE_FORELDET,
    },
    {
      fom: '2019-02-03',
      tom: '2019-04-02',
      belop: 3000,
      foreldelseVurderingType: foreldelseVurderingType.FORELDET,
    },
  ],
} as FeilutbetalingPerioderWrapper;

const vilkarvurderingsperioder = {
  perioder: [
    {
      fom: '2019-01-01',
      tom: '2019-04-01',
      foreldet: false,
      feilutbetaling: 10,
      årsak: {
        hendelseType: 'MEDLEM',
      },
      redusertBeloper: [],
      ytelser: [
        {
          aktivitet: 'Arbeidstaker',
          belop: 1050,
        },
      ],
    },
  ],
  rettsgebyr: 1000,
} as DetaljerteFeilutbetalingsperioder;

const vilkarvurdering = {
  vilkarsVurdertePerioder: [],
};

const merknaderFraBeslutter = {
  notAccepted: false,
};

const alleKodeverk = {
  [tilbakekrevingKodeverkTyper.FORELDELSE_VURDERING]: [
    {
      kode: foreldelseVurderingType.FORELDET,
      navn: 'Foreldet',
      kodeverk: 'FORELDELSE_VURDERING',
    },
    {
      kode: foreldelseVurderingType.IKKE_FORELDET,
      navn: 'Ikke foreldet',
      kodeverk: 'FORELDELSE_VURDERING',
    },
    {
      kode: foreldelseVurderingType.TILLEGGSFRIST,
      navn: 'Tilleggsfrist',
      kodeverk: 'FORELDELSE_VURDERING',
    },
  ],
  [tilbakekrevingKodeverkTyper.SARLIG_GRUNN]: [
    {
      kode: sarligGrunn.GRAD_AV_UAKTSOMHET,
      navn: 'Grad av uaktsomhet',
    },
    {
      kode: sarligGrunn.HELT_ELLER_DELVIS_NAVS_FEIL,
      navn: 'Helt eller delvis NAVs feil',
    },
    {
      kode: sarligGrunn.STOERRELSE_BELOEP,
      navn: 'Størrelse beløp',
    },
    {
      kode: sarligGrunn.TID_FRA_UTBETALING,
      navn: 'Tid fra utbetaling',
    },
    {
      kode: sarligGrunn.ANNET,
      navn: 'Annet',
    },
  ],
  [tilbakekrevingKodeverkTyper.VILKAR_RESULTAT]: [
    {
      kode: vilkarResultat.FORSTO_BURDE_FORSTAATT,
      navn: 'Ja, mottaker forsto eller burde forstått at utbetalingen skyldtes en feil (1. ledd, 1. punkt)',
    },
    {
      kode: vilkarResultat.FEIL_OPPLYSNINGER,
      navn: 'Ja, mottaker har forårsaket feilutbetalingen ved forsett eller uaktsomt gitt feilaktige opplysninger (1. ledd, 2 punkt)',
    },
    {
      kode: vilkarResultat.MANGELFULL_OPPLYSNING,
      navn: 'Ja, mottaker har forårsaket feilutbetalingen ved forsett eller uaktsomt gitt mangelfulle opplysninger (1. ledd, 2 punkt)',
    },
    {
      kode: vilkarResultat.GOD_TRO,
      navn: 'Nei, mottaker har mottatt beløpet i god tro (1. ledd)',
    },
  ],
  [tilbakekrevingKodeverkTyper.AKTSOMHET]: [
    {
      kode: aktsomhet.FORSETT,
      navn: 'Forsett',
    },
    {
      kode: aktsomhet.GROVT_UAKTSOM,
      navn: 'Grovt uaktsom',
    },
    {
      kode: aktsomhet.SIMPEL_UAKTSOM,
      navn: 'Simpel uaktsom',
    },
  ],
};

export default {
  title: 'prosess/tilbakekreving/prosess-tilbakekreving',
  component: TilbakekrevingProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

const beregnBelop = params => {
  const { perioder } = params;
  return Promise.resolve({
    perioder,
  });
};

export const visAksjonspunktForTilbakekreving = () => (
  <TilbakekrevingProsessIndex
    behandling={
      {
        id: 1,
        versjon: 1,
      } as Behandling
    }
    perioderForeldelse={object('perioderForeldelse', perioderForeldelse)}
    vilkarvurderingsperioder={object('vilkarvurderingsperioder', vilkarvurderingsperioder)}
    vilkarvurdering={object('vilkarvurdering', vilkarvurdering)}
    submitCallback={action('button-click') as () => Promise<any>}
    isReadOnly={boolean('readOnly', false)}
    readOnlySubmitButton={boolean('readOnly', false)}
    navBrukerKjonn={NavBrukerKjonn.KVINNE}
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodesTilbakekreving.VURDER_TILBAKEKREVING]: object('merknaderFraBeslutter', merknaderFraBeslutter),
    }}
    alleKodeverk={alleKodeverk as any}
    beregnBelop={params => beregnBelop(params)}
    aksjonspunkter={
      [
        {
          definisjon: aksjonspunktCodesTilbakekreving.VURDER_TILBAKEKREVING,
        },
      ] as Aksjonspunkt[]
    }
  />
);

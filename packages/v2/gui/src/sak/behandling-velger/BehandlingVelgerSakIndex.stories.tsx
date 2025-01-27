/* eslint-disable max-len */
import {
  BehandlingDtoStatus,
  BehandlingDtoType,
  BehandlingsresultatDtoType,
  VilkårResultatDtoAvslagsårsak,
  VilkårResultatDtoUtfall,
  type BehandlingDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import type { Meta, StoryObj } from '@storybook/react';
import BehandlingVelgerSakV2 from './BehandlingVelgerSakIndex';

const behandlinger = [
  {
    ansvarligSaksbehandler: 'beslut',
    avsluttet: '2021-12-20T09:23:01',
    behandlingsresultat: {
      erRevurderingMedUendretUtfall: false,
      type: BehandlingsresultatDtoType.INNVILGET,
      vilkårResultat: {
        MEDLEMSKAPSVILKÅRET: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: VilkårResultatDtoAvslagsårsak.UDEFINERT,
            utfall: VilkårResultatDtoUtfall.UDEFINERT,
          },
        ],
        MEDISINSKEVILKÅR_UNDER_18_ÅR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: VilkårResultatDtoAvslagsårsak.UDEFINERT,
            utfall: VilkårResultatDtoUtfall.UDEFINERT,
          },
        ],
        OPPTJENINGSPERIODEVILKÅR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: VilkårResultatDtoAvslagsårsak.UDEFINERT,
            utfall: VilkårResultatDtoUtfall.UDEFINERT,
          },
        ],
        ALDERSVILKÅR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: VilkårResultatDtoAvslagsårsak.UDEFINERT,
            utfall: VilkårResultatDtoUtfall.UDEFINERT,
          },
        ],
        SØKNADSFRIST: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: VilkårResultatDtoAvslagsårsak.UDEFINERT,
            utfall: VilkårResultatDtoUtfall.UDEFINERT,
          },
        ],
        BEREGNINGSGRUNNLAGVILKÅR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: VilkårResultatDtoAvslagsårsak.UDEFINERT,
            utfall: VilkårResultatDtoUtfall.UDEFINERT,
          },
        ],
        OPPTJENINGSVILKÅRET: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: VilkårResultatDtoAvslagsårsak.UDEFINERT,
            utfall: VilkårResultatDtoUtfall.UDEFINERT,
          },
        ],
        OMSORGEN_FOR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: VilkårResultatDtoAvslagsårsak.UDEFINERT,
            utfall: VilkårResultatDtoUtfall.UDEFINERT,
          },
        ],
      },
      vedtaksdato: '2021-12-20',
    } as BehandlingDto['behandlingsresultat'],
    id: 999955,
    links: [],
    opprettet: '2021-12-20T09:22:38',
    status: BehandlingDtoStatus.AVSLUTTET,
    type: BehandlingDtoType.REVURDERING,
  },
  {
    ansvarligSaksbehandler: 'saksbeh',
    avsluttet: '2021-12-20T09:22:36',
    behandlingsresultat: {
      erRevurderingMedUendretUtfall: false,
      type: BehandlingsresultatDtoType.INNVILGET,
      vilkårResultat: {
        MEDLEMSKAPSVILKÅRET: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: VilkårResultatDtoAvslagsårsak.UDEFINERT,
            utfall: VilkårResultatDtoUtfall.UDEFINERT,
          },
        ],
        MEDISINSKEVILKÅR_UNDER_18_ÅR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: VilkårResultatDtoAvslagsårsak.UDEFINERT,
            utfall: VilkårResultatDtoUtfall.UDEFINERT,
          },
        ],
        OPPTJENINGSPERIODEVILKÅR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: VilkårResultatDtoAvslagsårsak.UDEFINERT,
            utfall: VilkårResultatDtoUtfall.UDEFINERT,
          },
        ],
        ALDERSVILKÅR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: VilkårResultatDtoAvslagsårsak.UDEFINERT,
            utfall: VilkårResultatDtoUtfall.UDEFINERT,
          },
        ],
        SØKNADSFRIST: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: VilkårResultatDtoAvslagsårsak.UDEFINERT,
            utfall: VilkårResultatDtoUtfall.UDEFINERT,
          },
        ],
        BEREGNINGSGRUNNLAGVILKÅR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: VilkårResultatDtoAvslagsårsak.UDEFINERT,
            utfall: VilkårResultatDtoUtfall.UDEFINERT,
          },
        ],
        OPPTJENINGSVILKÅRET: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: VilkårResultatDtoAvslagsårsak.UDEFINERT,
            utfall: VilkårResultatDtoUtfall.UDEFINERT,
          },
        ],
        OMSORGEN_FOR: [
          {
            periode: { fom: '2021-10-25', tom: '2021-12-25' },
            avslagsårsak: VilkårResultatDtoAvslagsårsak.UDEFINERT,
            utfall: VilkårResultatDtoUtfall.UDEFINERT,
          },
        ],
      },
      vedtaksdato: '2021-12-20',
    },
    id: 999951,
    links: [],
    opprettet: '2021-12-20T09:21:41',
    status: BehandlingDtoStatus.AVSLUTTET,
    type: BehandlingDtoType.FØRSTEGANGSSØKNAD,
  },
];

const fagsak = {
  sakstype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
};

const locationMock = {
  key: '1',
  pathname: 'test',
  search: 'test',
  state: {},
  hash: 'test',
};

export default {
  title: 'gui/sak/behandling-velger',
  component: BehandlingVelgerSakV2,
  decorators: [
    Story => (
      <KodeverkProvider
        behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <div style={{ width: '600px' }}>
          <Story />
        </div>
      </KodeverkProvider>
    ),
  ],
} satisfies Meta<typeof BehandlingVelgerSakV2>;

export const Default: StoryObj<typeof BehandlingVelgerSakV2> = {
  args: {
    getBehandlingLocation: () => locationMock,
    fagsak,
    createLocationForSkjermlenke: () => locationMock,
    behandlinger,
    noExistingBehandlinger: false,
    behandlingId: 1,
  },
};

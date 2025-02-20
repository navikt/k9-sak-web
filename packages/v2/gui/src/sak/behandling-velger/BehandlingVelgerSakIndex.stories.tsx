/* eslint-disable max-len */
import {
  BehandlingDtoStatus,
  BehandlingDtoType,
  BehandlingsresultatDtoType,
  type BehandlingDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent } from '@storybook/test';
import withKodeverkContext from '../../storybook/decorators/withKodeverkContext.js';
import withMaxWidth from '../../storybook/decorators/withMaxWidth.js';
import { FakeBehandlingVelgerBackendApi } from '../../storybook/mocks/FakeBehandlingVelgerBackendApi.js';
import BehandlingVelgerSakV2 from './BehandlingVelgerSakIndex';

const behandlinger = [
  {
    ansvarligSaksbehandler: 'beslut',
    avsluttet: '2021-12-20T09:23:01',
    behandlingsresultat: {
      erRevurderingMedUendretUtfall: false,
      type: BehandlingsresultatDtoType.INNVILGET,
      vilkårResultat: {},
      vedtaksdato: '2021-12-20',
    } satisfies BehandlingDto['behandlingsresultat'],
    id: 999955,
    links: [],
    opprettet: '2021-12-20T09:22:38',
    status: BehandlingDtoStatus.AVSLUTTET,
    type: BehandlingDtoType.REVURDERING,
    uuid: '1',
  },
  {
    ansvarligSaksbehandler: 'saksbeh',
    avsluttet: '2021-12-20T09:22:36',
    behandlingsresultat: {
      erRevurderingMedUendretUtfall: false,
      type: BehandlingsresultatDtoType.INNVILGET,
      vilkårResultat: {},
      vedtaksdato: '2021-12-20',
    },
    id: 999951,
    links: [],
    opprettet: '2021-12-20T09:21:41',
    status: BehandlingDtoStatus.AVSLUTTET,
    type: BehandlingDtoType.FØRSTEGANGSSØKNAD,
    uuid: '1',
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

const meta = {
  title: 'gui/sak/behandling-velger',
  component: BehandlingVelgerSakV2,
  decorators: [withKodeverkContext({ behandlingType: behandlingType.FØRSTEGANGSSØKNAD }), withMaxWidth(600)],
} satisfies Meta<typeof BehandlingVelgerSakV2>;

export default meta;

const api = new FakeBehandlingVelgerBackendApi();

export const Default: StoryObj<typeof meta> = {
  args: {
    getBehandlingLocation: () => locationMock,
    fagsak,
    createLocationForSkjermlenke: () => locationMock,
    behandlinger,
    noExistingBehandlinger: false,
    behandlingId: 1,
    api,
  },
  play: async ({ canvas, step }) => {
    await step('skal rendre komponent', async () => {
      await userEvent.click(canvas.getByText('Se alle behandlinger'));
      await expect(canvas.getByText('2. Viderebehandling')).toBeInTheDocument();
      await expect(canvas.getAllByText('20.12.2021')).toHaveLength(4);
    });
  },
};

export const IngenBehandlinger: StoryObj<typeof meta> = {
  args: {
    getBehandlingLocation: () => locationMock,
    fagsak,
    createLocationForSkjermlenke: () => locationMock,
    behandlinger: [],
    noExistingBehandlinger: true,
    api,
  },
  play: async ({ canvas, step }) => {
    await step('skal vise forklarende tekst når det ikke finnes behandlinger', async () => {
      await expect(canvas.getByText('Ingen behandlinger er opprettet')).toBeInTheDocument();
    });
  },
};

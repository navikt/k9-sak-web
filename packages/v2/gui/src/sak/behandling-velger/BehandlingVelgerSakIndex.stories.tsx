/* eslint-disable max-len */
import {
  k9_kodeverk_behandling_FagsakYtelseType as BehandlingDtoSakstype,
  k9_kodeverk_behandling_BehandlingStatus as BehandlingDtoStatus,
  k9_kodeverk_behandling_BehandlingType as BehandlingDtoType,
  k9_kodeverk_behandling_BehandlingResultatType as BehandlingsresultatDtoType,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import withKodeverkContext from '../../storybook/decorators/withKodeverkContext.js';
import withMaxWidth from '../../storybook/decorators/withMaxWidth.js';
import { FakeBehandlingVelgerBackendApi } from '../../storybook/mocks/FakeBehandlingVelgerBackendApi.js';
import BehandlingVelgerSakV2 from './BehandlingVelgerSakIndex';
import type { Behandling } from './types/Behandling';

const createBehandling = ({
  id,
  status = BehandlingDtoStatus.AVSLUTTET,
  type = BehandlingDtoType.REVURDERING,
  ansvarligSaksbehandler = 'saksbeh',
}: {
  id: number;
  status?: Behandling['status'];
  type?: Behandling['type'];
  ansvarligSaksbehandler?: Behandling['ansvarligSaksbehandler'];
}): Behandling => ({
  ansvarligSaksbehandler,
  avsluttet: status === BehandlingDtoStatus.AVSLUTTET ? '2021-12-20T09:23:01' : undefined,
  behandlingsresultat:
    status === BehandlingDtoStatus.AVSLUTTET
      ? {
          erRevurderingMedUendretUtfall: false,
          type: BehandlingsresultatDtoType.INNVILGET,
          vilkårResultat: {},
          vedtaksdato: '2021-12-20',
        }
      : undefined,
  id,
  links: [],
  opprettet: '2021-12-20T09:22:38',
  status,
  type,
  uuid: `${id}`,
  sakstype: BehandlingDtoSakstype.PLEIEPENGER_SYKT_BARN,
  behandlingÅrsaker: [],
});

const behandlinger = [
  createBehandling({ id: 999955, type: BehandlingDtoType.REVURDERING, ansvarligSaksbehandler: 'beslut' }),
  createBehandling({ id: 999951, type: BehandlingDtoType.FØRSTEGANGSSØKNAD }),
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

const getBehandlingLocation = (behandlingId: number) => ({
  ...locationMock,
  pathname: `/behandling/${behandlingId}`,
  search: '',
  hash: '',
});

const meta = {
  title: 'gui/sak/behandling-velger',
  component: BehandlingVelgerSakV2,
  decorators: [withKodeverkContext({ behandlingType: behandlingType.FØRSTEGANGSSØKNAD }), withMaxWidth(600)],
} satisfies Meta<typeof BehandlingVelgerSakV2>;

export default meta;

const api = new FakeBehandlingVelgerBackendApi();

export const Default: StoryObj<typeof meta> = {
  args: {
    getBehandlingLocation,
    fagsak,
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
    getBehandlingLocation,
    fagsak,
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

export const EnApenBehandling: StoryObj<typeof meta> = {
  args: {
    getBehandlingLocation,
    fagsak,
    behandlinger: [
      createBehandling({ id: 1001, status: BehandlingDtoStatus.OPPRETTET }),
      createBehandling({ id: 1002 }),
    ],
    noExistingBehandlinger: false,
    api,
  },
  play: async ({ canvas, step }) => {
    await step('skal velge åpen behandling automatisk', async () => {
      await expect(canvas.getByText('Se alle behandlinger')).toBeInTheDocument();
      await expect(canvas.queryByText('Velg behandling (2)')).not.toBeInTheDocument();
    });
  },
};

export const FlereApneBehandlinger: StoryObj<typeof meta> = {
  args: {
    getBehandlingLocation,
    fagsak,
    behandlinger: [
      createBehandling({ id: 2001, status: BehandlingDtoStatus.OPPRETTET }),
      createBehandling({ id: 2002, status: BehandlingDtoStatus.OPPRETTET }),
      createBehandling({ id: 2003 }),
    ],
    noExistingBehandlinger: false,
    api,
  },
  play: async ({ canvas, step }) => {
    await step('skal vise alle behandlinger når man åpner listen', async () => {
      await userEvent.click(canvas.getByText('Se alle behandlinger'));
      await expect(canvas.getByText('Velg behandling (3)')).toBeInTheDocument();
      await expect(canvas.getAllByTestId('BehandlingPickerItem')).toHaveLength(3);
    });
  },
};

export const ViserHentFlereBehandlingerKnapp: StoryObj<typeof meta> = {
  args: {
    getBehandlingLocation,
    fagsak,
    behandlinger: Array.from({ length: 11 }, (_, index) =>
      createBehandling({
        id: 3000 + index,
        type: index % 2 === 0 ? BehandlingDtoType.REVURDERING : BehandlingDtoType.FØRSTEGANGSSØKNAD,
      }),
    ),
    noExistingBehandlinger: false,
    api,
  },
  play: async ({ canvas, step }) => {
    await step('skal vise knapp for å hente flere behandlinger', async () => {
      await expect(canvas.getByText('Hent flere behandlinger')).toBeInTheDocument();
      await expect(canvas.getAllByTestId('BehandlingPickerItem')).toHaveLength(10);
    });

    await step('skal hente og vise flere behandlinger ved klikk', async () => {
      await userEvent.click(canvas.getByText('Hent flere behandlinger'));
      await expect(canvas.getAllByTestId('BehandlingPickerItem')).toHaveLength(11);
    });
  },
};

export const NavigasjonTilValgtBehandling: StoryObj<typeof meta> = {
  args: {
    getBehandlingLocation,
    fagsak,
    behandlinger,
    noExistingBehandlinger: false,
    api,
  },
  play: async ({ canvas, step }) => {
    await step('skal navigere til valgt behandling via lenke', async () => {
      const lenke = canvas.getByRole('link', { name: /2\. Viderebehandling/i });
      await expect(lenke).toHaveAttribute('href', '/behandling/999955');
      await userEvent.click(lenke);
      await expect(canvas.getByText('Se alle behandlinger')).toBeInTheDocument();
    });
  },
};

/* eslint-disable max-len */
import {
  k9_kodeverk_behandling_FagsakYtelseType as BehandlingDtoSakstype,
  k9_kodeverk_behandling_BehandlingStatus as BehandlingDtoStatus,
  k9_kodeverk_behandling_BehandlingType as BehandlingDtoType,
  k9_kodeverk_behandling_BehandlingResultatType as BehandlingsresultatDtoType,
  k9_sak_kontrakt_ResourceLink_HttpMethod as HttpMethod,
  type k9_sak_kontrakt_behandling_BehandlingDto as BehandlingDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, spyOn, userEvent } from 'storybook/test';
import withKodeverkContext from '../../storybook/decorators/withKodeverkContext.js';
import withMaxWidth from '../../storybook/decorators/withMaxWidth.js';
import { withQueryClientProvider } from '../../storybook/decorators/withQueryClientProvider.js';
import { FakeBehandlingVelgerBackendApi } from '../../storybook/mocks/FakeBehandlingVelgerBackendApi.js';
import BehandlingVelgerSakV2 from './BehandlingVelgerSakIndex';
import type { Behandling } from './types/Behandling.js';

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
    sakstype: BehandlingDtoSakstype.PLEIEPENGER_SYKT_BARN,
    behandlingÅrsaker: [],
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
    sakstype: BehandlingDtoSakstype.PLEIEPENGER_SYKT_BARN,
    behandlingÅrsaker: [],
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

const perioderÅrsakLink = {
  href: '/k9/sak/api/behandling/perioder-aarsak',
  rel: 'behandling-perioder-årsak-med-vilkår',
  type: HttpMethod.GET,
};

const lagBehandling = (behandling: Partial<Behandling> & Pick<Behandling, 'id' | 'opprettet'>): Behandling => ({
  ansvarligSaksbehandler: 'saksbeh',
  avsluttet: undefined,
  behandlingsresultat: undefined,
  links: [perioderÅrsakLink],
  status: BehandlingDtoStatus.AVSLUTTET,
  type: BehandlingDtoType.REVURDERING,
  uuid: `uuid-${behandling.id}`,
  sakstype: BehandlingDtoSakstype.PLEIEPENGER_SYKT_BARN,
  behandlingÅrsaker: [],
  ...behandling,
});

const innvilget = {
  erRevurderingMedUendretUtfall: false,
  type: BehandlingsresultatDtoType.INNVILGET,
  vilkårResultat: {},
  vedtaksdato: '2022-02-01',
} satisfies BehandlingDto['behandlingsresultat'];

const førstegangsbehandling = lagBehandling({
  id: 1001,
  type: BehandlingDtoType.FØRSTEGANGSSØKNAD,
  opprettet: '2022-01-01T10:00:00',
  avsluttet: '2022-02-01T10:00:00',
  behandlingsresultat: innvilget,
});

const revurdering = lagBehandling({
  id: 1002,
  opprettet: '2022-03-01T10:00:00',
  avsluttet: '2022-03-10T10:00:00',
  behandlingsresultat: innvilget,
});

const automatiskRevurdering = lagBehandling({
  id: 1003,
  ansvarligSaksbehandler: undefined,
  opprettet: '2022-04-01T10:00:00',
  avsluttet: '2022-04-02T10:00:00',
  behandlingsresultat: innvilget,
});

const åpenRevurdering = lagBehandling({
  id: 1004,
  status: BehandlingDtoStatus.UTREDES,
  opprettet: '2022-05-01T10:00:00',
});

const perioderApi = new FakeBehandlingVelgerBackendApi({
  [førstegangsbehandling.id]: {
    perioder: [{ fom: '2022-01-01', tom: '2022-01-31' }],
    perioderMedÅrsak: [],
  },
  [revurdering.id]: {
    perioder: [{ fom: '2022-02-01', tom: '2022-02-28' }],
    perioderMedÅrsak: [
      {
        periode: { fom: '2022-02-01', tom: '2022-02-28' },
        årsaker: ['ENDRING_FRA_BRUKER', 'REVURDERER_NY_INNTEKTSMELDING', 'REVURDERER_BERØRT_PERIODE'],
      },
    ],
  },
});

// Egen QueryClient per story, slik at cachede søknadsperioder ikke lekker mellom stories
export const MedSøknadsperioder: StoryObj<typeof meta> = {
  decorators: [withQueryClientProvider()],
  args: {
    getBehandlingLocation: () => locationMock,
    fagsak,
    behandlinger: [førstegangsbehandling, revurdering],
    noExistingBehandlinger: false,
    api: perioderApi,
  },
  play: async ({ canvas, step }) => {
    await step('skal vise liste med alle behandlinger', async () => {
      await expect(canvas.getByText('Velg behandling (2)')).toBeInTheDocument();
      await expect(canvas.getAllByTestId('BehandlingPickerItem')).toHaveLength(2);
      await expect(canvas.getByText('1. Førstegangsbehandling')).toBeInTheDocument();
      await expect(canvas.getByText('2. Viderebehandling')).toBeInTheDocument();
    });
    await step('skal vise søknadsperioder hentet fra backend', async () => {
      await expect(await canvas.findByText('01.01.2022 - 31.01.2022')).toBeInTheDocument();
      await expect(await canvas.findByText('01.02.2022 - 28.02.2022')).toBeInTheDocument();
    });
  },
};

export const ValgtBehandlingMedÅrsaker: StoryObj<typeof meta> = {
  decorators: [withQueryClientProvider()],
  args: {
    getBehandlingLocation: () => locationMock,
    fagsak,
    behandlinger: [førstegangsbehandling, revurdering],
    noExistingBehandlinger: false,
    behandlingId: revurdering.id,
    api: perioderApi,
  },
  play: async ({ canvas, step }) => {
    await step('skal vise valgt behandling', async () => {
      await expect(canvas.getByTestId('behandlingSelected')).toBeInTheDocument();
      await expect(canvas.getByRole('heading', { name: 'Viderebehandling' })).toBeInTheDocument();
      await expect(canvas.queryByTestId('BehandlingPickerItem')).not.toBeInTheDocument();
    });
    await step('skal vise søknadsperioder og årsaker hentet fra backend', async () => {
      await expect(await canvas.findByText('Årsaker for vurdering av perioder:')).toBeInTheDocument();
      await expect(canvas.getByText('01.02.2022 - 28.02.2022')).toBeInTheDocument();
      await expect(canvas.getByText('Endring fra søknad/Punsj')).toBeInTheDocument();
      await expect(canvas.getByText('Ny inntektsmelding')).toBeInTheDocument();
    });
    await step('skal ikke vise årsaken tilstøtende periode', async () => {
      await expect(canvas.queryByText('Tilstøtende periode')).not.toBeInTheDocument();
    });
    await step('skal vise lenke til faktapanel for søknadsperioder', async () => {
      await expect(canvas.getByText('Søknadsperioder med årsaker for behandling')).toBeInTheDocument();
    });
  },
};

const åpenSluttdatoApi = new FakeBehandlingVelgerBackendApi({
  [revurdering.id]: {
    perioder: [{ fom: '2022-03-01', tom: '9999-12-31' }],
    perioderMedÅrsak: [],
  },
});

export const SøknadsperiodeUtenSluttdato: StoryObj<typeof meta> = {
  decorators: [withQueryClientProvider()],
  args: {
    getBehandlingLocation: () => locationMock,
    fagsak,
    behandlinger: [revurdering],
    noExistingBehandlinger: false,
    api: åpenSluttdatoApi,
  },
  play: async ({ canvas, step }) => {
    await step('skal ikke vise tom når den er 9999-12-31', async () => {
      await expect(await canvas.findByText('01.03.2022 -')).toBeInTheDocument();
      await expect(canvas.queryByText(/31\.12\.9999/)).not.toBeInTheDocument();
    });
  },
};

const frisinnApi = new FakeBehandlingVelgerBackendApi({
  [førstegangsbehandling.id]: {
    perioder: [{ fom: '2022-01-01', tom: '2022-01-31' }],
    perioderMedÅrsak: [],
  },
});

export const HenterIkkeSøknadsperioderForFrisinn: StoryObj<typeof meta> = {
  decorators: [withQueryClientProvider()],
  beforeEach: () => {
    spyOn(frisinnApi, 'getBehandlingPerioderÅrsaker');
  },
  args: {
    getBehandlingLocation: () => locationMock,
    fagsak: { sakstype: BehandlingDtoSakstype.FRISINN },
    behandlinger: [{ ...førstegangsbehandling, sakstype: BehandlingDtoSakstype.FRISINN }],
    noExistingBehandlinger: false,
    api: frisinnApi,
  },
  play: async ({ canvas, step }) => {
    await step('skal ikke hente søknadsperioder for Frisinn', async () => {
      await expect(canvas.getAllByTestId('BehandlingPickerItem')).toHaveLength(1);
      await expect(frisinnApi.getBehandlingPerioderÅrsaker).not.toHaveBeenCalled();
      await expect(canvas.queryByText('01.01.2022 - 31.01.2022')).not.toBeInTheDocument();
    });
  },
};

export const VelgerÅpenBehandlingAutomatisk: StoryObj<typeof meta> = {
  decorators: [withQueryClientProvider()],
  args: {
    getBehandlingLocation: () => locationMock,
    fagsak,
    behandlinger: [førstegangsbehandling, åpenRevurdering],
    noExistingBehandlinger: false,
    api: perioderApi,
  },
  play: async ({ canvas, step }) => {
    await step('skal vise åpen behandling som valgt', async () => {
      await expect(canvas.getByTestId('behandlingSelected')).toBeInTheDocument();
      await expect(canvas.getByText('Ikke fastsatt')).toBeInTheDocument();
    });
    await step('skal vise alle behandlinger ved klikk på tilbakeknapp', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Se alle behandlinger' }));
      await expect(canvas.getAllByTestId('BehandlingPickerItem')).toHaveLength(2);
      await expect(canvas.queryByTestId('behandlingSelected')).not.toBeInTheDocument();
    });
    await step('skal vise valgt behandling ved klikk i listen', async () => {
      await userEvent.click(canvas.getByText('1. Førstegangsbehandling'));
      await expect(canvas.getByTestId('behandlingSelected')).toBeInTheDocument();
      await expect(canvas.getByRole('heading', { name: 'Førstegangsbehandling' })).toBeInTheDocument();
    });
  },
};

export const FiltrerBehandlinger: StoryObj<typeof meta> = {
  decorators: [withQueryClientProvider()],
  args: {
    getBehandlingLocation: () => locationMock,
    fagsak,
    behandlinger: [førstegangsbehandling, revurdering, automatiskRevurdering],
    noExistingBehandlinger: false,
    api: perioderApi,
  },
  play: async ({ canvas, step }) => {
    await step('skal vise alle behandlinger uten filter', async () => {
      await expect(canvas.getAllByTestId('BehandlingPickerItem')).toHaveLength(3);
      await expect(canvas.getByText('(automatisk behandlet)')).toBeInTheDocument();
    });
    await step('skal kun vise automatisk behandlede når filter er valgt', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Filtrer' }));
      await userEvent.click(await screen.findByRole('menuitemcheckbox', { name: 'Automatisk behandling' }));
      await expect(canvas.getAllByTestId('BehandlingPickerItem')).toHaveLength(1);
      await expect(canvas.getByText('(automatisk behandlet)')).toBeInTheDocument();
    });
    await step('skal vise førstegangsbehandlinger når filteret byttes', async () => {
      await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Automatisk behandling' }));
      await userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Førstegangsbehandling' }));
      await expect(canvas.getAllByTestId('BehandlingPickerItem')).toHaveLength(1);
      await expect(canvas.getByText('1. Førstegangsbehandling')).toBeInTheDocument();
    });
  },
};

const mangeBehandlinger = Array.from({ length: 12 }, (_, index) =>
  lagBehandling({
    id: 2000 + index,
    opprettet: `2022-01-${String(index + 1).padStart(2, '0')}T10:00:00`,
    avsluttet: `2022-01-${String(index + 1).padStart(2, '0')}T12:00:00`,
    behandlingsresultat: innvilget,
  }),
);

export const HentFlereBehandlinger: StoryObj<typeof meta> = {
  decorators: [withQueryClientProvider()],
  args: {
    getBehandlingLocation: () => locationMock,
    fagsak,
    behandlinger: mangeBehandlinger,
    noExistingBehandlinger: false,
    api: new FakeBehandlingVelgerBackendApi(),
  },
  play: async ({ canvas, step }) => {
    await step('skal vise de ti første behandlingene', async () => {
      await expect(canvas.getByText('Velg behandling (12)')).toBeInTheDocument();
      await expect(canvas.getAllByTestId('BehandlingPickerItem')).toHaveLength(10);
    });
    await step('skal vise resten av behandlingene ved klikk på hent flere', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Hent flere behandlinger' }));
      await expect(canvas.getAllByTestId('BehandlingPickerItem')).toHaveLength(12);
      await expect(canvas.queryByRole('button', { name: 'Hent flere behandlinger' })).not.toBeInTheDocument();
    });
  },
};

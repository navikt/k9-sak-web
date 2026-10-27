import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { BarnType } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/BarnDto.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import withErrorBoundary from '../../storybook/decorators/withErrorBoundary.js';
import { withFakeBarnOmsApi } from '../../storybook/decorators/withFakeBarnOmsApi.js';
import type { BarnOgRammevedtak } from './api/BarnOmsBackendApiType.js';
import BarnOmsFaktaIndex from './BarnOmsFaktaIndex.js';

const barnOgRammevedtak: BarnOgRammevedtak = {
  barn: [{ personIdent: '15091512345', barnType: BarnType.VANLIG }],
  rammevedtak: [
    { type: 'UtvidetRett', utvidetRettFor: '15091512345', gyldigFraOgMed: '2021-01-01', gyldigTilOgMed: '2021-12-31' },
  ],
};

const hentBarnOgRammevedtak = fn(async () => barnOgRammevedtak);

const meta = {
  title: 'gui/fakta/barn-oms/BarnOmsFaktaIndex',
  component: BarnOmsFaktaIndex,
  beforeEach: () => {
    hentBarnOgRammevedtak.mockClear();
  },
  args: {
    behandlingUuid: 'test-behandling-uuid',
    behandlingVersjon: 1,
    fagsakYtelseType: fagsakYtelsesType.OMSORGSPENGER,
  },
} satisfies Meta<typeof BarnOmsFaktaIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MedBarnOgRammevedtak: Story = {
  decorators: [withFakeBarnOmsApi(hentBarnOgRammevedtak)],
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('heading', { name: 'Barn #1' })).toBeInTheDocument();
    await expect(canvas.getByText('Utvidet rett')).toBeInTheDocument();
    await expect(hentBarnOgRammevedtak).toHaveBeenCalledWith('test-behandling-uuid');
  },
};

// Klienten gjør 204 uten innhold om til tomme lister
export const IngenRegisteropplysninger: Story = {
  decorators: [withFakeBarnOmsApi(async () => ({ barn: [], rammevedtak: [] }))],
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Det er ikke registrert noen barn på søkeren')).toBeInTheDocument();
    await expect(canvas.getByText('Det er ikke registrert midlertidig aleneomsorg')).toBeInTheDocument();
  },
};

export const FeilVedHenting: Story = {
  decorators: [
    withErrorBoundary({ errorFallback: ({ error }) => <p>Feil: {error.message}</p> }),
    withFakeBarnOmsApi(async () => {
      throw new Error('Henting av barn feilet');
    }),
  ],
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Feil: Henting av barn feilet')).toBeInTheDocument();
    await expect(canvas.queryByText('Det er ikke registrert noen barn på søkeren')).not.toBeInTheDocument();
  },
};

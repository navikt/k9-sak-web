import type { PersonopplysningDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/PersonopplysningDto.js';
import { withFakeOmPleietrengendeApi } from '@k9-sak-web/gui/storybook/decorators/withFakeOmPleietrengendeApi.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import OmPleietrengendeFaktaIndex from './OmPleietrengendeFaktaIndex.js';

const pleietrengendeMock: PersonopplysningDto = {
  aktoerId: '1234567890123',
  fnr: '12345678910',
  navn: 'Ola Nordmann',
};

const meta = {
  title: 'gui/fakta/om-pleietrengende/OmPleietrengendeFaktaIndex',
  component: OmPleietrengendeFaktaIndex,
  decorators: [withFakeOmPleietrengendeApi(pleietrengendeMock)],
  args: {
    behandlingUuid: 'test-behandling-uuid',
  },
} satisfies Meta<typeof OmPleietrengendeFaktaIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('heading', { name: 'Om pleietrengende' })).toBeInTheDocument();
    await expect(canvas.getByText('Ola Nordmann')).toBeInTheDocument();
    await expect(canvas.getByText('12345678910')).toBeInTheDocument();
  },
};

export const IngenData: Story = {
  decorators: [withFakeOmPleietrengendeApi(null)],
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Ingen opplysninger om pleietrengende.')).toBeInTheDocument();
  },
};

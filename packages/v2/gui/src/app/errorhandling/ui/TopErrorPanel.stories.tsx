import { TopErrorPanelUI } from './TopErrorPanel.js';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { AppError } from '../AppError.js';
import { K9SakApiError } from '@k9-sak-web/backend/k9sak/errorhandling/K9SakApiError.js';
import type { FeilDtoUnion } from '@k9-sak-web/backend/shared/errorhandling/FeilDtoUnion.js';
import { generateNavCallidHeader } from '@k9-sak-web/backend/shared/instrumentation/navCallid.js';
import { withContentBelowStory, withTopDekoratør } from '../../../storybook/decorators/withTopDekoratør.js';
import { userEvent, within, expect } from 'storybook/test';

const meta = {
  title: 'gui/app/errorhandling/ui/TopErrorPanel',
  component: TopErrorPanelUI,
  args: {
    defaultExpanded: true,
    aktivFagsakId: "TEST_SAKID",
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [withTopDekoratør(), withContentBelowStory()],
} satisfies Meta<typeof TopErrorPanelUI>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoError: Story = {
  args: {
    errors: [],
  },
};

const fakeK9SakApiError = (url: string, status: number, feilmelding: string): K9SakApiError => {
  const req: Request = new Request(url);
  const responseBody: FeilDtoUnion = {
    type: 'GENERELL_FEIL',
    feilmelding,
  };
  const resp: Response = new Response(JSON.stringify(responseBody), { status });
  const { headerValue } = generateNavCallidHeader();
  return new K9SakApiError(req, resp, feilmelding, headerValue);
};

export const OneError: Story = {
  args: {
    errors: [new AppError({ message: 'Test error 1' })],
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Uventet feil')).toBeInTheDocument();
    await expect(await canvas.findByRole('button', { name: 'Detaljer' })).toBeInTheDocument();
  },
};

export const TwoErrors: Story = {
  args: {
    errors: [new AppError({ message: 'Test error 1' }), new AppError({ message: 'Test error 2' })],
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('2 Uventede feil')).toBeInTheDocument();
    const detaljsButtons = canvas.getAllByRole('button', { name: 'Detaljer' });
    await expect(detaljsButtons).toHaveLength(2);
  },
};

export const OpenDetailsModal: Story = {
  args: {
    errors: [new AppError({ title: 'Title 1', message: 'Test error 1' })],
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Detaljer' }));
    const dialog = within(document.body).getByRole('alertdialog');
    await expect(within(dialog).getByText('Test error 1')).toBeInTheDocument();
  },
};

export const MoreThanThreeUniqueErrorTypes: Story = {
  args: {
    errors: [
      new AppError({ message: 'Testfeil 1' }),
      new AppError({
        message:
          'Testfeil 2. Har veldig lang tekst i feilmelding. Kanskje blir det faktisk flere linjer ut av det, hvis vinduet er smalt?. xyzxyz æøåæøå jepp jepp.',
      }),
      new AppError({ message: 'Testfeil 3' }),
      fakeK9SakApiError('/fake/url', 500, 'Testfeil 4 (api error)'),
    ],
  },
};

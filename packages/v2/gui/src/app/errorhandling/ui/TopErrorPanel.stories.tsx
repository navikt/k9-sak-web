import { TopErrorPanel } from './TopErrorPanel.js';
import { type Decorator, type Meta, type StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import HeaderWithErrorPanel from '../../../sak/dekoratør/HeaderWithErrorPanel.js';
import { FrontendError } from '../FrontendError.js';
import { AdditionalInfoError } from '../AdditionalInfoError.js';
import { K9SakApiError } from '@k9-sak-web/backend/k9sak/errorhandling/K9SakApiError.js';
import type { FeilDtoUnion } from '@k9-sak-web/backend/shared/errorhandling/FeilDtoUnion.js';
import { generateNavCallidHeader } from '@k9-sak-web/backend/shared/instrumentation/navCallid.js';

const withAppScaffolding = (): Decorator => Story => {
  return (
    <>
      <HeaderWithErrorPanel
        removeErrorMessage={() => undefined}
        setSiteHeight={() => undefined}
        aaregPath="/aaregPath"
        ytelse="Demo feilhåndtering"
        headerTitleHref="/k9/web"
      />
      <Story />
      <h3>Saksdata...</h3>
    </>
  );
};

const meta = {
  title: 'gui/app/errorhandling/TopErrorPanel',
  component: TopErrorPanel,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [withAppScaffolding()],
} satisfies Meta<typeof TopErrorPanel>;

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
    errors: [new Error('Test error 1')],
  },
};

export const TwoErrors: Story = {
  args: {
    errors: [
      new Error('Test error 1'),
      new AdditionalInfoError('Test error 2', undefined, { message: 'Extra description of error', url: '/fake' }),
    ],
  },
};

export const MoreThanThreeUniqueErrorTypes: Story = {
  args: {
    errors: [
      new Error('Testfeil 1'),
      new FrontendError(
        'Testfeil 2. Har veldig lang tekst i feilmelding. Kanskje blir det faktisk flere linjer ut av det, hvis vinduet er smalt?. xyzxyz æøåæøå jepp jepp.',
      ),
      new AdditionalInfoError('Testfeil 3', undefined, { message: 'Extra description of error', url: '/fake' }),
      fakeK9SakApiError('/fake/url', 500, 'Testfeil 4 (api error)'),
    ],
  },
};

export const CheckAdditionalInfoDialogDisplay: Story = {
  args: {
    errors: [new AdditionalInfoError('Testfeil 3', undefined, { message: 'Extra description of error', url: '/fake' })],
  },
  play: async ({ canvas }) => {
    const visEkstraInfoLink = canvas.getByText('Vis ekstra info');
    await userEvent.click(visEkstraInfoLink);
    const dialog = await within(document.body).findByRole('alertdialog');
    await expect(dialog).toBeInTheDocument();
    await expect(within(dialog).getByText('Testfeil 3')).toBeInTheDocument();
    await expect(within(dialog).getByText(/Extra description of error/)).toBeInTheDocument();
    // Lukk dialogen og verifiser at den er borte
    const lukkButton = within(dialog).getByRole('button', { name: 'Lukk feilmelding' });
    await userEvent.click(lukkButton);
    await expect(within(dialog).queryByText('Testfeil 3')).not.toBeInTheDocument();
  },
};

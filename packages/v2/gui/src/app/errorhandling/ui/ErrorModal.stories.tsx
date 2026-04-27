import { type Decorator, type Meta, type StoryObj } from '@storybook/react-vite';
import HeaderWithErrorPanel from '../../../sak/dekoratør/HeaderWithErrorPanel.js';
import { FrontendError } from '../FrontendError.js';
import { AdditionalInfoError } from '../AdditionalInfoError.js';
import { K9SakApiError } from '@k9-sak-web/backend/k9sak/errorhandling/K9SakApiError.js';
import type { FeilDtoUnion } from '@k9-sak-web/backend/shared/errorhandling/FeilDtoUnion.js';
import { generateNavCallidHeader } from '@k9-sak-web/backend/shared/instrumentation/navCallid.js';
import { ErrorModal } from './ErrorModal.js';
import { action } from 'storybook/actions';
import { SentryReportedError } from '../SentryReportedError.js';

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
  title: 'gui/app/errorhandling/ErrorModal',
  component: ErrorModal,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [withAppScaffolding()],
  args: {
    onClose: action('onClose'),
    onReload: action('onReload'),
  },
} satisfies Meta<typeof ErrorModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoError: Story = {
  args: {
    error: undefined,
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

export const ShowError: Story = {
  args: {
    error: new Error('Test error 1'),
  },
};

export const ShowAdditionalInfoError: Story = {
  args: {
    error: new AdditionalInfoError('Test error 2', undefined, {
      longDetailedMessage:
        "Extra description of error. Might be a bit of a long description in some cases. Don't worry though, the lines will break at some point.",
      location: '/fake',
    }),
  },
};

export const ShowFrontendError: Story = {
  args: {
    error: new FrontendError(
      'Testfeil 2. Har veldig lang tekst i feilmelding. Kanskje blir det faktisk flere linjer ut av det, hvis vinduet er smalt?. xyzxyz æøåæøå jepp jepp.',
    ),
  },
};

export const ShowApiError: Story = {
  args: {
    error: fakeK9SakApiError('/fake/url', 500, 'Testfeil 4 (api error)'),
  },
};

export const ShowSentryReportedError: Story = {
  args: {
    error: new SentryReportedError(new FrontendError('Feil rapportert til sentry'), 'sentry-002'),
  },
};

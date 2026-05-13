import { TopErrorPanelUI } from './TopErrorPanel.js';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { FrontendError } from '../FrontendError.js';
import { K9SakApiError } from '@k9-sak-web/backend/k9sak/errorhandling/K9SakApiError.js';
import type { FeilDtoUnion } from '@k9-sak-web/backend/shared/errorhandling/FeilDtoUnion.js';
import { generateNavCallidHeader } from '@k9-sak-web/backend/shared/instrumentation/navCallid.js';
import { withContentBelowStory, withTopDekoratør } from '../../../storybook/decorators/withTopDekoratør.js';

const meta = {
  title: 'gui/app/errorhandling/ui/TopErrorPanel',
  component: TopErrorPanelUI,
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
    errors: [new FrontendError('Test error 1')],
  },
};

export const TwoErrors: Story = {
  args: {
    errors: [new FrontendError('Test error 1'), new FrontendError('Test error 2')],
  },
};

export const MoreThanThreeUniqueErrorTypes: Story = {
  args: {
    errors: [
      new FrontendError('Testfeil 1'),
      new FrontendError(
        'Testfeil 2. Har veldig lang tekst i feilmelding. Kanskje blir det faktisk flere linjer ut av det, hvis vinduet er smalt?. xyzxyz æøåæøå jepp jepp.',
      ),
      new FrontendError('Testfeil 3'),
      fakeK9SakApiError('/fake/url', 500, 'Testfeil 4 (api error)'),
    ],
  },
};

import { TopErrorPanelUI2 } from './TopErrorPanel2.js';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { AppError } from '../AppError.js';
import { K9SakApiError } from '@k9-sak-web/backend/k9sak/errorhandling/K9SakApiError.js';
import type { FeilDtoUnion } from '@k9-sak-web/backend/shared/errorhandling/FeilDtoUnion.js';
import { generateNavCallidHeader } from '@k9-sak-web/backend/shared/instrumentation/navCallid.js';
import { withContentBelowStory, withTopDekoratør } from '../../../storybook/decorators/withTopDekoratør.js';

const meta = {
  title: 'gui/app/errorhandling/ui/TopErrorPanel2',
  component: TopErrorPanelUI2,
  args: {
    defaultExpanded: true,
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [withTopDekoratør(), withContentBelowStory()],
} satisfies Meta<typeof TopErrorPanelUI2>;

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


export const XMoreThanThreeUniqueErrorTypes: Story = {
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

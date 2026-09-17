import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { asyncAction } from '../../storybook/asyncAction.js';
import { FakeOmsorgenForBackendApi } from '../../storybook/mocks/FakeOmsorgenForBackendApi.js';
import type { OmsorgenForApi } from './api/OmsorgenForApi.js';
import { OmsorgenForApiContext } from './api/OmsorgenForApiContext.js';
import OmsorgenFor from './src/OmsorgenFor.js';

const api = new FakeOmsorgenForBackendApi();

const withApi = (api: OmsorgenForApi): Decorator => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return Story => (
    <QueryClientProvider client={queryClient}>
      <Suspense>
        <OmsorgenForApiContext value={api}>
          <Story />
        </OmsorgenForApiContext>
      </Suspense>
    </QueryClientProvider>
  );
};

const meta = {
  title: 'gui/fakta/omsorgen-for',
  component: OmsorgenFor,
  decorators: [withApi(api)],
} satisfies Meta<typeof OmsorgenFor>;
export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultStory: Story = {
  args: {
    readOnly: false,
    behandlingUuid: '123',
    onFinished: asyncAction('onFinished'),
    sakstype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
  },
};

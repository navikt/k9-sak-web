import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { Meta, StoryObj } from '@storybook/react';
import { asyncAction } from '../../storybook/asyncAction';
import { FakeOmsorgenForBackendApi } from '../../storybook/mocks/FakeOmsorgenForBackendApi';
import OmsorgenFor from './src/OmsorgenFor';

const api = new FakeOmsorgenForBackendApi();

const meta = {
  title: 'gui/fakta/omsorgen-for',
  component: OmsorgenFor,
} satisfies Meta<typeof OmsorgenFor>;
export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultStory: Story = {
  args: {
    api,
    readOnly: false,
    behandlingUuid: '123',
    httpErrorHandler: asyncAction('httpErrorHandler'),
    onFinished: asyncAction('onFinished'),
    sakstype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
  },
};

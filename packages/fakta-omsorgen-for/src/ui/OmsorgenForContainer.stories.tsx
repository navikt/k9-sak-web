import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { handlersError, handlersVurdert, handlers } from '../../mock/api-mock';
import { mockUrlPrepend } from '../../mock/constants';
import OmsorgenForContainer from './OmsorgenForContainer';

const meta = {
  title: 'fakta/fakta-omsorgen-for/OmsorgenForContainer',
  component: OmsorgenForContainer,
  args: {
    data: {
      readOnly: false,
      sakstype: fagsakYtelsesType.OMSORGSPENGER,
      endpoints: {
        omsorgsperioder: `${mockUrlPrepend}/mock/omsorgsperioder`,
      },
      httpErrorHandler: fn(),
      onFinished: fn(),
    },
  },
} satisfies Meta<typeof OmsorgenForContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PerioderTilVurdering: Story = {
  parameters: {
    msw: { handlers },
  },
};

export const PerioderVurdert: Story = {
  parameters: {
    msw: { handlers: handlersVurdert },
  },
};

export const Pleiepenger: Story = {
  args: {
    data: {
      readOnly: false,
      sakstype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
      endpoints: {
        omsorgsperioder: `${mockUrlPrepend}/mock/omsorgsperioder`,
      },
      httpErrorHandler: fn(),
      onFinished: fn(),
    },
  },
  parameters: {
    msw: { handlers },
  },
};

export const ReadOnly: Story = {
  args: {
    data: {
      readOnly: true,
      sakstype: fagsakYtelsesType.OMSORGSPENGER,
      endpoints: {
        omsorgsperioder: `${mockUrlPrepend}/mock/omsorgsperioder`,
      },
      httpErrorHandler: fn(),
      onFinished: fn(),
    },
  },
  parameters: {
    msw: { handlers: handlersVurdert },
  },
};

export const FeilVedHenting: Story = {
  parameters: {
    msw: { handlers: handlersError },
    test: {
      dangerouslyIgnoreUnhandledErrors: true,
    },
  },
};

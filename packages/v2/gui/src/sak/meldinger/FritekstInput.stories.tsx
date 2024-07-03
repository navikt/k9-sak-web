import FritekstInput from '@k9-sak-web/gui/sak/meldinger/FritekstInput.js';
import type { Meta, StoryObj } from '@storybook/react';
import withMaxWidth from '@k9-sak-web/gui/storybook/decorators/withMaxWidth.js';

const meta: Meta<typeof FritekstInput> = {
  title: 'gui/sak/meldinger/FritekstInput.tsx',
  component: FritekstInput,
  decorators: [withMaxWidth(420)],
  argTypes: {
    onChange: {
      action: 'onChange',
    },
  },
};

export default meta;

export const Default: StoryObj<typeof FritekstInput> = {
  args: {
    språk: 'NB', // SPRAAK_KODE
    show: true,
    showTitle: true,
    showValidation: true,
  },
};

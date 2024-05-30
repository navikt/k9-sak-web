import FritekstInput from '@k9-sak-web/gui/sak/meldinger/FritekstInput.js';
import { Meta, StoryObj } from '@storybook/react';
import withMaxWidth from '../../../../decorators/withMaxWidth.js';

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
    språk: { kode: 'NB', kodeverk: 'SPRAAK_KODE' },
    show: true,
    showTitle: true,
    showValidation: true,
  },
};

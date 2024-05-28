/* eslint-disable import/no-relative-packages */
import { type Meta, type StoryObj } from '@storybook/react';
import withMaxWidth from '../../../../../storybook/decorators/withMaxWidth.js';
import FritekstInput from './FritekstInput.js';

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
    språk: 'Bokmål',
    show: true,
    showTitle: true,
    showValidation: true,
  },
};

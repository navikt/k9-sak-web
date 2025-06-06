import FritekstInput from '@k9-sak-web/gui/sak/meldinger/FritekstInput.js';
import withMaxWidth from '@k9-sak-web/gui/storybook/decorators/withMaxWidth.js';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from 'storybook/test';
import { StickyStateReducer } from '../../utils/StickyStateReducer.js';
import type { FritekstInputProps } from './FritekstInput.js';

const meta = {
  title: 'gui/sak/meldinger/FritekstInput.tsx',
  component: FritekstInput,
  decorators: [withMaxWidth(420)],
  argTypes: {
    onChange: {
      action: 'onChange',
    },
  },
} satisfies Meta<typeof FritekstInput>;

export default meta;

type Story = StoryObj<typeof meta>;

const newStickyState = (): FritekstInputProps['stickyState'] => ({
  tittel: new StickyStateReducer(),
  tekst: new StickyStateReducer(),
});

export const Default: Story = {
  args: {
    språk: { kode: 'NB', kodeverk: 'SPRAAK_KODE' },
    show: true,
    fritekstModus: 'EnkelFritekst',
    showValidation: true,
    stickyState: newStickyState(),
  },
};

export const UgyldigeTegn: Story = {
  args: {
    ...Default.args,
    defaultValue: {
      tittel: '',
      tekst: 'abcd[^]feil',
      invalid: false,
    },
    onChange: fn(),
    stickyState: newStickyState(),
  },
  play: async ({ args }) => {
    await expect(args.onChange).toHaveBeenCalledWith({ invalid: true });
  },
};

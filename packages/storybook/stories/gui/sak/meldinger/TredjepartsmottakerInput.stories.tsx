import React, { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { withKnobs } from "@storybook/addon-knobs";
import TredjepartsmottakerInput from "@k9-sak-web/gui/sak/meldinger/TredjepartsmottakerInput.js";

const meta: Meta<typeof TredjepartsmottakerInput> = {
  title: 'gui/sak/meldinger/TredjepartsmottakerInput.tsx',
  component: TredjepartsmottakerInput,
  decorators: [withKnobs],
}
export default meta

export const Default: StoryObj<typeof TredjepartsmottakerInput> = {
  args: {
    show: true
  }
}

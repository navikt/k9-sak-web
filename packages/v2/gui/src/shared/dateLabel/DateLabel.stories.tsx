import type { Meta, StoryObj } from '@storybook/react';
import { format } from 'date-fns';
import { expect } from 'storybook/test';
import DateLabel from './DateLabel';

export default {
  title: 'gui/shared/DateLabel',
  component: DateLabel,
} satisfies Meta<typeof DateLabel>;

export const Default: StoryObj<typeof DateLabel> = {
  args: {
    dateString: '2017-10-10',
  },
  play: async ({ canvas, step }) => {
    await step('skal ha en FormattedDate-komponent', async () => {
      await expect(canvas.queryByText('10.10.2017')).toBeInTheDocument();
    });

    await step('skal sjekke at dato blir formatert korrekt', async () => {
      await expect(canvas.queryByText(format(new Date('10.10.2017'), 'dd.MM.yyyy'))).toBeInTheDocument();
    });
  },
};

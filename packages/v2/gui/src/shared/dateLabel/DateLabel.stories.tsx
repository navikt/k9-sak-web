import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import { format } from 'date-fns';
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
    step('skal ha en FormattedDate-komponent', () => {
      expect(canvas.queryByText('10.10.2017')).toBeInTheDocument();
    });

    step('skal sjekke at dato blir formatert korrekt', () => {
      expect(canvas.queryByText(format(new Date('10.10.2017'), 'dd.MM.yyyy'))).toBeInTheDocument();
    });
  },
};

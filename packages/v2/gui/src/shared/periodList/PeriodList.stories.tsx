import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import { PeriodList } from './PeriodList';

const perioder = [
  {
    fom: '2022-02-16',
    tom: '2022-02-23',
    items: [
      {
        label: 'Land',
        value: 'Luxemburg',
      },
      {
        label: 'EØS',
        value: 'Ja',
      },
      {
        label: 'Årsak',
        value: 'Ukjent årsak',
      },
    ],
  },
  {
    fom: '2022-02-08',
    tom: '2022-02-15',
    items: [
      {
        label: 'Land',
        value: 'Kina',
      },
      {
        label: 'EØS',
        value: 'Nei',
      },
      {
        label: 'Årsak',
        value: 'Ingen, telles i 8 uker.',
      },
    ],
  },
  {
    fom: '2022-02-01',
    tom: '2022-02-07',
    items: [
      {
        label: 'Land',
        value: 'Mosambik',
      },
      {
        label: 'EØS',
        value: 'Nei',
      },
      {
        label: 'Årsak',
        value:
          'Barnet er innlagt i helseinstitusjon dekket etter avtale med annet land om trygd (mottar pleiepenger som i Norge, telles ikke i 8 uker)',
      },
    ],
  },
  {
    fom: '2022-01-24',
    tom: '2022-01-31',
    items: [
      {
        label: 'Land',
        value: 'Finland',
      },
      {
        label: 'EØS',
        value: 'Ja',
      },
      {
        label: 'Årsak',
        value: 'Ukjent årsak',
      },
    ],
  },
  {
    fom: '2022-01-16',
    tom: '2022-01-23',
    items: [
      {
        label: 'Land',
        value: 'Tyrkia',
      },
      {
        label: 'EØS',
        value: 'Nei',
      },
      {
        label: 'Årsak',
        value:
          'Barnet er innlagt i helseinstitusjon for norsk offentlig regning (mottar pleiepenger som i Norge, telles ikke i 8 uker)',
      },
    ],
  },
];

const meta = {
  title: 'gui/shared/periodList',
  component: PeriodList,
  args: {
    perioder,
    tittel: 'Perioder',
  },
} satisfies Meta<typeof PeriodList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Perioder')).toBeInTheDocument();
    await expect(canvas.getByText('16.01.2022 - 23.01.2022')).toBeInTheDocument();
    await expect(canvas.getByText('24.01.2022 - 31.01.2022')).toBeInTheDocument();
    await expect(canvas.getByText('01.02.2022 - 07.02.2022')).toBeInTheDocument();
    await expect(canvas.getByText('08.02.2022 - 15.02.2022')).toBeInTheDocument();
    await expect(canvas.getByText('16.02.2022 - 23.02.2022')).toBeInTheDocument();

    await expect(canvas.getAllByText('Land')).toHaveLength(5);
    await expect(canvas.getByText('Tyrkia')).toBeInTheDocument();
    await expect(canvas.getByText('Finland')).toBeInTheDocument();
    await expect(canvas.getByText('Mosambik')).toBeInTheDocument();
    await expect(canvas.getByText('Kina')).toBeInTheDocument();
    await expect(canvas.getByText('Luxemburg')).toBeInTheDocument();

    await expect(canvas.getAllByText('EØS')).toHaveLength(5);
    await expect(canvas.getAllByText('Nei')).toHaveLength(3);
    await expect(canvas.getAllByText('Ja')).toHaveLength(2);

    await expect(canvas.getAllByText('Årsak')).toHaveLength(5);
    await expect(
      canvas.getByText(
        'Barnet er innlagt i helseinstitusjon for norsk offentlig regning (mottar pleiepenger' +
          ' som i Norge, telles ikke i 8 uker)',
      ),
    ).toBeInTheDocument();
    await expect(canvas.getAllByText('Ukjent årsak')).toHaveLength(2);
    await expect(
      canvas.getByText(
        'Barnet er innlagt i helseinstitusjon dekket etter avtale med annet land om trygd (mottar pleiepenger' +
          ' som i Norge, telles ikke i 8 uker)',
      ),
    ).toBeInTheDocument();
    await expect(canvas.getByText('Ingen, telles i 8 uker.')).toBeInTheDocument();
  },
};

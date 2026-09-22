import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent } from 'storybook/test';
import { VilkårSplittPanel, type VilkårSplittPanelPeriod } from './VilkårSplittPanel.js';

const perioder: VilkårSplittPanelPeriod[] = [
  { id: '1', status: 'success', label: '01.01.2024 - 31.01.2024' },
  { id: '2', status: 'warning', label: '01.02.2024 - 28.02.2024' },
  { id: '3', status: 'error', label: '01.03.2024 - 31.03.2024' },
];

const meta = {
  title: 'gui/shared/vilkårSplittPanel/VilkårSplittPanel',
  component: VilkårSplittPanel,
  args: {
    periods: perioder,
    selectedItemId: '1',
    onItemSelect: fn(),
    detailHeading: 'Vurdering',
    children: <p>Innhold her</p>,
  },
  render: function Render(args) {
    const [selectedItemId, setSelectedItemId] = useState(args.selectedItemId);
    return (
      <VilkårSplittPanel
        {...args}
        selectedItemId={selectedItemId}
        onItemSelect={id => {
          setSelectedItemId(id);
          args.onItemSelect(id);
        }}
      />
    );
  },
} satisfies Meta<typeof VilkårSplittPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MedLovreferanse: Story = {
  args: {
    lovreferanse: '§ 9-10',
  },
};

export const Låst: Story = {
  args: {
    defaultIsLocked: true,
    lockedContent: <p>Låst innhold</p>,
    children: (isLocked: boolean) => <p>{isLocked ? 'Vurdering er låst' : 'Redigerbar vurdering'}</p>,
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    children: () => <p>Skrivebeskyttet vurdering</p>,
  },
};

export const KlikkerPeriodeKallerOnItemSelect: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByText('01.02.2024 - 28.02.2024'));
    void expect(args.onItemSelect).toHaveBeenCalledWith('2');
  },
};

export const LåsOppVurdering: Story = {
  args: {
    defaultIsLocked: true,
    children: (isLocked: boolean) => <p>{isLocked ? 'Låst tekst' : 'Redigerbar tekst'}</p>,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Låst tekst')).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: /Rediger vurdering/i }));

    await expect(canvas.getByText('Redigerbar tekst')).toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: /Rediger vurdering/i })).not.toBeInTheDocument();
  },
};

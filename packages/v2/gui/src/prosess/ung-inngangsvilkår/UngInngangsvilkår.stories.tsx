import type { Meta, StoryObj } from '@storybook/react';
import { UngInngangsvilkår } from './UngInngangsvilkår';

const meta = {
  title: 'gui/prosess/ung-inngangsvilkår/UngInngangsvilkår.tsx',
  component: UngInngangsvilkår,
} satisfies Meta<typeof UngInngangsvilkår>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InnvilgetAlderOgUngdomsprogram: Story = {
  args: {
    vilkar: [
      {
        vilkarType: 'UNG_VK_2',
        lovReferanse: 'Forskrift om ungdomsprogram og ungdomsprogramytelse § 8',
        overstyrbar: false,
        perioder: [
          {
            merknadParametere: {},
            vilkarStatus: 'OPPFYLT',
            periode: {
              fom: '2025-02-01',
              tom: '2026-01-30',
            },
            vurderesIBehandlingen: true,
          },
        ],
      },
      {
        vilkarType: 'UNG_VK_1',
        lovReferanse: 'Forskrift om ungdomsprogram og ungdomsprogramytelse § 3 bokstav a',
        overstyrbar: false,
        perioder: [
          {
            merknadParametere: {},
            vilkarStatus: 'OPPFYLT',
            periode: {
              fom: '2025-02-01',
              tom: '2026-01-30',
            },
            vurderesIBehandlingen: true,
          },
        ],
      },
    ],
  },
};

export const InngilvetAlderOgUtmeldtUngdomsprogram: Story = {
  args: {
    vilkar: [
      {
        vilkarType: 'UNG_VK_2',
        lovReferanse: 'Forskrift om ungdomsprogram og ungdomsprogramytelse § 8',
        overstyrbar: true,
        perioder: [
          {
            merknadParametere: {},
            vilkarStatus: 'OPPFYLT',
            periode: {
              fom: '2024-12-01',
              tom: '2025-01-15',
            },
            vurderesIBehandlingen: true,
          },
          {
            avslagKode: '-',
            merknadParametere: {},
            vilkarStatus: 'IKKE_OPPFYLT',
            periode: {
              fom: '2025-01-16',
              tom: '2025-11-30',
            },
            vurderesIBehandlingen: true,
          },
        ],
      },
      {
        vilkarType: 'UNG_VK_1',
        lovReferanse: 'Forskrift om ungdomsprogram og ungdomsprogramytelse § 3 bokstav a',
        overstyrbar: true,
        perioder: [
          {
            merknadParametere: {},
            vilkarStatus: 'OPPFYLT',
            periode: {
              fom: '2024-12-01',
              tom: '2025-11-30',
            },
            vurderesIBehandlingen: true,
          },
        ],
      },
    ],
  },
};

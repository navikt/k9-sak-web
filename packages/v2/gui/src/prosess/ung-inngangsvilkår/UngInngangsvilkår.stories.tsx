import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
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
        lovReferanse: 'Forskrift om forsøk med ungdomsprogram og ungdomsprogramytelse § 8',
        overstyrbar: false,
        perioder: [
          {
            avslagKode: undefined,
            merknadParametere: {},
            vilkarStatus: 'OPPFYLT',
            periode: {
              fom: '2025-02-03',
              tom: '2026-02-01',
            },
            begrunnelse: undefined,
            vurderesIBehandlingen: true,
            merknad: '-',
          },
        ],
      },
      {
        vilkarType: 'UNG_VK_1',
        lovReferanse: 'Forskrift om forsøk med ungdomsprogram og ungdomsprogramytelse § 8 jamfør 3 bokstav a',
        overstyrbar: false,
        perioder: [
          {
            avslagKode: undefined,
            merknadParametere: {},
            vilkarStatus: 'OPPFYLT',
            periode: {
              fom: '2025-02-03',
              tom: '2026-02-01',
            },
            begrunnelse: undefined,
            vurderesIBehandlingen: true,
            merknad: '-',
          },
        ],
      },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Vilkåret er oppfylt 03.02.2025 - 01.02.2026')).toBeInTheDocument();
    await expect(canvas.getByText('Deltaker meldt inn 03.02.2025')).toBeInTheDocument();
  },
};

export const InnvilgetAlderOgUtmeldtUngdomsprogram: Story = {
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
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Vilkåret er oppfylt 01.12.2024 - 30.11.2025')).toBeInTheDocument();
    await expect(canvas.getByText('Deltaker meldt inn 01.12.2024')).toBeInTheDocument();
    await expect(canvas.getByText('Deltaker meldt ut 30.11.2025')).toBeInTheDocument();
  },
};

export const EndretOppstartsdatoUngdomsprogram: Story = {
  args: {
    vilkar: [
      {
        vilkarType: 'UNG_VK_1',
        lovReferanse: 'Forskrift om ungdomsprogram og ungdomsprogramytelse § 3 bokstav a',
        overstyrbar: false,
        perioder: [
          {
            avslagKode: '',
            merknadParametere: {},
            vilkarStatus: 'OPPFYLT',
            periode: {
              fom: '2025-06-09',
              tom: '2026-06-14',
            },
            begrunnelse: '',
            vurderesIBehandlingen: true,
            merknad: '-',
          },
        ],
      },
      {
        vilkarType: 'UNG_VK_2',
        lovReferanse: 'Forskrift om ungdomsprogram og ungdomsprogramytelse § 8',
        overstyrbar: false,
        perioder: [
          {
            avslagKode: '2002',
            merknadParametere: {},
            vilkarStatus: 'IKKE_OPPFYLT',
            periode: {
              fom: '2025-06-09',
              tom: '2025-06-15',
            },
            begrunnelse: '',
            vurderesIBehandlingen: true,
            merknad: '-',
          },
          {
            avslagKode: '',
            merknadParametere: {},
            vilkarStatus: 'OPPFYLT',
            periode: {
              fom: '2025-06-16',
              tom: '2026-06-14',
            },
            begrunnelse: '',
            vurderesIBehandlingen: true,
            merknad: '-',
          },
        ],
      },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Vilkåret er oppfylt 09.06.2025 - 14.06.2026')).toBeInTheDocument();
    await expect(canvas.getByText('Deltaker meldt inn 09.06.2025')).toBeInTheDocument();
    await expect(canvas.getByText('Startdato er endret fra 09.06.2025 til 16.06.2025')).toBeInTheDocument();
  },
};

export const EndretOppstartsdatoOgSåOpphørUngdomsprogram: Story = {
  args: {
    vilkar: [
      {
        vilkarType: 'UNG_VK_1',
        lovReferanse: 'Forskrift om ungdomsprogram og ungdomsprogramytelse § 3 bokstav a',
        overstyrbar: false,
        perioder: [
          {
            avslagKode: '',
            merknadParametere: {},
            vilkarStatus: 'OPPFYLT',
            periode: {
              fom: '2025-06-09',
              tom: '2026-06-14',
            },
            begrunnelse: '',
            vurderesIBehandlingen: true,
            merknad: '-',
          },
        ],
      },
      {
        vilkarType: 'UNG_VK_2',
        lovReferanse: 'Forskrift om ungdomsprogram og ungdomsprogramytelse § 8',
        overstyrbar: false,
        perioder: [
          {
            avslagKode: '2002',
            merknadParametere: {},
            vilkarStatus: 'IKKE_OPPFYLT',
            periode: {
              fom: '2025-06-09',
              tom: '2025-06-15',
            },
            begrunnelse: '',
            vurderesIBehandlingen: true,
            merknad: '-',
          },
          {
            avslagKode: '',
            merknadParametere: {},
            vilkarStatus: 'OPPFYLT',
            periode: {
              fom: '2025-06-16',
              tom: '2026-06-14',
            },
            begrunnelse: '',
            vurderesIBehandlingen: true,
            merknad: '-',
          },
          {
            avslagKode: '-',
            merknadParametere: {},
            vilkarStatus: 'IKKE_OPPFYLT',
            periode: {
              fom: '2025-06-16',
              tom: '2026-06-15',
            },
            vurderesIBehandlingen: true,
          },
        ],
      },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Vilkåret er oppfylt 09.06.2025 - 14.06.2026')).toBeInTheDocument();
    await expect(canvas.getByText('Deltaker meldt inn 09.06.2025')).toBeInTheDocument();
    await expect(canvas.getByText('Startdato er endret fra 09.06.2025 til 16.06.2025')).toBeInTheDocument();
    await expect(canvas.getByText('Deltaker meldt ut 15.06.2026')).toBeInTheDocument();
  },
};

import {
  BehandlingDtoStatus as behandlingStatus,
  VilkårPeriodeDtoMerknad as merknad,
  FagsakDtoSakstype as sakstype,
} from '@k9-sak-web/backend/k9sak/generated';
import { aksjonspunktkodeDefinisjonType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktkodeDefinisjon.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import React from 'react';
import VilkarresultatMedOverstyringProsessIndex, {
  type VilkarresultatMedOverstyringProsessIndexProps,
} from './VilkarresultatMedOverstyringProsessIndex';
import { vilkarType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';

const vilkarOpptjening = [
  {
    vilkarType: vilkarType.OPPTJENINGSVILKÅRET,
    overstyrbar: true,
    relevanteInnvilgetMerknader: [{ innvilgetType: merknad.VM_7847_B, navn: 'Midlertidig inaktiv jf folketrygdloven § 8-47 B'}, { innvilgetType: merknad.VM_7847_A, navn: 'Midlertidig inaktiv jf folketrygdloven § 8-47 A'}],
    perioder: [
      {
        vilkarStatus: vilkårStatus.OPPFYLT,
        merknad: merknad.VM_7847_B,
        periode: {
          fom: '2020-01-30',
          tom: '2020-02-29',
        },
      },
      {
        vilkarStatus: vilkårStatus.OPPFYLT,
        merknad: merknad.UDEFINERT,
        periode: {
          fom: '2020-03-01',
          tom: '2020-03-31',
        },
      },
    ],
  },
];

const vilkarMedlemskap = [
  {
    vilkarType: vilkarType.MEDLEMSKAPSVILKÅRET,
    overstyrbar: true,
    relevanteInnvilgetMerknader: [],
    perioder: [
      {
        vilkarStatus: vilkårStatus.OPPFYLT,
        periode: {
          fom: '2020-01-30',
          tom: '2020-02-29',
        },
      },
    ],
  },
];

const meta = {
  title: 'gui/prosess/prosess-vilkar-overstyring/VilkarresultatMedOverstyringProsessIndex.tsx',
  component: VilkarresultatMedOverstyringProsessIndex,
} satisfies Meta<typeof VilkarresultatMedOverstyringProsessIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

const behandling = {
  id: 1,
  versjon: 1,
  type: behandlingType.FØRSTEGANGSSØKNAD,
  opprettet: '2020-01-01',
  sakstype: sakstype.UDEFINERT,
  status: behandlingStatus.OPPRETTET,
  uuid: 'testUuid',
};

const defaultArgs = {
  behandling,
  medlemskap: {
    fom: '2019-01-01',
  },
  aksjonspunkter: [],
  submitCallback: action('button-click'),
  lovReferanse: '§§ Dette er en lovreferanse',
  visPeriodisering: true,
  overrideReadOnly: false,
  kanOverstyreAccess: {
    isEnabled: true,
  },
  featureToggles: {},
  erOverstyrt: false,
  toggleOverstyring: action('button-click'),
  visAllePerioder: true,
};

export const VisOverstyringspanelForOpptjening: Story = {
  args: {
    ...defaultArgs,
    panelTittelKode: 'Opptjening',
    overstyringApKode: aksjonspunktkodeDefinisjonType.OVERSTYRING_AV_OPPTJENINGSVILKARET,
    vilkar: vilkarOpptjening,
    erMedlemskapsPanel: false,
  },
  play: async ({ canvas, step }) => {
    await step('Vis tabs med valgbare perioder', async () => {
      await expect(canvas.getByText('Perioder')).toBeInTheDocument();
      await expect(canvas.getByRole('button', { name: '30.01.2020 - 29.02.2020' })).toBeInTheDocument();
    });
    await step('Ikke vis submit-knapp når en er i readonly-modus', async () => {
      await expect(canvas.queryByRole('button', { name: 'Bekreft overstyring' })).not.toBeInTheDocument();
    });
  },
  render: (args: VilkarresultatMedOverstyringProsessIndexProps) => {
    const [erOverstyrt, toggleOverstyring] = React.useState(false);
    return (
      <VilkarresultatMedOverstyringProsessIndex
        {...args}
        erOverstyrt={erOverstyrt}
        toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
      />
    );
  },
};

export const VisOverstyringspanelForMedlemskap: Story = {
  args: {
    ...defaultArgs,
    panelTittelKode: 'Medlemskap',
    overstyringApKode: aksjonspunktkodeDefinisjonType.OVERSTYR_MEDLEMSKAPSVILKAR,
    vilkar: vilkarMedlemskap,
    erMedlemskapsPanel: true,
    lovReferanse: 'lovreferanse',
  },
  play: async ({ canvas, step }) => {
    await step('Vis overskrift og lovparagraf', async () => {
      await expect(canvas.getByRole('heading', { name: 'Medlemskap' })).toBeInTheDocument();
      await expect(canvas.getByText('lovreferanse')).toBeInTheDocument();
    });
  },
  render: (args: VilkarresultatMedOverstyringProsessIndexProps) => {
    const [erOverstyrt, toggleOverstyring] = React.useState(false);
    return (
      <VilkarresultatMedOverstyringProsessIndex
        {...args}
        erOverstyrt={erOverstyrt}
        toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
      />
    );
  },
};

export const VisOverstyrtAksjonspunktSomErBekreftet: Story = {
  args: {
    ...defaultArgs,
    aksjonspunkter: [
      {
        definisjon: aksjonspunktkodeDefinisjonType.OVERSTYRING_AV_OPPTJENINGSVILKARET,
        status: aksjonspunktStatus.UTFØRT,
        kanLoses: false,
        begrunnelse: 'Dette er en begrunnelse',
      },
    ],
    panelTittelKode: 'Opptjening',
    overstyringApKode: aksjonspunktkodeDefinisjonType.OVERSTYRING_AV_OPPTJENINGSVILKARET,
    vilkar: vilkarOpptjening,
    erMedlemskapsPanel: false,
  },
  render: (args: VilkarresultatMedOverstyringProsessIndexProps) => {
    const [erOverstyrt, toggleOverstyring] = React.useState(false);
    return (
      <VilkarresultatMedOverstyringProsessIndex
        {...args}
        erOverstyrt={erOverstyrt}
        toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
      />
    );
  },
};

export const VisOverstyrtAksjonspunktSomIkkeErBekreftet: Story = {
  args: {
    ...defaultArgs,
    aksjonspunkter: [
      {
        definisjon: aksjonspunktkodeDefinisjonType.OVERSTYRING_AV_OPPTJENINGSVILKARET,
        status: aksjonspunktStatus.OPPRETTET,
        kanLoses: true,
        begrunnelse: '',
      },
    ],
    panelTittelKode: 'Opptjening',
    overstyringApKode: aksjonspunktkodeDefinisjonType.OVERSTYRING_AV_OPPTJENINGSVILKARET,
    vilkar: [
      {
        vilkarType: vilkarType.OPPTJENINGSVILKÅRET,
        overstyrbar: true,
        relevanteInnvilgetMerknader: [{ merknad: merknad.VM_7847_B, navn: 'Midlertidig inaktiv jf folketrygdloven § 8-47 B'}, { merknad: merknad.VM_7847_A, navn: 'Midlertidig inaktiv jf folketrygdloven § 8-47 A'}],
        perioder: [
          {
            vilkarStatus: vilkårStatus.IKKE_VURDERT,
            merknad: merknad.VM_7847_B,
            periode: {
              fom: '2020-01-30',
              tom: '2020-02-29',
            },
            vurderesIBehandlingen: true,
          },
        ],
      },
    ],
    erMedlemskapsPanel: false,
    erOverstyrt: true,
    visAllePerioder: false,
  },
  play: async ({ canvas, step }) => {
    await step('Vis skjema ved overstyring', async () => {
      await expect(canvas.getByText('Manuell overstyring av automatisk vurdering')).toBeInTheDocument();
      await expect(canvas.getByTestId('overstyringform')).toBeInTheDocument();
      await expect(canvas.getByRole('button', { name: 'Bekreft overstyring' })).toBeInTheDocument();
    });
  },
  render: (args: VilkarresultatMedOverstyringProsessIndexProps) => {
    const [erOverstyrt, toggleOverstyring] = React.useState(true);
    return (
      <VilkarresultatMedOverstyringProsessIndex
        {...args}
        erOverstyrt={erOverstyrt}
        toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
      />
    );
  },
};

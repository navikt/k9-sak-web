import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { asyncAction } from '@k9-sak-web/gui/storybook/asyncAction.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { DirekteOvergangFaktaIndex } from './DirekteOvergangFaktaIndex.js';

const manglendePeriodeAksjonspunkt: AksjonspunktDto = {
  definisjon: AksjonspunktDefinisjon.TRENGER_SØKNAD_FOR_INFOTRYGD_PERIODE,
  status: aksjonspunktStatus.OPPRETTET,
};

const manglendePeriodeAnnenPartAksjonspunkt: AksjonspunktDto = {
  definisjon: AksjonspunktDefinisjon.TRENGER_SØKNAD_FOR_INFOTRYGD_PERIODE_ANNEN_PART,
  status: aksjonspunktStatus.OPPRETTET,
};

const meta = {
  title: 'gui/fakta/direkte-overgang/DirekteOvergangFaktaIndex.tsx',
  component: DirekteOvergangFaktaIndex,
  args: {
    readOnly: false,
    submittable: true,
    submitCallback: asyncAction('Løs aksjonspunkt'),
  },
} satisfies Meta<typeof DirekteOvergangFaktaIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const VisDirekteOvergangForManglendePeriode: Story = {
  args: {
    aksjonspunkter: [manglendePeriodeAksjonspunkt],
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.findByText(
        'Søker har perioder for 2022 i infotrygd. Disse periodene må tas inn før saken kan behandles videre.',
      ),
    ).resolves.toBeInTheDocument();
    await expect(
      canvas.queryByText(
        'Søknadsperioden overlapper med periode for berørt sak i infotrygd. Disse periodene må tas inn før saken kan behandles videre.',
      ),
    ).not.toBeInTheDocument();
  },
};

export const VisDirekteOvergangForManglendePeriodeAnnenPart: Story = {
  args: {
    aksjonspunkter: [manglendePeriodeAnnenPartAksjonspunkt],
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.findByText(
        'Søknadsperioden overlapper med periode for berørt sak i infotrygd. Disse periodene må tas inn før saken kan behandles videre.',
      ),
    ).resolves.toBeInTheDocument();
    await expect(
      canvas.queryByText(
        'Søker har perioder for 2022 i infotrygd. Disse periodene må tas inn før saken kan behandles videre.',
      ),
    ).not.toBeInTheDocument();
  },
};

export const VisDirekteOvergangForManglendePeriodeSøkerOgAnnenPart: Story = {
  args: {
    aksjonspunkter: [manglendePeriodeAksjonspunkt, manglendePeriodeAnnenPartAksjonspunkt],
  },
};

export const VisDirekteOvergangMedBlandedeAksjonspunktstatuser: Story = {
  args: {
    aksjonspunkter: [
      manglendePeriodeAksjonspunkt,
      {
        ...manglendePeriodeAnnenPartAksjonspunkt,
        status: aksjonspunktStatus.UTFØRT,
      },
    ],
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.findByText(
        'Kontroller perioder ved direkte overgang fra infotrygd. Dette aksjonspunktet krever spesielle rettigheter.',
      ),
    ).resolves.toBeInTheDocument();
    await expect(
      canvas.findByText(
        'Søker har perioder for 2022 i infotrygd. Disse periodene må tas inn før saken kan behandles videre.',
      ),
    ).resolves.toBeInTheDocument();
    await expect(
      canvas.findByText(
        'Søknadsperioden overlapper med periode for berørt sak i infotrygd. Disse periodene må tas inn før saken kan behandles videre.',
      ),
    ).resolves.toBeInTheDocument();
  },
};

export const VisDirekteOvergangReadOnly: Story = {
  args: {
    aksjonspunkter: [
      {
        ...manglendePeriodeAksjonspunkt,
        begrunnelse: 'Saksbehandler har vurdert at saken kan behandles videre.',
        status: aksjonspunktStatus.UTFØRT,
      },
    ],
    readOnly: true,
  },
};

import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import DirekteOvergangFaktaIndex from './DirekteOvergangFaktaIndex.js';

const manglendePeriodeAP: AksjonspunktDto = {
  aksjonspunktType: 'MANU',
  definisjon: '9007',
  erAktivt: true,
  kanLoses: true,
  status: 'OPPR',
  toTrinnsBehandling: true,
};

const manglendePeriodeAnnenPartAP: AksjonspunktDto = {
  aksjonspunktType: 'MANU',
  definisjon: '9008',
  erAktivt: true,
  kanLoses: true,
  status: 'OPPR',
  toTrinnsBehandling: true,
};

const meta = {
  title: 'gui/fakta/direkte-overgang/DirekteOvergangFaktaIndex',
  component: DirekteOvergangFaktaIndex,
  args: {
    submitCallback: fn(),
    readOnly: false,
    submittable: true,
  },
} satisfies Meta<typeof DirekteOvergangFaktaIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ManglendePeriode: Story = {
  args: {
    aksjonspunkter: [manglendePeriodeAP],
  },
};

export const ManglendePeriodeAnnenPart: Story = {
  args: {
    aksjonspunkter: [manglendePeriodeAnnenPartAP],
  },
};

export const ManglendePeriodeSøkerOgAnnenPart: Story = {
  args: {
    aksjonspunkter: [manglendePeriodeAP, manglendePeriodeAnnenPartAP],
  },
};

export const ReadOnly: Story = {
  args: {
    aksjonspunkter: [{ ...manglendePeriodeAP, begrunnelse: 'Perioden er kontrollert og godkjent.', status: 'UTFO' }],
    readOnly: true,
  },
};

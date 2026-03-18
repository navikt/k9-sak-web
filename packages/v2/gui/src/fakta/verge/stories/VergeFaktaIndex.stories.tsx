import { aksjonspunktkodeDefinisjonType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktkodeDefinisjon.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import VergeFaktaIndex from '../ui/VergeFaktaIndex.js';

const aksjonspunkter: AksjonspunktDto[] = [
  {
    definisjon: aksjonspunktkodeDefinisjonType.AVKLAR_VERGE,
    status: 'OPPR',
    begrunnelse: '',
    kanLoses: true,
  },
] as AksjonspunktDto[];

const meta = {
  title: 'gui/fakta/verge/VergeFaktaIndex',
  component: VergeFaktaIndex,
} satisfies Meta<typeof VergeFaktaIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    aksjonspunkter,
    submitCallback: action('submitCallback'),
    readOnly: false,
    harApneAksjonspunkter: true,
    submittable: true,
  },
};

export const ReadOnly: Story = {
  args: {
    aksjonspunkter: [
      {
        definisjon: aksjonspunktkodeDefinisjonType.AVKLAR_VERGE,
        status: 'UTFO',
        begrunnelse: 'Signatur fra verge er mottatt.',
        kanLoses: false,
      } as AksjonspunktDto,
    ],
    submitCallback: action('submitCallback'),
    readOnly: true,
    harApneAksjonspunkter: false,
    submittable: false,
  },
};

export const EmptyState: Story = {
  args: {
    aksjonspunkter: [],
    submitCallback: action('submitCallback'),
    readOnly: false,
    harApneAksjonspunkter: false,
    submittable: false,
  },
};

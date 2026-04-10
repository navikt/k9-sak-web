import { ung_kodeverk_vilkår_VilkårType } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { asyncAction } from '../../storybook/asyncAction';
import { ForutgåendeMedlemskap } from './ForutgåendeMedlemskap';

const meta = {
  title: 'gui/prosess/aktivitetspenger-forutgående-medlemskap/ForutgåendeMedlemskap',
  component: ForutgåendeMedlemskap,
  args: {
    submitCallback: asyncAction('submitCallback'),
    aksjonspunkt: { definisjon: AksjonspunktDefinisjon.AVKLAR_GYLDIG_MEDLEMSKAP },
    readOnly: false,
    forutgåendeMedlemskap: [
      { land: 'Sverige', landkode: 'SWE', harTrygdeavtale: true, periode: { fom: '2022-01-01', tom: '2022-12-31' } },
      { land: 'USA', landkode: 'USA', harTrygdeavtale: false, periode: { fom: '2023-01-01', tom: '2023-06-30' } },
    ],
  },
} satisfies Meta<typeof ForutgåendeMedlemskap>;
export default meta;

type Story = StoryObj<typeof meta>;

export const IkkeVurdert: Story = {
  args: {
    vilkår: {
      vilkarType: ung_kodeverk_vilkår_VilkårType.FORUTGÅENDE_MEDLEMSKAPSVILKÅRET,
      perioder: [
        { periode: { fom: '2022-01-01', tom: '2022-12-31' }, vilkarStatus: Utfall.IKKE_VURDERT },
        { periode: { fom: '2023-01-01', tom: '2023-06-30' }, vilkarStatus: Utfall.IKKE_VURDERT },
      ],
    },
  },
};

export const DelvisVurdert: Story = {
  args: {
    vilkår: {
      vilkarType: ung_kodeverk_vilkår_VilkårType.FORUTGÅENDE_MEDLEMSKAPSVILKÅRET,
      perioder: [
        { periode: { fom: '2022-01-01', tom: '2022-12-31' }, vilkarStatus: Utfall.OPPFYLT },
        { periode: { fom: '2023-01-01', tom: '2023-06-30' }, vilkarStatus: Utfall.IKKE_VURDERT },
      ],
    },
  },
};

export const AlleOppfylt: Story = {
  args: {
    vilkår: {
      vilkarType: ung_kodeverk_vilkår_VilkårType.FORUTGÅENDE_MEDLEMSKAPSVILKÅRET,
      perioder: [
        { periode: { fom: '2022-01-01', tom: '2022-12-31' }, vilkarStatus: Utfall.OPPFYLT },
        { periode: { fom: '2023-01-01', tom: '2023-06-30' }, vilkarStatus: Utfall.OPPFYLT },
      ],
    },
  },
};

export const MedAvslag: Story = {
  args: {
    vilkår: {
      vilkarType: ung_kodeverk_vilkår_VilkårType.FORUTGÅENDE_MEDLEMSKAPSVILKÅRET,
      perioder: [
        { periode: { fom: '2022-01-01', tom: '2022-12-31' }, vilkarStatus: Utfall.OPPFYLT },
        { periode: { fom: '2023-01-01', tom: '2023-06-30' }, vilkarStatus: Utfall.IKKE_OPPFYLT },
      ],
    },
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    vilkår: {
      vilkarType: ung_kodeverk_vilkår_VilkårType.FORUTGÅENDE_MEDLEMSKAPSVILKÅRET,
      perioder: [
        { periode: { fom: '2022-01-01', tom: '2022-12-31' }, vilkarStatus: Utfall.OPPFYLT },
        { periode: { fom: '2023-01-01', tom: '2023-06-30' }, vilkarStatus: Utfall.IKKE_OPPFYLT },
      ],
    },
  },
};

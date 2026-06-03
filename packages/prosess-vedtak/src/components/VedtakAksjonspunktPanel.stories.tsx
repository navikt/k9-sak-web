import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import withKodeverkContext from '@k9-sak-web/gui/storybook/decorators/withKodeverkContext.js';
import type {
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  k9_sak_kontrakt_ytelser_OverlappendeYtelseDto as OverlappendeYtelseDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { Formik } from 'formik';
import React from 'react';
import { createIntl, RawIntlProvider } from 'react-intl';
import { expect, fn, userEvent, within } from 'storybook/test';
import messages from '../../i18n/nb_NO.json';
import { VedtakAksjonspunktPanel } from './VedtakAksjonspunktPanel.js';

const intl = createIntl({ locale: 'nb-NO', messages });

const withProviders: Decorator = Story => (
  <RawIntlProvider value={intl}>
    <Formik initialValues={{}} onSubmit={() => {}}>
      <Story />
    </Formik>
  </RawIntlProvider>
);

const overlappendeYtelser = [
  {
    kilde: 'INFOTRYGD',
    ytelseType: 'SP',
    overlappendePerioder: [{ fom: '2025-01-01', tom: '2025-02-28' }],
  },
] satisfies OverlappendeYtelseDto[];

const aksjonspunkt5040Oppr = {
  definisjon: '5040',
  status: 'OPPR',
  kanLoses: true,
  erAktivt: true,
} satisfies AksjonspunktDto;

const aksjonspunkt5040Utfort = {
  definisjon: '5040',
  status: 'UTFO',
  begrunnelse: 'Sjekket og vurdert',
  kanLoses: false,
  erAktivt: false,
} satisfies AksjonspunktDto;

const meta = {
  title: 'prosess/prosess-vedtak/VedtakAksjonspunktPanel',
  component: VedtakAksjonspunktPanel,
  decorators: [withProviders, withKodeverkContext()],
  args: {
    behandlingStatusKode: behandlingStatus.BEHANDLING_UTREDES,
    readOnly: false,
    overlappendeYtelser: [],
    aksjonspunkter: [],
    viseFlereSjekkbokserForBrev: false,
    harVurdertOverlappendeYtelse: false,
    setHarVurdertOverlappendeYtelse: fn(),
    submitCallback: fn(),
  },
} satisfies Meta<typeof VedtakAksjonspunktPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MedOverlappendeYtelserUbehandlet: Story = {
  args: {
    overlappendeYtelser,
    aksjonspunkter: [aksjonspunkt5040Oppr],
  },
};

export const MedOverlappendeYtelserReadOnly: Story = {
  args: {
    overlappendeYtelser,
    aksjonspunkter: [aksjonspunkt5040Oppr],
    readOnly: true,
  },
};

export const MedOverlappendeYtelserUtfort: Story = {
  args: {
    overlappendeYtelser,
    aksjonspunkter: [aksjonspunkt5040Utfort],
    harVurdertOverlappendeYtelse: true,
  },
};

export const CheckboxErDisabledNårUtfort: Story = {
  args: {
    overlappendeYtelser,
    aksjonspunkter: [aksjonspunkt5040Utfort],
    harVurdertOverlappendeYtelse: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Checkbox er avkrysset og disabled når aksjonspunktet er utført', async () => {
      const checkbox = canvas.getByRole('checkbox', {
        name: 'Jeg bekrefter å ha sjekket og fulgt opp overlappende ytelser',
      });
      await expect(checkbox).toBeChecked();
      await expect(checkbox).toBeDisabled();
    });
  },
};

export const CheckboxErInteraktivNårIkkeUtfort: Story = {
  args: {
    overlappendeYtelser,
    aksjonspunkter: [aksjonspunkt5040Oppr],
    harVurdertOverlappendeYtelse: false,
    setHarVurdertOverlappendeYtelse: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);

    await step('Checkbox er ikke avkrysset og kan klikkes', async () => {
      const checkbox = canvas.getByRole('checkbox', {
        name: 'Jeg bekrefter å ha sjekket og fulgt opp overlappende ytelser',
      });
      await expect(checkbox).not.toBeChecked();
      await expect(checkbox).not.toBeDisabled();
      await userEvent.click(checkbox);
      await expect(args.setHarVurdertOverlappendeYtelse).toHaveBeenCalledWith(true);
    });
  },
};

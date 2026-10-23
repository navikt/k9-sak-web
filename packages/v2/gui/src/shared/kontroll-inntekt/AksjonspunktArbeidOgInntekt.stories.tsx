import type { KontrollerInntektPeriodeDto } from '@k9-sak-web/backend/ungsak/kontrakt/kontroll/KontrollerInntektPeriodeDto.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { withFormProvider } from '../../storybook/decorators/withFormProvider.js';
import withUngKodeverkoppslag from '../../storybook/decorators/withUngKodeverkoppslag.js';
import { AksjonspunktArbeidOgInntekt } from './AksjonspunktArbeidOgInntekt';

const periode = { fom: '2025-02-01', tom: '2025-02-28' };

const inntektKontrollPeriode = {
  erTilVurdering: true,
  periode,
  rapporterteInntekter: { bruker: {}, register: { oppsummertRegister: { arbeidsinntekt: 1500 } } },
  status: 'AVVIK',
  uttalelseFraBruker: 'Jeg fikk forskuttert litt lønn av arbeidsgiver denne måneden.',
} satisfies KontrollerInntektPeriodeDto;

const formProviderId = 'aksjonspunktArbeidOgInntekt';

const meta = {
  title: 'gui/shared/kontroll-inntekt/AksjonspunktArbeidOgInntekt',
  component: AksjonspunktArbeidOgInntekt,
  args: {
    harBrukerrapportertInntekt: false,
    isSubmitting: false,
    isReadOnly: false,
    periode,
    fieldIndex: 0,
    inntektKontrollPeriode,
    arbeidsgivere: { arbeidsgivere: {} },
    isAktivitetspenger: true,
  },
  decorators: [
    withUngKodeverkoppslag(),
    withFormProvider(formProviderId, {
      defaultValues: {
        perioder: [{ begrunnelse: '', valg: '', fastsattInntekt: '' }],
      },
    }),
  ],
} satisfies Meta<typeof AksjonspunktArbeidOgInntekt>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AktivitetspengerMedLovreferanse: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Viser lovreferansen som en lenke i labelen', async () => {
      const link = canvas.getByRole('link', {
        name: 'jf. § 14 Reduksjon av ytelsen på grunn av inntekt.',
      });
      await expect(link).toHaveAttribute('href', 'https://lovdata.no/pro/#document/LF/forskrift/2026-09-27-1944/§14');
      await expect(
        canvas.getByLabelText(/Vurder hvilken inntekt som skal gi reduksjon i perioden/),
      ).toBeInTheDocument();
    });
  },
};

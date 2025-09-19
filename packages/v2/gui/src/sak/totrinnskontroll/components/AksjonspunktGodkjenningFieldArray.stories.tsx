import AksjonspunktGodkjenningFieldArray, {
  type AksjonspunktGodkjenningData,
} from './AksjonspunktGodkjenningFieldArray.js';
import type { Meta, StoryObj } from '@storybook/react';
import { SkjermlenkeType } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/SkjermlenkeType.js';
import { oppslagKodeverkSomObjektK9Sak } from '../../../kodeverk/mocks/oppslagKodeverkSomObjektK9Sak.js';
import withFeatureToggles from '../../../storybook/decorators/withFeatureToggles.js';
import { withFormProvider } from '../../../storybook/decorators/withFormProvider.js';
import type { FormState } from './FormState.js';
import { expect, userEvent } from 'storybook/test';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { UseFormReturn } from 'react-hook-form';
import { Klagevurdering } from '@k9-sak-web/backend/k9klage/kodeverk/Klagevurdering.js';

const aksjonspunktKode1 = AksjonspunktDefinisjon.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS;
const aksjonspunktGodkjenningData1: AksjonspunktGodkjenningData = {
  aksjonspunktKode: aksjonspunktKode1,
};

const formProviderId = 'totrinnskontrollForm';

const meta = {
  title: 'gui/sak/totrinnskontroll/components/AksjonspunktGodkjenningFieldArray',
  component: AksjonspunktGodkjenningFieldArray,
  decorators: [withFeatureToggles({})],
} satisfies Meta<typeof AksjonspunktGodkjenningFieldArray>;

export default meta;

type Story = StoryObj<typeof meta>;

const { arbeidsforholdHandlingTyper, skjermlenkeTyper } = oppslagKodeverkSomObjektK9Sak;

export const Default: Story = {
  decorators: [
    withFormProvider<FormState>(formProviderId, {
      defaultValues: { aksjonspunktGodkjenning: [aksjonspunktGodkjenningData1] },
    }),
  ],
  args: {
    totrinnskontrollSkjermlenkeContext: [
      {
        skjermlenkeTypeEnum: SkjermlenkeType.BEREGNING,
        skjermlenkeType: SkjermlenkeType.BEREGNING,
        totrinnskontrollAksjonspunkter: [
          {
            aksjonspunktKode: aksjonspunktKode1,
            aksjonspunktDefinisjon: aksjonspunktKode1,
            beregningDtoer: [
              {
                fastsattVarigEndringNaering: false,
                faktaOmBeregningTilfeller: undefined,
                skjæringstidspunkt: '2020-01-01',
              },
            ],
            besluttersBegrunnelse: undefined,
            totrinnskontrollGodkjent: undefined,
            vurderPaNyttArsaker: [],
            arbeidsforholdDtos: [],
          },
          {
            aksjonspunktKode: '5039',
            aksjonspunktDefinisjon: '5039',
            beregningDtoer: [
              {
                fastsattVarigEndringNaering: true,
                fastsattVarigEndring: true,
                faktaOmBeregningTilfeller: undefined,
                skjæringstidspunkt: '2020-01-01',
              },
              {
                fastsattVarigEndringNaering: false,
                fastsattVarigEndring: false,
                faktaOmBeregningTilfeller: undefined,
                skjæringstidspunkt: '2020-02-01',
              },
            ],
            besluttersBegrunnelse: undefined,
            totrinnskontrollGodkjent: undefined,
            vurderPaNyttArsaker: [],
            arbeidsforholdDtos: [],
          },
        ],
      },
    ],
    readOnly: false,
    behandlingStatus: 'FVED',
    arbeidsforholdHandlingTyper,
    skjermlenkeTyper,
  },
  play: async ({ canvas, step, loaded }) => {
    await step('Initiell state er ok', async () => {
      await expect(canvas.getByRole('link', { name: 'Beregning' })).toBeVisible();
      await expect(canvas.getByText('Inntekt er skjønnsmessig fastsatt.')).toBeVisible();
    });
    await step('Godkjendt viser korrekt', async () => {
      const godkjentRadio = canvas.getByRole('radio', { name: 'Godkjent' });
      await userEvent.click(godkjentRadio);
      await expect(canvas.queryByRole('textbox', { name: 'Begrunnelse' })).not.toBeInTheDocument();
      await expect(canvas.queryByRole('checkbox', { name: 'Feil fakta' })).not.toBeInTheDocument();
    });
    await step('Vurder på nytt fungerer', async () => {
      const vurderPåNyttRadio = canvas.getByRole('radio', { name: 'Vurder på nytt' });
      await userEvent.click(vurderPåNyttRadio);
      const textBox = canvas.getByRole('textbox', { name: 'Begrunnelse' });
      await expect(textBox).toBeVisible();
      const feilFaktaCheckBox = canvas.getByRole('checkbox', { name: 'Feil fakta' });
      await expect(feilFaktaCheckBox).toBeInTheDocument();
      await userEvent.click(feilFaktaCheckBox);
      await userEvent.type(textBox, 'Utfyllt begrunnelse tekst');
      const submitBtn = canvas.getByTestId(`${formProviderId}-Submit`);
      await userEvent.click(submitBtn);
      const {
        formState: { isValid, errors, isSubmitted },
        getValues,
      }: UseFormReturn<FormState> = loaded[formProviderId];
      await expect(isValid).toBeTruthy();
      await expect(errors).toEqual({});
      await expect(isSubmitted).toBeTruthy();
      await expect(getValues()).toEqual({
        aksjonspunktGodkjenning: [
          {
            aksjonspunktKode: '5038',
            annet: undefined,
            besluttersBegrunnelse: 'Utfyllt begrunnelse tekst',
            feilFakta: true,
            feilLov: undefined,
            feilRegel: undefined,
            totrinnskontrollGodkjent: false,
          },
        ],
      });
    });
  },
};

const klageAksjonspunktKode = AksjonspunktDefinisjon.MANUELL_VURDERING_AV_KLAGE_NK;
export const klageKA: Story = {
  decorators: [
    withFormProvider<FormState>(formProviderId, {
      defaultValues: { aksjonspunktGodkjenning: [{ aksjonspunktKode: klageAksjonspunktKode }] },
    }),
  ],
  args: {
    ...Default.args,
    totrinnskontrollSkjermlenkeContext: [
      {
        skjermlenkeTypeEnum: SkjermlenkeType.BEREGNING,
        skjermlenkeType: SkjermlenkeType.BEREGNING,
        totrinnskontrollAksjonspunkter: [
          {
            aksjonspunktKode: klageAksjonspunktKode,
            aksjonspunktDefinisjon: klageAksjonspunktKode,
            besluttersBegrunnelse: undefined,
            totrinnskontrollGodkjent: undefined,
            vurderPaNyttArsaker: [],
            arbeidsforholdDtos: [],
          },
        ],
      },
    ],
    klagebehandlingVurdering: {
      klageVurderingResultatNK: {
        klageVurdering: Klagevurdering.STADFESTE_YTELSESVEDTAK,
        begrunnelse: 'klage resultat begrunnelse',
      },
    },
    klageKA: true, // Settast true når klagebehandlingVurdering.klageVurderingResultatNK ikkje er undefined (i TotrinnskontrollBeslutterForm.tsx)
  },
  play: async ({ canvas }) => {
    const godkjentRadio = canvas.getByRole('radio', { name: 'Godkjent' });
    await userEvent.click(godkjentRadio);
    await expect(canvas.getByRole('textbox', { name: 'Begrunnelse' })).toBeVisible();
    await expect(canvas.queryByRole('checkbox', { name: 'Feil fakta' })).not.toBeInTheDocument();
  },
};

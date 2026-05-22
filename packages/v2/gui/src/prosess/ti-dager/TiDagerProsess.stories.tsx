import type { RettFraDagEnVisningDto } from '@k9-sak-web/backend/k9sak/kontrakt/inngangsvilkår/RettFraDagEnVisningDto.js';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { asyncAction } from '../../storybook/asyncAction.js';
import { mockArbeidsgiverOpplysninger } from '../../storybook/mocks/FakeTilkjentYtelseBackendApi.js';
import type { TiDagerBackendApiType } from './TiDagerBackendApiType.js';
import { TiDagerBackendClientContext } from './TiDagerBackendClientContext.js';
import { TiDagerProsessIndex } from './TiDagerProsess.js';

const opplysningerEnArbeidsgiver: RettFraDagEnVisningDto = {
  journalposter: [
    {
      journalpostId: 'JP-001',
      dokumentId: 'DOK-001',
      arbeidsgiver: { arbeidsgiverOrgnr: '910909088' },
      foersteOppgitteFravaersdag: '2024-03-01',
      harUtbetaltPliktigeDager: undefined,
    },
  ],
};

const opplysningerFlereArbeidsgivere: RettFraDagEnVisningDto = {
  journalposter: [
    {
      journalpostId: 'JP-001',
      dokumentId: 'DOK-001',
      arbeidsgiver: { arbeidsgiverOrgnr: '910909088' },
      foersteOppgitteFravaersdag: '2024-03-01',
      harUtbetaltPliktigeDager: undefined,
    },
    {
      journalpostId: 'JP-002',
      dokumentId: 'DOK-002',
      arbeidsgiver: { arbeidsgiverOrgnr: '973861778' },
      foersteOppgitteFravaersdag: '2024-03-15',
      harUtbetaltPliktigeDager: true,
    },
  ],
};

const opplysningerAlleredeVurdert: RettFraDagEnVisningDto = {
  journalposter: [
    {
      journalpostId: 'JP-001',
      dokumentId: 'DOK-001',
      arbeidsgiver: { arbeidsgiverOrgnr: '910909088' },
      foersteOppgitteFravaersdag: '2024-03-01',
      harUtbetaltPliktigeDager: true,
    },
  ],
};

const aksjonspunkter = [{ definisjon: { kode: 'VURDER_RETT_FRA_DAG_EN' } }];

const withFakeTiDagerBackend = (opplysninger: RettFraDagEnVisningDto): Decorator => {
  const fakeApi: TiDagerBackendApiType = {
    hentRettFraDagEnOpplysninger: async () => opplysninger,
  };
  return Story => (
    <TiDagerBackendClientContext value={fakeApi}>
      <Story />
    </TiDagerBackendClientContext>
  );
};

const meta = {
  title: 'gui/prosess/ti-dager/TiDagerProsess',
  component: TiDagerProsessIndex,
  args: {
    aksjonspunkter,
    isReadOnly: false,
    behandlingUUID: 'test-uuid',
    saksnummer: '123456789',
    arbeidsgiverOpplysningerPerId: mockArbeidsgiverOpplysninger,
    submitCallback: asyncAction('submitCallback'),
  },
} satisfies Meta<typeof TiDagerProsessIndex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EnArbeidsgiver: Story = {
  decorators: [withFakeTiDagerBackend(opplysningerEnArbeidsgiver)],
};

export const FlereArbeidsgivere: Story = {
  decorators: [withFakeTiDagerBackend(opplysningerFlereArbeidsgivere)],
};

export const AlleredeVurdert: Story = {
  decorators: [withFakeTiDagerBackend(opplysningerAlleredeVurdert)],
  args: { isReadOnly: true },
};

export const VisValideringsfeil: Story = {
  decorators: [withFakeTiDagerBackend(opplysningerEnArbeidsgiver)],
  play: async ({ canvas }) => {
    const button = await canvas.findByRole('button', { name: 'Bekreft' });
    await userEvent.click(button);
    const valideringsfeilmeldinger = await canvas.findAllByText('Feltet er påkrevd');
    await expect(valideringsfeilmeldinger).toHaveLength(2);
    await expect(
      await canvas.findByRole('textbox', {
        name: 'Fyller den ansatte vilkår for å få omsorgspenger fra første dag?',
      }),
    ).toBeInvalid();
  },
};

export const SendInnVurdering: Story = {
  decorators: [withFakeTiDagerBackend(opplysningerEnArbeidsgiver)],
  args: { submitCallback: fn() },
  play: async ({ canvas, args, step }) => {
    await step('Velg Ja og fyll begrunnelse', async () => {
      const jaRadio = await canvas.findByRole('radio', { name: 'Ja' });
      await userEvent.click(jaRadio);
      const begrunnelse = await canvas.findByRole('textbox', {
        name: 'Fyller den ansatte vilkår for å få omsorgspenger fra første dag?',
      });
      await userEvent.type(begrunnelse, 'Arbeidsgiver har rett fra første dag.');
    });
    await step('Klikk Bekreft og verifiser innsending', async () => {
      const button = await canvas.findByRole('button', { name: 'Bekreft' });
      await userEvent.click(button);
      await expect(args.submitCallback).toHaveBeenCalledOnce();
    });
  },
};

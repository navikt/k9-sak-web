import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import type { RettFraDagEnVisningDto } from '@k9-sak-web/backend/k9sak/kontrakt/inngangsvilkår/RettFraDagEnVisningDto.js';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { asyncAction } from '../../storybook/asyncAction.js';
import type { TiDagerBackendApiType } from './TiDagerBackendApiType.js';
import { TiDagerBackendClientContext } from './TiDagerBackendClientContext.js';
import { TiDagerProsessIndex } from './TiDagerProsessIndex.js';

const opplysningerEnArbeidsgiver: RettFraDagEnVisningDto = {
  journalposter: [
    {
      journalpostId: 'JP-001',
      dokumentId: 'DOK-001',
      arbeidsgiver: { arbeidsgiverOrgnr: '910909088' },
      foersteOppgitteFravaersdag: '2026-04-07',
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
      foersteOppgitteFravaersdag: '2026-04-07',
      harUtbetaltPliktigeDager: undefined,
    },
    {
      journalpostId: 'JP-002',
      dokumentId: 'DOK-002',
      arbeidsgiver: { arbeidsgiverOrgnr: '973861778' },
      foersteOppgitteFravaersdag: '2026-04-08',
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
      foersteOppgitteFravaersdag: '2026-04-07',
      harUtbetaltPliktigeDager: true,
    },
  ],
};

const opplysningerToPerioder: RettFraDagEnVisningDto = {
  journalposter: [
    {
      journalpostId: 'JP-101',
      dokumentId: 'DOK-101',
      arbeidsgiver: { arbeidsgiverOrgnr: '973861778' },
      foersteOppgitteFravaersdag: '2026-04-07',
      harUtbetaltPliktigeDager: undefined,
    },
    {
      journalpostId: 'JP-202',
      dokumentId: 'DOK-202',
      arbeidsgiver: { arbeidsgiverOrgnr: '910909088' },
      foersteOppgitteFravaersdag: '2026-04-15',
      harUtbetaltPliktigeDager: undefined,
    },
  ],
};

const opplysningerIngenJournalposter: RettFraDagEnVisningDto = {
  journalposter: [],
};

const aksjonspunkter = [
  {
    definisjon: AksjonspunktDefinisjon.VURDER_RETT_FRA_DAG_EN,
    begrunnelse: '',
    status: aksjonspunktStatus.OPPRETTET,
  },
];

const arbeidsgiverOpplysningerPerId = {
  '910909088': { navn: 'Arbeidsgiver AS' },
  '973861778': { navn: 'Eksempelbedrift AS' },
};

const tekstMatcher = (tekst: string) => (_: string, element: Element | null) =>
  element?.textContent?.replace(/\s+/g, ' ').trim() === tekst;

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
  title: 'gui/prosess/ti-dager/TiDagerProsessIndex',
  component: TiDagerProsessIndex,
  args: {
    aksjonspunkter,
    isReadOnly: false,
    behandlingUUID: 'test-uuid',
    saksnummer: '123456789',
    arbeidsgiverOpplysningerPerId,
    submitCallback: asyncAction('submitCallback'),
    vilkar: [
      {
        vilkarType: 'K9_VK_9_8',
        lovReferanse: '9-8 tredje ledd',
        overstyrbar: true,
        perioder: [
          {
            avslagKode: undefined,
            merknadParametere: {},
            vilkarStatus: 'IKKE_VURDERT',
            periode: {
              fom: '2026-04-06',
              tom: '2026-04-10',
            },
            begrunnelse: undefined,
            vurderesIBehandlingen: true,
            vurdersIBehandlingen: true,
            merknad: '-',
          },
        ],
        relevanteInnvilgetMerknader: [],
      },
    ],
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

export const UtførtAksjonspunkt: Story = {
  decorators: [withFakeTiDagerBackend(opplysningerAlleredeVurdert)],
  args: {
    isReadOnly: false,
    aksjonspunkter: [
      {
        definisjon: AksjonspunktDefinisjon.VURDER_RETT_FRA_DAG_EN,
        begrunnelse: 'Arbeidsgiver har rett fra første dag grunnet kronisk sykt barn.',
        status: aksjonspunktStatus.UTFØRT,
      },
    ],
  },
  play: async ({ canvas, step }) => {
    await step('Lås opp skjemaet og vis Bekreft', async () => {
      await expect(canvas.queryByRole('button', { name: 'Bekreft' })).toBeNull();
      const redigerButton = await canvas.findByRole('button', { name: 'Rediger vurdering' });
      await userEvent.click(redigerButton);
      await expect(await canvas.findByRole('button', { name: 'Bekreft' })).toBeEnabled();
    });
  },
};

export const VisValideringsfeil: Story = {
  args: {
    behandlingUUID: 'vis-valideringsfeil-uuid',
  },
  decorators: [withFakeTiDagerBackend(opplysningerEnArbeidsgiver)],
  play: async ({ canvas }) => {
    const button = await canvas.findByRole('button', { name: 'Bekreft' });
    await userEvent.click(button);
    const valideringsfeilmeldinger = await canvas.findAllByText('Feltet er påkrevd');
    await expect(valideringsfeilmeldinger).toHaveLength(2);
    await expect(
      await canvas.findByRole('textbox', {
        name: 'Vurder om den ansatte fyller vilkår for å få omsorgspenger fra første dag',
      }),
    ).toBeInvalid();
  },
};

export const SendInnVurdering: Story = {
  decorators: [withFakeTiDagerBackend(opplysningerEnArbeidsgiver)],
  args: {
    submitCallback: fn(),
    behandlingUUID: 'send-inn-vurdering-uuid',
  },
  play: async ({ canvas, args, step }) => {
    await step('Velg Ja og fyll begrunnelse', async () => {
      const jaRadio = await canvas.findByRole('radio', { name: 'Ja' });
      await userEvent.click(jaRadio);
      const begrunnelse = await canvas.findByRole('textbox', {
        name: 'Vurder om den ansatte fyller vilkår for å få omsorgspenger fra første dag',
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

export const OppfyltVilkårUtenJournalposter: Story = {
  decorators: [withFakeTiDagerBackend(opplysningerIngenJournalposter)],
  args: {
    aksjonspunkter: [],
    behandlingUUID: 'oppfylt-vilkar-uten-journalposter-uuid',
    vilkar: [
      {
        vilkarType: 'K9_VK_9_8',
        lovReferanse: '9-8 tredje ledd',
        overstyrbar: true,
        perioder: [
          {
            avslagKode: undefined,
            merknadParametere: {},
            vilkarStatus: 'OPPFYLT',
            periode: {
              fom: '2026-04-06',
              tom: '2026-04-10',
            },
            begrunnelse: undefined,
            vurderesIBehandlingen: true,
            vurdersIBehandlingen: true,
            merknad: '-',
          },
        ],
        relevanteInnvilgetMerknader: [],
      },
    ],
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('heading', { name: 'Ti dager' })).toBeVisible();
    await expect(await canvas.findByText('10 dager har blitt dekket')).toBeVisible();
    await expect(canvas.queryByRole('button', { name: 'Bekreft' })).toBeNull();
  },
};

export const ToPerioderKombineresISidemeny: Story = {
  decorators: [withFakeTiDagerBackend(opplysningerToPerioder)],
  args: {
    behandlingUUID: 'bytt-periode-uuid',
    vilkar: [
      {
        vilkarType: 'K9_VK_9_8',
        lovReferanse: '9-8 tredje ledd',
        overstyrbar: true,
        perioder: [
          {
            avslagKode: undefined,
            merknadParametere: {},
            vilkarStatus: 'IKKE_VURDERT',
            periode: {
              fom: '2026-04-06',
              tom: '2026-04-10',
            },
            begrunnelse: undefined,
            vurderesIBehandlingen: true,
            vurdersIBehandlingen: true,
            merknad: '-',
          },
          {
            avslagKode: undefined,
            merknadParametere: {},
            vilkarStatus: 'IKKE_VURDERT',
            periode: {
              fom: '2026-04-14',
              tom: '2026-04-18',
            },
            begrunnelse: undefined,
            vurderesIBehandlingen: true,
            vurdersIBehandlingen: true,
            merknad: '-',
          },
        ],
        relevanteInnvilgetMerknader: [],
      },
    ],
  },
  play: async ({ canvas, step }) => {
    await step('Sidemeny viser kombinert periode fra tidligste til seneste dato', async () => {
      await expect(await canvas.findByRole('button', { name: '06.04.2026 - 18.04.2026' })).toBeVisible();
    });

    await step('Begge arbeidsgivere er synlige samtidig', async () => {
      await expect(await canvas.findByText(tekstMatcher('Eksempelbedrift AS'))).toBeVisible();
      await expect(await canvas.findByText(tekstMatcher('Arbeidsgiver AS'))).toBeVisible();
    });
  },
};

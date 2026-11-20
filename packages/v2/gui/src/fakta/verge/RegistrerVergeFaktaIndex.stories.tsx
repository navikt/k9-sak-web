import type { AksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import type { VergeDto } from '@k9-sak-web/backend/combined/kontrakt/verge/VergeDto.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useQueryClient } from '@tanstack/react-query';
import { type ComponentProps, useState } from 'react';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { withFakeVergeApi } from '../../storybook/decorators/withFakeVergeApi.js';
import withK9Kodeverkoppslag from '../../storybook/decorators/withK9Kodeverkoppslag.js';
import withUngKodeverkoppslag from '../../storybook/decorators/withUngKodeverkoppslag.js';
import { useVergeApi } from './api/VergeApiContext.js';
import { vergeQueryOptions } from './api/vergeQueryOptions.js';
import RegistrerVergeFaktaIndex, { type RegistrerVergeAksjonspunkt } from './RegistrerVergeFaktaIndex.js';

type Props = ComponentProps<typeof RegistrerVergeFaktaIndex>;

// Syntetisk fødselsnummer fra eksisterende storybook-mock (storybook/mocks/personopplysninger.ts).
const syntetiskFnr = '25848395245';

/**
 * Fake backend per historie. Lagring i skallet simuleres ved å lagre registreringen her. Hver henting gir et nytt
 * objekt, som et svar fra backend.
 */
const lagFakeVergeBackend = (lagret: Record<string, VergeDto | null>) => ({
  hentVerge: async (behandlingUuid: string) => {
    const verge = lagret[behandlingUuid];
    return verge ? { ...verge } : null;
  },
  endre: (behandlingUuid: string, verge: VergeDto) => {
    lagret[behandlingUuid] = verge;
  },
  lagre: (behandlingUuid: string, aksjonspunkt: RegistrerVergeAksjonspunkt) => {
    const { vergeType, navn, fnr, organisasjonsnummer, gyldigFom, gyldigTom, begrunnelse } = aksjonspunkt;
    lagret[behandlingUuid] = { vergeType, navn, fnr, organisasjonsnummer, gyldigFom, gyldigTom, begrunnelse };
  },
});

interface SimulertBehandlingProps extends Props {
  lagre: (behandlingUuid: string, aksjonspunkt: RegistrerVergeAksjonspunkt) => void;
  annenBehandlingUuid?: string;
  kanHentePåNytt?: boolean;
}

/**
 * Simulerer skallet: vellykket lagring gir ny behandlingsversjon og løst aksjonspunkt, og verge hentes på nytt.
 * Valgfritt kan historien bytte til en annen behandling.
 */
const MedSimulertBehandling = ({ lagre, annenBehandlingUuid, kanHentePåNytt, ...args }: SimulertBehandlingProps) => {
  const api = useVergeApi();
  const queryClient = useQueryClient();
  const [fullførteHentinger, setFullførteHentinger] = useState(0);
  const [behandlingUuid, setBehandlingUuid] = useState(args.behandlingUuid);
  const [behandlingVersjon, setBehandlingVersjon] = useState(args.behandlingVersjon);
  const [status, setStatus] = useState<AksjonspunktStatus | undefined>(args.aksjonspunktStatus);
  const submitCallback = async (aksjonspunkter: [RegistrerVergeAksjonspunkt]) => {
    await args.submitCallback(aksjonspunkter);
    lagre(behandlingUuid, aksjonspunkter[0]);
    setBehandlingVersjon(versjon => versjon + 1);
    setStatus(aksjonspunktStatus.UTFØRT);
  };
  // Henter verge på nytt med samme behandling og versjon, slik en ny henting av lagrede data gjør.
  const hentPåNytt = async () => {
    await queryClient.refetchQueries({
      queryKey: vergeQueryOptions(api, behandlingUuid, behandlingVersjon).queryKey,
      exact: true,
    });
    setFullførteHentinger(antall => antall + 1);
  };
  return (
    <>
      {kanHentePåNytt && (
        <>
          <button type="button" onClick={() => void hentPåNytt()}>
            Hent verge på nytt
          </button>
          <p>{`Fullførte hentinger: ${fullførteHentinger} (versjon ${behandlingVersjon})`}</p>
        </>
      )}
      {annenBehandlingUuid && (
        <button type="button" onClick={() => setBehandlingUuid(annenBehandlingUuid)}>
          Bytt til annen behandling
        </button>
      )}
      <RegistrerVergeFaktaIndex
        {...args}
        behandlingUuid={behandlingUuid}
        behandlingVersjon={behandlingVersjon}
        aksjonspunktStatus={status}
        submitCallback={submitCallback}
      />
    </>
  );
};

const meta = {
  title: 'gui/fakta/verge/RegistrerVergeFaktaIndex',
  component: RegistrerVergeFaktaIndex,
  args: {
    behandlingUuid: 'behandling-1',
    behandlingVersjon: 1,
    aksjonspunktStatus: aksjonspunktStatus.OPPRETTET,
    readOnly: false,
    submittable: true,
    submitCallback: fn(async () => {}),
  },
} satisfies Meta<typeof RegistrerVergeFaktaIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

const bekreftKnapp = /Bekreft og fortsett/;

const lagretAdvokat: VergeDto = {
  vergeType: 'ADVOKAT',
  navn: 'Advokat Nordmann',
  organisasjonsnummer: '999999999',
  gyldigFom: '2025-01-01',
  gyldigTom: '2025-12-31',
  begrunnelse: 'Fullmakt &amp; samtykke er mottatt.',
};

const utenVerge = lagFakeVergeBackend({});
export const ÅpentUtenVerge: Story = {
  args: { behandlingUuid: 'k9tilbake-uten-verge' },
  decorators: [withK9Kodeverkoppslag(), withFakeVergeApi({ backend: 'k9tilbake', hentVerge: utenVerge.hentVerge })],
  render: args => <MedSimulertBehandling {...args} lagre={utenVerge.lagre} kanHentePåNytt />,
  play: async ({ canvas, args, step }) => {
    const felt = (name: string) => canvas.getByRole('textbox', { name });
    const type = () => canvas.getByRole('combobox', { name: 'Type verge' });

    await step('Viser tomt skjema med instruksjon, uten identitetsfelt og Avbryt', async () => {
      await expect(await canvas.findByText('Registrer opplysninger om verge eller fullmektig.')).toBeInTheDocument();
      await expect(canvas.queryByText(/Søker er under 18 år/)).not.toBeInTheDocument();
      await expect(type()).toHaveValue('');
      await expect(canvas.queryByRole('option', { name: 'UDefinert' })).not.toBeInTheDocument();
      await expect(felt('Navn')).toHaveValue('');
      await expect(canvas.queryByRole('textbox', { name: 'Fødselsnummer' })).not.toBeInTheDocument();
      await expect(canvas.queryByRole('textbox', { name: 'Organisasjonsnummer' })).not.toBeInTheDocument();
      await expect(canvas.queryByRole('button', { name: 'Avbryt' })).not.toBeInTheDocument();
    });

    await step('Krever type, navn og begge datoer', async () => {
      await userEvent.click(canvas.getByRole('button', { name: bekreftKnapp }));
      await waitFor(() => expect(canvas.getAllByText('Feltet må fylles ut')).toHaveLength(2));
      await expect(canvas.getByText('Gyldig fra: Feltet må fylles ut')).toBeInTheDocument();
      await expect(canvas.getByText('Gyldig til: Feltet må fylles ut')).toBeInTheDocument();
      await expect(args.submitCallback).not.toHaveBeenCalled();
    });

    await step('Validerer navn, fødselsnummer og datorekkefølge', async () => {
      await userEvent.selectOptions(type(), 'BARN');
      await userEvent.type(felt('Navn'), 'Ola Nordmann 2');
      await userEvent.type(felt('Fødselsnummer'), '25848395246');
      await userEvent.type(felt('Gyldig fra'), '01.02.2025');
      await userEvent.type(felt('Gyldig til'), '31.01.2025');
      await userEvent.click(canvas.getByRole('button', { name: bekreftKnapp }));
      await waitFor(() => expect(canvas.getByText('Navn kan ikke inneholde tall')).toBeInTheDocument());
      await expect(canvas.getByText('Ugyldig fødselsnummer')).toBeInTheDocument();
      await expect(canvas.getByText('Gyldig fra: Kan ikke være etter "Gyldig til"')).toBeInTheDocument();
      await userEvent.clear(felt('Gyldig til'));
      await userEvent.type(felt('Gyldig til'), '01.02.2025');
      await waitFor(() => expect(canvas.queryByText(/Kan ikke være etter/)).not.toBeInTheDocument());
      await userEvent.clear(felt('Fødselsnummer'));
      await userEvent.type(felt('Fødselsnummer'), syntetiskFnr);
    });

    await step('Bytte til advokat viser organisasjonsnummer og beholder skjult fødselsnummer', async () => {
      await userEvent.selectOptions(type(), 'ADVOKAT');
      await expect(canvas.queryByRole('textbox', { name: 'Fødselsnummer' })).not.toBeInTheDocument();
      await userEvent.type(felt('Organisasjonsnummer'), '1234567e1');
      await userEvent.click(canvas.getByRole('button', { name: bekreftKnapp }));
      await waitFor(() => expect(canvas.getByText('Organisasjonsnummer må være 9 siffer')).toBeInTheDocument());
      await userEvent.selectOptions(type(), 'BARN');
      await expect(felt('Fødselsnummer')).toHaveValue(syntetiskFnr);
      await userEvent.selectOptions(type(), 'ADVOKAT');
      await userEvent.clear(felt('Organisasjonsnummer'));
      await userEvent.type(felt('Organisasjonsnummer'), '999999999');
      await userEvent.clear(felt('Navn'));
      await userEvent.type(felt('Navn'), '  Advokat Nordmann ');
    });

    await step('Begrunnelse er valgfri, maks 100 tegn etter normalisering', async () => {
      await userEvent.click(felt('Begrunnelse (valgfritt)'));
      await userEvent.paste('a'.repeat(101));
      await userEvent.click(canvas.getByRole('button', { name: bekreftKnapp }));
      await waitFor(() => expect(canvas.getByText('Du kan skrive maksimalt 100 tegn')).toBeInTheDocument());
      await userEvent.clear(felt('Begrunnelse (valgfritt)'));
      await userEvent.click(felt('Begrunnelse (valgfritt)'));
      await userEvent.paste(' Fullmakt\u00A0mottatt\u202F ');
      await expect(felt('Begrunnelse (valgfritt)')).toHaveValue(' Fullmakt\u00A0mottatt\u202F ');
      await expect(args.submitCallback).not.toHaveBeenCalled();
    });

    await step('Sender én registrering med bare organisasjonsnummer mens lagring pågår', async () => {
      const lagring = Promise.withResolvers<void>();
      args.submitCallback.mockImplementationOnce(() => lagring.promise);
      // Knappen mister tilgjengelig navn mens den laster, så samme element brukes videre.
      const knapp = canvas.getByRole('button', { name: bekreftKnapp });
      await userEvent.click(knapp);
      await waitFor(() => expect(knapp).toBeDisabled());
      await userEvent.click(knapp);
      await expect(args.submitCallback).toHaveBeenCalledTimes(1);
      await expect(args.submitCallback.mock.lastCall).toStrictEqual([
        [
          {
            kode: '5030',
            vergeType: 'ADVOKAT',
            navn: 'Advokat Nordmann',
            organisasjonsnummer: '999999999',
            gyldigFom: '2025-02-01',
            gyldigTom: '2025-02-01',
            begrunnelse: 'Fullmakt mottatt',
          },
        ],
      ]);
      lagring.resolve();
    });

    await step('Viser lagrede verdier etter oppdatert behandling', async () => {
      // Typenavnet finnes også som valg i skjemaet, så det ventes på tekst som bare finnes i oppsummeringen.
      await expect(await canvas.findByText('Advokat Nordmann')).toBeInTheDocument();
      await expect(canvas.getByText('Advokat/advokatfullmektig')).toBeInTheDocument();
      await expect(canvas.getByText('999999999')).toBeInTheDocument();
      await expect(canvas.getAllByText('01.02.2025')).toHaveLength(2);
      await expect(canvas.getByText('Fullmakt mottatt')).toBeInTheDocument();
      await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
    });

    await step('Avbryt i redigering forkaster endringer uten å sende', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Rediger vurdering' }));
      await expect(felt('Navn')).toHaveValue('Advokat Nordmann');
      await userEvent.type(felt('Navn'), ' endret');
      await userEvent.click(canvas.getByRole('button', { name: 'Avbryt' }));
      await expect(canvas.getByText('Advokat Nordmann')).toBeInTheDocument();
      await userEvent.click(canvas.getByRole('button', { name: 'Rediger vurdering' }));
      await expect(felt('Navn')).toHaveValue('Advokat Nordmann');
      await expect(args.submitCallback).toHaveBeenCalledTimes(1);
    });

    await step('Ny henting av uendrede lagrede verdier beholder ulagret endring', async () => {
      await userEvent.type(felt('Navn'), ' ulagret');
      await userEvent.clear(felt('Gyldig fra'));
      await userEvent.type(felt('Gyldig fra'), '31.01.2025');
      await userEvent.click(canvas.getByRole('button', { name: 'Hent verge på nytt' }));
      await expect(await canvas.findByText('Fullførte hentinger: 1 (versjon 2)')).toBeInTheDocument();
      await expect(felt('Navn')).toHaveValue('Advokat Nordmann ulagret');
      await expect(felt('Gyldig fra')).toHaveValue('31.01.2025');
    });

    await step('Endrede lagrede verdier vises etter ny henting med samme behandling og versjon', async () => {
      utenVerge.endre('k9tilbake-uten-verge', {
        vergeType: 'ADVOKAT',
        navn: 'Advokat Berg',
        organisasjonsnummer: '888888888',
        gyldigFom: '2025-03-01',
        gyldigTom: '2025-03-31',
        begrunnelse: 'Ny fullmakt',
      });
      await userEvent.click(canvas.getByRole('button', { name: 'Hent verge på nytt' }));
      await expect(await canvas.findByText('Fullførte hentinger: 2 (versjon 2)')).toBeInTheDocument();
      await waitFor(() => expect(felt('Navn')).toHaveValue('Advokat Berg'));
      await expect(felt('Organisasjonsnummer')).toHaveValue('888888888');
      await expect(felt('Gyldig fra')).toHaveValue('01.03.2025');
      await expect(felt('Gyldig til')).toHaveValue('31.03.2025');
      await expect(felt('Begrunnelse (valgfritt)')).toHaveValue('Ny fullmakt');
    });

    await step('Avbryt går tilbake til de nye lagrede verdiene', async () => {
      await userEvent.type(felt('Navn'), ' endret');
      await userEvent.clear(felt('Gyldig fra'));
      await userEvent.type(felt('Gyldig fra'), '02.03.2025');
      await userEvent.click(canvas.getByRole('button', { name: 'Avbryt' }));
      await expect(canvas.getByText('Advokat Berg')).toBeInTheDocument();
      await expect(canvas.getByText('01.03.2025')).toBeInTheDocument();
      await userEvent.click(canvas.getByRole('button', { name: 'Rediger vurdering' }));
      await expect(felt('Navn')).toHaveValue('Advokat Berg');
      await expect(felt('Gyldig fra')).toHaveValue('01.03.2025');
      await expect(felt('Gyldig til')).toHaveValue('31.03.2025');
      await userEvent.clear(felt('Gyldig fra'));
      await userEvent.type(felt('Gyldig fra'), '03.03.2025');
      await expect(felt('Gyldig fra')).toHaveValue('03.03.2025');
      await expect(args.submitCallback).toHaveBeenCalledTimes(1);
    });
  },
};

const navneendring = lagFakeVergeBackend({ 'k9tilbake-navneendring': lagretAdvokat });
export const NavneendringTilbakestillerPerioden: Story = {
  args: { behandlingUuid: 'k9tilbake-navneendring' },
  beforeEach: ({ args }) => navneendring.endre(args.behandlingUuid, lagretAdvokat),
  decorators: [withK9Kodeverkoppslag(), withFakeVergeApi({ backend: 'k9tilbake', hentVerge: navneendring.hentVerge })],
  render: args => <MedSimulertBehandling {...args} lagre={navneendring.lagre} kanHentePåNytt />,
  play: async ({ canvas, args }) => {
    const felt = (name: string) => canvas.getByRole('textbox', { name });
    await expect(await canvas.findByRole('textbox', { name: 'Navn' })).toHaveValue('Advokat Nordmann');
    await expect(felt('Gyldig fra')).toHaveValue('01.01.2025');
    await userEvent.clear(felt('Gyldig fra'));
    await userEvent.type(felt('Gyldig fra'), '02.01.2025');
    await expect(felt('Gyldig fra')).toHaveValue('02.01.2025');

    navneendring.endre(args.behandlingUuid, { ...lagretAdvokat, navn: 'Advokat Berg' });
    await userEvent.click(canvas.getByRole('button', { name: 'Hent verge på nytt' }));
    await expect(await canvas.findByText('Fullførte hentinger: 1 (versjon 1)')).toBeInTheDocument();
    await waitFor(() => expect(felt('Navn')).toHaveValue('Advokat Berg'));
    await expect(felt('Gyldig fra')).toHaveValue('01.01.2025');
    await expect(felt('Gyldig til')).toHaveValue('31.12.2025');

    await userEvent.click(canvas.getByRole('button', { name: bekreftKnapp }));
    await waitFor(() =>
      expect(args.submitCallback).toHaveBeenCalledWith([
        expect.objectContaining({ navn: 'Advokat Berg', gyldigFom: '2025-01-01', gyldigTom: '2025-12-31' }),
      ]),
    );
  },
};

const delvisLagret = lagFakeVergeBackend({
  'ungtilbake-delvis-lagret': {
    vergeType: 'VOKSEN',
    navn: 'Kari Nordmann',
    gyldigFom: '2025-01-01',
    gyldigTom: '2025-12-31',
    begrunnelse: 'Fullmakt &amp; samtykke',
  },
});
export const ÅpentMedDelvisLagretVergeUng: Story = {
  args: { behandlingUuid: 'ungtilbake-delvis-lagret' },
  decorators: [
    withUngKodeverkoppslag(),
    withFakeVergeApi({ backend: 'ungtilbake', hentVerge: delvisLagret.hentVerge }),
  ],
  render: args => <MedSimulertBehandling {...args} lagre={delvisLagret.lagre} />,
  play: async ({ canvas, args, step }) => {
    const felt = (name: string) => canvas.getByRole('textbox', { name });

    await step('Fyller inn lagrede verdier og krever manglende fødselsnummer', async () => {
      await expect(await canvas.findByRole('combobox', { name: 'Type verge' })).toHaveValue('VOKSEN');
      await expect(felt('Navn')).toHaveValue('Kari Nordmann');
      await expect(felt('Fødselsnummer')).toHaveValue('');
      await expect(felt('Begrunnelse (valgfritt)')).toHaveValue('Fullmakt & samtykke');
      await userEvent.click(canvas.getByRole('button', { name: bekreftKnapp }));
      await waitFor(() => expect(canvas.getByText('Feltet må fylles ut')).toBeInTheDocument());
      await expect(args.submitCallback).not.toHaveBeenCalled();
    });

    await step('Ung-tilbake godtar tall, men bare latinske bokstaver i navn', async () => {
      await userEvent.clear(felt('Navn'));
      await userEvent.type(felt('Navn'), 'Иван Петров');
      await userEvent.click(canvas.getByRole('button', { name: bekreftKnapp }));
      await waitFor(() => expect(canvas.getByText('Navn kan bare inneholde latinske bokstaver')).toBeInTheDocument());
      await userEvent.clear(felt('Navn'));
      await userEvent.type(felt('Navn'), 'Åse Ørn-Lie 2');
      await userEvent.type(felt('Fødselsnummer'), syntetiskFnr);
      await userEvent.clear(felt('Begrunnelse (valgfritt)'));
      await userEvent.type(felt('Begrunnelse (valgfritt)'), '   ');
    });

    await step('Sender bare fødselsnummer og utelater tom begrunnelse', async () => {
      await userEvent.click(canvas.getByRole('button', { name: bekreftKnapp }));
      await waitFor(() => expect(args.submitCallback).toHaveBeenCalledTimes(1));
      await expect(args.submitCallback.mock.lastCall).toStrictEqual([
        [
          {
            kode: '5030',
            vergeType: 'VOKSEN',
            navn: 'Åse Ørn-Lie 2',
            fnr: syntetiskFnr,
            gyldigFom: '2025-01-01',
            gyldigTom: '2025-12-31',
          },
        ],
      ]);
      await expect(await canvas.findByText(syntetiskFnr)).toBeInTheDocument();
      await expect(canvas.getByText('Verge for voksen')).toBeInTheDocument();
      await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
    });
  },
};

const lagringFeiler = lagFakeVergeBackend({ 'k9tilbake-lagring-feiler': lagretAdvokat });
export const LagringFeilerOgPrøvesPåNytt: Story = {
  args: { behandlingUuid: 'k9tilbake-lagring-feiler' },
  decorators: [withK9Kodeverkoppslag(), withFakeVergeApi({ backend: 'k9tilbake', hentVerge: lagringFeiler.hentVerge })],
  render: args => <MedSimulertBehandling {...args} lagre={lagringFeiler.lagre} />,
  // Feilen fra submitCallback sendes videre fra skjemaet, slik at skallet kan vise den. Det gir en uhåndtert
  // rejection i nettleseren, som ellers ville stoppet testen. Gjelder bare denne historien.
  parameters: { test: { dangerouslyIgnoreUnhandledErrors: true } },
  play: async ({ canvas, args, step }) => {
    const navn = () => canvas.getByRole('textbox', { name: 'Navn' });

    await step('Beholder verdiene når lagring feiler', async () => {
      args.submitCallback.mockRejectedValueOnce(new Error('Lagring feilet'));
      await userEvent.clear(await canvas.findByRole('textbox', { name: 'Navn' }));
      await userEvent.type(navn(), 'Advokat Hansen');
      const fraDato = canvas.getByRole('textbox', { name: 'Gyldig fra' });
      await userEvent.clear(fraDato);
      await userEvent.type(fraDato, '02.01.2025');
      await userEvent.click(canvas.getByRole('button', { name: bekreftKnapp }));
      await waitFor(() => expect(args.submitCallback).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(canvas.getByRole('button', { name: bekreftKnapp })).toBeEnabled());
      await expect(navn()).toHaveValue('Advokat Hansen');
      await expect(canvas.getByRole('textbox', { name: 'Gyldig fra' })).toHaveValue('02.01.2025');
      await expect(canvas.getByRole('textbox', { name: 'Organisasjonsnummer' })).toHaveValue('999999999');
    });

    await step('Sender samme registrering på nytt og viser den etter lagring', async () => {
      await userEvent.click(canvas.getByRole('button', { name: bekreftKnapp }));
      await waitFor(() => expect(args.submitCallback).toHaveBeenCalledTimes(2));
      await expect(args.submitCallback.mock.calls[1]).toStrictEqual(args.submitCallback.mock.calls[0]);
      await waitFor(() => expect(canvas.getByText('Advokat Hansen')).toBeInTheDocument());
      await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
    });
  },
};

const toBehandlinger = lagFakeVergeBackend({
  'k9tilbake-behandling-a': lagretAdvokat,
  'k9tilbake-behandling-b': { ...lagretAdvokat, navn: 'Advokat Berg', organisasjonsnummer: '888888888' },
});
export const ByttBehandlingViserRiktigVerge: Story = {
  args: { behandlingUuid: 'k9tilbake-behandling-a' },
  decorators: [
    withK9Kodeverkoppslag(),
    withFakeVergeApi({ backend: 'k9tilbake', hentVerge: toBehandlinger.hentVerge }),
  ],
  render: args => (
    <MedSimulertBehandling {...args} lagre={toBehandlinger.lagre} annenBehandlingUuid="k9tilbake-behandling-b" />
  ),
  play: async ({ canvas, args }) => {
    const navn = await canvas.findByRole('textbox', { name: 'Navn' });
    await userEvent.clear(navn);
    await userEvent.type(navn, 'Ulagret endring');
    await userEvent.click(canvas.getByRole('button', { name: 'Bytt til annen behandling' }));
    await waitFor(() => expect(canvas.getByRole('textbox', { name: 'Organisasjonsnummer' })).toHaveValue('888888888'));
    await expect(canvas.getByRole('textbox', { name: 'Navn' })).toHaveValue('Advokat Berg');
    await expect(args.submitCallback).not.toHaveBeenCalled();
  },
};

const lagretFraFør = lagFakeVergeBackend({ 'k9tilbake-lagret': lagretAdvokat });
const utenFnr = lagFakeVergeBackend({
  'k9tilbake-uten-fnr': { vergeType: 'BARN', navn: 'Kari Nordmann', gyldigFom: '2025-01-01' },
});
const k9TilbakeMedLagretVerge = [
  withK9Kodeverkoppslag(),
  withFakeVergeApi({ backend: 'k9tilbake', hentVerge: lagretFraFør.hentVerge }),
];

export const ÅpentAksjonspunktLesevisning: Story = {
  args: { behandlingUuid: 'k9tilbake-lagret', readOnly: true },
  decorators: k9TilbakeMedLagretVerge,
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Registrer opplysninger om verge eller fullmektig.')).toBeInTheDocument();
    await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
    await expect(canvas.queryByText('Advokat Nordmann')).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: bekreftKnapp })).not.toBeInTheDocument();
  },
};

export const ÅpentAksjonspunktKanIkkeLøses: Story = {
  args: { behandlingUuid: 'k9tilbake-lagret', submittable: false },
  decorators: k9TilbakeMedLagretVerge,
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Registrer opplysninger om verge eller fullmektig.')).toBeInTheDocument();
    await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: bekreftKnapp })).not.toBeInTheDocument();
  },
};

export const LesevisningForBeslutterMedDelvisLagretVerge: Story = {
  args: { behandlingUuid: 'k9tilbake-uten-fnr', aksjonspunktStatus: aksjonspunktStatus.UTFØRT, readOnly: true },
  decorators: [withK9Kodeverkoppslag(), withFakeVergeApi({ backend: 'k9tilbake', hentVerge: utenFnr.hentVerge })],
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Verge for barn under 18 år')).toBeInTheDocument();
    await expect(canvas.getByText('Kari Nordmann')).toBeInTheDocument();
    await expect(canvas.getByText('01.01.2025')).toBeInTheDocument();
    await expect(canvas.getAllByText('Ikke registrert')).toHaveLength(2);
    await expect(canvas.queryByRole('button', { name: 'Rediger vurdering' })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: bekreftKnapp })).not.toBeInTheDocument();
  },
};

export const LøstAksjonspunktUtenRegistrertVerge: Story = {
  args: { behandlingUuid: 'k9tilbake-lost-uten-verge', aksjonspunktStatus: aksjonspunktStatus.UTFØRT },
  decorators: [withK9Kodeverkoppslag(), withFakeVergeApi({ backend: 'k9tilbake', hentVerge: utenVerge.hentVerge })],
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Ingen verge er registrert.')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Rediger vurdering' })).toBeInTheDocument();
    await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
  },
};

export const AvbruttAksjonspunkt: Story = {
  args: { behandlingUuid: 'k9tilbake-lagret', aksjonspunktStatus: aksjonspunktStatus.AVBRUTT },
  decorators: k9TilbakeMedLagretVerge,
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Advokat Nordmann')).toBeInTheDocument();
    await expect(canvas.getByText('Fullmakt & samtykke er mottatt.')).toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: 'Rediger vurdering' })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: bekreftKnapp })).not.toBeInTheDocument();
  },
};

export const UkjentStatus: Story = {
  args: { behandlingUuid: 'k9tilbake-lagret', aksjonspunktStatus: undefined },
  decorators: k9TilbakeMedLagretVerge,
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Advokat Nordmann')).toBeInTheDocument();
    await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: 'Rediger vurdering' })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: bekreftKnapp })).not.toBeInTheDocument();
  },
};

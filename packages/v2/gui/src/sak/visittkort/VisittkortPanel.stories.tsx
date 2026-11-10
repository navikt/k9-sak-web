import { k9_kodeverk_person_NavBrukerKjønn as navBrukerKjonn } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { EndringsmeldingPsbTilgangDto } from '@k9-sak-web/backend/k9sak/kontrakt/endringsmeldingpsb/EndringsmeldingPsbTilgangDto.js';
import { EndringsmeldingPsbTilgangStatus } from '@k9-sak-web/backend/k9sak/kontrakt/endringsmeldingpsb/EndringsmeldingPsbTilgangStatus.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useQueryClient } from '@tanstack/react-query';
import { type ComponentProps, type PropsWithChildren, useEffect } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { withFakeEndringsmeldingPsbTilgangApi } from '../../storybook/decorators/withFakeEndringsmeldingPsbTilgangApi.js';
import withFeatureToggles from '../../storybook/decorators/withFeatureToggles.js';
import VisittkortPanel from './VisittkortPanel';
import type { Personopplysninger } from './types/Personopplysninger';
import diskresjonskodeType from './types/diskresjonskodeType';

const fagsakPerson = {
  erDod: false,
  navn: 'Olga Utvikler',
  alder: 41,
  personnummer: '1234567',
  erKvinne: true,
  personstatusType: 'BOSA',
};

const personopplysningerSoker: Personopplysninger = {
  fodselsdato: '1990-01-01',
  navBrukerKjonn: navBrukerKjonn.KVINNE, // NAV_BRUKER_KJONN
  avklartPersonstatus: {
    orginalPersonstatus: 'BOSA', // PERSONSTATUS_TYPE
    overstyrtPersonstatus: 'BOSA', // PERSONSTATUS_TYPE
  },
  personstatus: 'BOSA', // PERSONSTATUS_TYPE
  diskresjonskode: 'KLIENT_ADRESSE', // DISKRESJONSKODE_TYPE
  sivilstand: 'SAMB', // SIVILSTAND_TYPE
  aktoerId: '24sedfs32',
  navn: 'Olga Utvikler',
  adresser: [
    {
      adresseType: 'BOSTEDSADRESSE', // ADRESSE_TYPE
      adresselinje1: 'Oslo',
      land: 'Norge',
      postNummer: '1234',
      poststed: 'Oslo',
    },
  ],
  fnr: '98773895',
  region: 'NORDEN', // REGION
  barnSoktFor: [],
  harVerge: false,
};

const meta = {
  title: 'gui/sak/visittkort/VisittkortPanel',
  component: VisittkortPanel,
} satisfies Meta<typeof VisittkortPanel>;

export default meta;

export const Default: StoryObj<typeof VisittkortPanel> = {
  args: {
    fagsakPerson,
    språkkode: 'NN',
    personopplysninger: personopplysningerSoker,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(personopplysningerSoker.navn)).toBeInTheDocument();
    await expect(canvas.getByText('987738 95')).toBeInTheDocument();
    await expect(canvas.getByText(fagsakPerson.navn)).toBeInTheDocument();
  },
};

export const ManglerPersonOpplysninger: StoryObj<typeof VisittkortPanel> = {
  args: {
    ...Default.args,
    personopplysninger: undefined,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(fagsakPerson.navn)).toBeInTheDocument();
    await expect(canvas.getByText('123456 7')).toBeInTheDocument();
  },
};

export const HarTilbakekrevingVerge: StoryObj<typeof VisittkortPanel> = {
  args: {
    ...Default.args,
    personopplysninger: undefined,
    harTilbakekrevingVerge: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Personen har verge')).toBeInTheDocument();
    await expect(canvas.getByText('Verge')).toBeInTheDocument();
  },
};

export const HarDødsdato: StoryObj<typeof VisittkortPanel> = {
  args: {
    ...Default.args,
    personopplysninger: {
      ...personopplysningerSoker,
      dodsdato: '2019-01-01',
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Personen er død')).toBeInTheDocument();
  },
};

export const HarKode6: StoryObj<typeof VisittkortPanel> = {
  args: {
    ...Default.args,
    personopplysninger: {
      ...personopplysningerSoker,
      diskresjonskode: diskresjonskodeType.KODE6,
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Personen har diskresjonsmerking kode 6')).toBeInTheDocument();
    await expect(canvas.getByText('Kode 6')).toBeInTheDocument();
  },
};

export const HarKode7: StoryObj<typeof VisittkortPanel> = {
  args: {
    ...Default.args,
    personopplysninger: {
      ...personopplysningerSoker,
      diskresjonskode: diskresjonskodeType.KODE7,
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Personen har diskresjonsmerking kode 7')).toBeInTheDocument();
    await expect(canvas.getByText('Kode 7')).toBeInTheDocument();
  },
};

export const HarVerge: StoryObj<typeof VisittkortPanel> = {
  args: {
    ...Default.args,
    personopplysninger: {
      ...personopplysningerSoker,
      harVerge: true,
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Personen har verge')).toBeInTheDocument();
  },
};

export const SøkerUnder18: StoryObj<typeof VisittkortPanel> = {
  args: {
    ...Default.args,
    personopplysninger: {
      ...personopplysningerSoker,
      fodselsdato: '2019-01-01',
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Personen er under 18 år')).toBeInTheDocument();
  },
};

export const HarMerInformasjonOmSøker: StoryObj<typeof VisittkortPanel> = {
  args: {
    ...Default.args,
    personopplysninger: {
      ...personopplysningerSoker,
      fodselsdato: '2019-01-01',
    },
  },
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');
    if (buttons[1]) {
      await userEvent.click(buttons[1]);
    }
    await expect(canvas.getByLabelText('Statsborgerskap')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Personstatus')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Sivilstand')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Foretrukket språk')).toBeInTheDocument();
    await expect(canvas.getByText('Bostedsadresse')).toBeInTheDocument();
    await expect(canvas.getByText('Oslo, 1234 Oslo Norge')).toBeInTheDocument();
  },
};

export const HarRelatertFagsakEnSøker: StoryObj<typeof VisittkortPanel> = {
  args: {
    ...Default.args,
    relaterteFagsaker: {
      relaterteSøkere: [
        { søkerIdent: '17499944012', søkerNavn: 'SJØLØVE ANINE', saksnummer: '5YD0i', åpenBehandling: true },
      ],
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('SJØLØVE ANINE')).toBeInTheDocument();
  },
};

export const HarRelatertFagsakFlereSøkere: StoryObj<typeof VisittkortPanel> = {
  args: {
    ...Default.args,
    relaterteFagsaker: {
      relaterteSøkere: [
        { søkerIdent: '12345678910', søkerNavn: 'Sjøløve Anine', saksnummer: '5YD0i', åpenBehandling: true },
        { søkerIdent: '10987654321', søkerNavn: 'Kreps Svein', saksnummer: '5YD1W', åpenBehandling: true },
      ],
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Velg relatert søker')).toBeInTheDocument();
    await expect(canvas.getByText('Åpne sak')).toBeInTheDocument();
  },
};

const endringsmeldingPsbArgs = {
  ...Default.args,
  saksnummer: '5YD0i',
  sakstype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
};

const åpnePopup = async (canvas: ReturnType<typeof within>) => {
  const buttons = canvas.getAllByRole('button');
  if (buttons[1]) {
    await userEvent.click(buttons[1]);
  }
};

const { KAN_BRUKE, KAN_IKKE_BRUKE, MANGLER_TILGANG_TIL_PERSON } = EndringsmeldingPsbTilgangStatus;

// Avslagstekstene speiler IngenTilgangÅrsak.saksbehandlerTekst i k9-sak-innsyn-api
const svarvarianter = {
  'Ja, har tilgang': { status: KAN_BRUKE, tekst: 'Ja, har tilgang' },
  'Nei, ingen sak': { status: KAN_IKKE_BRUKE, tekst: 'Nei, søkeren har ingen sak' },
  'Nei, utenfor endringsperioden': {
    status: KAN_IKKE_BRUKE,
    tekst: 'Nei, søknadsperiodene er utenfor perioden som kan endres',
  },
  'Nei, mer enn én sak': { status: KAN_IKKE_BRUKE, tekst: 'Nei, søkeren har mer enn én sak' },
  'Nei, ingen søknadsperioder': { status: KAN_IKKE_BRUKE, tekst: 'Nei, søkeren har ingen søknadsperioder' },
  'Nei, omsorgen for er ikke vurdert': { status: KAN_IKKE_BRUKE, tekst: 'Nei, omsorgen for er ikke vurdert' },
  'Nei, selvstendig næringsdrivende': {
    status: KAN_IKKE_BRUKE,
    tekst: 'Nei, søkeren har arbeidstid som selvstendig næringsdrivende',
  },
  'Nei, to ansettelser samme uke': {
    status: KAN_IKKE_BRUKE,
    tekst: 'Nei, to ansettelser hos samme arbeidsgiver i samme uke, med opphold',
  },
  'Nei, ukjent arbeidsgiver': {
    status: KAN_IKKE_BRUKE,
    tekst: 'Nei, flere ansettelsesforhold hos ukjent arbeidsgiver',
  },
  'Mangler tilgang til person': {
    status: MANGLER_TILGANG_TIL_PERSON,
    tekst: 'Uvisst, du har ikke tilgang til å se svaret',
  },
  'Feil fra k9-sak': new Error('k9-sak svarte med feil'),
  'Tomt svar (204)': null,
} satisfies Record<string, EndringsmeldingPsbTilgangDto | null | Error>;

type Svarvariant = keyof typeof svarvarianter;

// Storyen beholder samme QueryClient når kontrollen endres, så cachen må tømmes for å hente nytt svar
const NullstillQueryCache = ({ nøkkel, children }: PropsWithChildren<{ nøkkel: string }>) => {
  const queryClient = useQueryClient();
  useEffect(() => {
    void queryClient.resetQueries();
  }, [queryClient, nøkkel]);
  return children;
};

export const EndringsmeldingPsb: StoryObj<ComponentProps<typeof VisittkortPanel> & { svar: Svarvariant }> = {
  name: 'EndringsmeldingPSB',
  args: { ...endringsmeldingPsbArgs, svar: 'Ja, har tilgang' },
  argTypes: {
    svar: {
      name: 'Svar fra k9-sak',
      control: 'select',
      options: Object.keys(svarvarianter),
    },
  },
  decorators: [
    withFeatureToggles({ VIS_ENDRINGSMELDING_PSB_TILGANG: true }),
    (Story, context) => (
      <NullstillQueryCache nøkkel={context.args.svar}>
        {withFakeEndringsmeldingPsbTilgangApi(svarvarianter[context.args.svar])(Story, context)}
      </NullstillQueryCache>
    ),
  ],
  play: async ({ canvas }) => {
    await åpnePopup(canvas);
    await expect(await canvas.findByText('Ja, har tilgang')).toBeInTheDocument();
  },
};

export const EndringsmeldingPsbFeil: typeof EndringsmeldingPsb = {
  ...EndringsmeldingPsb,
  name: 'EndringsmeldingPSB: feil fra k9-sak',
  args: { ...EndringsmeldingPsb.args, svar: 'Feil fra k9-sak' },
  play: async ({ canvas }) => {
    await åpnePopup(canvas);
    await expect(await canvas.findByText('Uvisst, kunne ikke hente svar')).toBeInTheDocument();
    await expect(canvas.queryByText('Ja, har tilgang')).not.toBeInTheDocument();
  },
};

export const EndringsmeldingPsbTomtSvar: typeof EndringsmeldingPsb = {
  ...EndringsmeldingPsb,
  name: 'EndringsmeldingPSB: tomt svar',
  args: { ...EndringsmeldingPsb.args, svar: 'Tomt svar (204)' },
  play: async ({ canvas }) => {
    await åpnePopup(canvas);
    await expect(await canvas.findByText('Uvisst, kunne ikke hente svar')).toBeInTheDocument();
    await expect(canvas.queryByText('Ja, har tilgang')).not.toBeInTheDocument();
  },
};

export const EndringsmeldingPsbManglerTilgangTilPerson: typeof EndringsmeldingPsb = {
  ...EndringsmeldingPsb,
  name: 'EndringsmeldingPSB: mangler tilgang til person',
  args: { ...EndringsmeldingPsb.args, svar: 'Mangler tilgang til person' },
  play: async ({ canvas }) => {
    await åpnePopup(canvas);
    await expect(await canvas.findByText('Uvisst, du har ikke tilgang til å se svaret')).toBeInTheDocument();
    await expect(canvas.queryByText('Uvisst, kunne ikke hente svar')).not.toBeInTheDocument();
  },
};

export const EndringsmeldingPsbAnnenYtelse: StoryObj<typeof VisittkortPanel> = {
  name: 'EndringsmeldingPSB: annen ytelse',
  args: {
    ...endringsmeldingPsbArgs,
    sakstype: fagsakYtelsesType.OMSORGSPENGER,
  },
  decorators: [withFeatureToggles({ VIS_ENDRINGSMELDING_PSB_TILGANG: true })],
  play: async ({ canvas }) => {
    await åpnePopup(canvas);
    await expect(canvas.getByText('Bostedsadresse')).toBeInTheDocument();
    await expect(canvas.queryByText('Endringsmelding')).not.toBeInTheDocument();
  },
};

import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { BarnType, type BarnDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/BarnDto.js';
import type { RammevedtakDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/RammevedtakDto.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import dayjs from 'dayjs';
import { expect } from 'storybook/test';
import { BarnOmsFakta } from './BarnOmsFakta.js';

const fødselsdatoForAlder = (alder: number) => dayjs().subtract(alder, 'years').format('YYYY-MM-DD');

const barn = [
  {
    personIdent: '15091512345',
    fødselsdato: fødselsdatoForAlder(10),
    barnType: BarnType.VANLIG,
    sammeBostedPerioder: ['2021-01-01/2021-06-30'],
  },
  {
    personIdent: '02031845962',
    fødselsdato: fødselsdatoForAlder(7),
    barnType: BarnType.UTENLANDSK_BARN,
  },
  {
    personIdent: '05051952104',
    fødselsdato: fødselsdatoForAlder(5),
    dødsdato: '2023-03-03',
    deltBostedPerioder: ['2022-02-07/2022-02-08'],
    barnType: BarnType.FOSTERBARN,
  },
] satisfies BarnDto[];

const rammevedtak = [
  {
    type: 'UtvidetRett',
    utvidetRettFor: '15091512345',
    vedtatt: '2021-03-17',
    gyldigFraOgMed: '2021-03-17',
    gyldigTilOgMed: '2021-12-31',
  },
  {
    type: 'UtvidetRett',
    utvidetRettFor: '15091512345',
    vedtatt: '2022-01-01',
    gyldigFraOgMed: '2022-01-01',
    gyldigTilOgMed: '2033-12-31',
  },
  {
    type: 'Fosterbarn',
    mottaker: '05051952104',
    vedtatt: '2021-03-17',
    gyldigFraOgMed: '2021-03-17',
    gyldigTilOgMed: '2033-12-31',
  },
] satisfies RammevedtakDto[];

const meta = {
  title: 'gui/fakta/barn-oms/BarnOmsFakta',
  component: BarnOmsFakta,
  args: { barn, rammevedtak },
} satisfies Meta<typeof BarnOmsFakta>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Omsorgspenger: Story = {
  args: { fagsakYtelseType: fagsakYtelsesType.OMSORGSPENGER },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText(
        'Disse barna er søkerens folkeregistrerte barn slik det var ved tidspunktet for beregning av dager',
      ),
    ).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { name: 'Barn #1' })).toBeInTheDocument();
    await expect(canvas.getByText('15091512345 (10 år)')).toBeInTheDocument();
    await expect(canvas.getByText('Barnet har samme bosted med søker i følgende perioder:')).toBeInTheDocument();
    await expect(canvas.getByText('01.01.2021 - 30.06.2021')).toBeInTheDocument();
    await expect(canvas.getAllByText('Utvidet rett')).toHaveLength(2);
    await expect(canvas.getByText('Barnet bor i utlandet')).toBeInTheDocument();
    await expect(canvas.getByText('Barnet har delt bosted med søker i følgende perioder:')).toBeInTheDocument();
    await expect(canvas.getByText('Barnet døde den 03.03.2023')).toBeInTheDocument();
    await expect(canvas.getByText('Barnet er fosterbarn')).toBeInTheDocument();
    await expect(canvas.getByText('Fosterbarn')).toBeInTheDocument();
    await expect(canvas.getByText('Det er ikke registrert midlertidig aleneomsorg')).toBeInTheDocument();
  },
};

export const KroniskSyktBarn: Story = {
  args: { fagsakYtelseType: fagsakYtelsesType.OMSORGSPENGER_KS },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Barnet søknaden gjelder for')).toBeInTheDocument();
  },
};

export const MidlertidigAlene: Story = {
  args: {
    fagsakYtelseType: fagsakYtelsesType.OMSORGSPENGER_MA,
    rammevedtak: [
      { type: 'MidlertidigAleneOmOmsorgen', gyldigFraOgMed: '2021-01-01', gyldigTilOgMed: '2021-12-31' },
      { type: 'MidlertidigAleneOmOmsorgen', gyldigFraOgMed: '2022-01-01', gyldigTilOgMed: '2022-12-31' },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Disse barna er søkerens folkeregistrerte barn')).toBeInTheDocument();
    await expect(canvas.getByText(/Brukeren har midlertidig aleneomsorg for alle barn\./)).toBeInTheDocument();
    await expect(canvas.getByText('01.01.2021')).toBeInTheDocument();
    await expect(canvas.queryByText('01.01.2022')).not.toBeInTheDocument();
  },
};

export const AleneOmOmsorgen: Story = {
  args: {
    fagsakYtelseType: fagsakYtelsesType.OMSORGSPENGER_AO,
    barn: [{ personIdent: '15091512345', fødselsdato: fødselsdatoForAlder(10), barnType: BarnType.VANLIG }],
    rammevedtak: [
      {
        type: 'AleneOmOmsorgen',
        aleneOmOmsorgenFor: '15091512345',
        gyldigFraOgMed: '2021-01-01',
        gyldigTilOgMed: '9999-12-31',
      },
      { type: 'DeltBosted', deltBostedMed: '15091512345', gyldigFraOgMed: '2022-01-01', gyldigTilOgMed: '2022-12-31' },
    ],
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText(
        'Disse barna er søkerens folkeregistrerte barn slik det var ved tidspunktet for beregning av dager',
      ),
    ).toBeInTheDocument();
    await expect(canvas.queryByText('31.12.9999')).not.toBeInTheDocument();
    // Til og med-cellen for aleneomsorg er tom, og delt bosted holder seg på egen rad
    const aleneomsorgFom = canvas.getByText('Alene om omsorgen').nextElementSibling;
    await expect(aleneomsorgFom).toHaveTextContent('01.01.2021');
    await expect(aleneomsorgFom?.nextElementSibling).toHaveTextContent(/^$/);
    const deltBostedFom = canvas.getByText('Delt bosted').nextElementSibling;
    await expect(deltBostedFom).toHaveTextContent('01.01.2022');
    await expect(deltBostedFom?.nextElementSibling).toHaveTextContent('31.12.2022');
  },
};

export const AleneomsorgUtenSluttdato: Story = {
  args: {
    barn: [{ personIdent: '15091512345', barnType: BarnType.VANLIG }],
    rammevedtak: [{ type: 'AleneOmOmsorgen', aleneOmOmsorgenFor: '15091512345', gyldigFraOgMed: '2021-01-01' }],
  },
  play: async ({ canvas }) => {
    const fom = canvas.getByText('Alene om omsorgen').nextElementSibling;
    await expect(fom).toHaveTextContent('01.01.2021');
    await expect(fom?.nextElementSibling).toHaveTextContent('-');
  },
};

export const ManglendeOgUgyldigFødselsdato: Story = {
  args: {
    barn: [
      { personIdent: '15091512345', barnType: BarnType.VANLIG },
      { personIdent: '02031845962', fødselsdato: 'ugyldig', barnType: BarnType.VANLIG },
      { fødselsdato: fødselsdatoForAlder(4), barnType: BarnType.VANLIG },
    ],
    rammevedtak: [],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('15091512345')).toBeInTheDocument();
    await expect(canvas.getByText('02031845962')).toBeInTheDocument();
    await expect(canvas.getByText('(4 år)')).toBeInTheDocument();
    await expect(canvas.queryByText(/NaN|\(0 år\)/)).not.toBeInTheDocument();
  },
};

export const UidentifiserteRammevedtak: Story = {
  args: {
    rammevedtak: [
      { type: 'UidentifisertRammevedtak', fritekst: '18410162721 @9-6,20 D' },
      { type: 'UidentifisertRammevedtak', fritekst: '' },
      { type: 'UtvidetRett', gyldigFraOgMed: '2020-01-01', gyldigTilOgMed: '2028-12-31' },
      { type: 'UtvidetRett', gyldigFraOgMed: '2021-01-01', gyldigTilOgMed: '2028-12-31' },
      { type: 'AleneOmOmsorgen', gyldigFraOgMed: '2020-01-01' },
      { type: 'Fosterbarn', gyldigFraOgMed: '2020-01-01' },
    ],
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText('Det finnes 2 automatisk utolkbare rammevedtak fra Infotrygd. Vennligst korriger i Infotrygd.'),
    ).toBeInTheDocument();
    await expect(
      canvas.getByText(
        'Det finnes 2 rammevedtak om utvidet rett fra Infotrygd som ikke automatisk kan kobles til et barn. Vennligst korriger i Infotrygd.',
      ),
    ).toBeInTheDocument();
    await expect(
      canvas.getByText(
        'Det finnes 1 rammevedtak om aleneomsorg fra Infotrygd som ikke automatisk kan kobles til et barn. Vennligst korriger i Infotrygd.',
      ),
    ).toBeInTheDocument();
    await expect(
      canvas.getByText(
        'Det finnes 1 rammevedtak om fosterbarn fra Infotrygd som ikke automatisk kan kobles til et barn. Vennligst korriger i Infotrygd.',
      ),
    ).toBeInTheDocument();
    const listepunkter = canvas.getAllByRole('listitem');
    await expect(listepunkter).toHaveLength(1);
    await expect(listepunkter[0]).toHaveTextContent('Utolkbar tekst: "18410162721 @9-6,20 D"');
  },
};

export const IngenBarn: Story = {
  args: { barn: [], rammevedtak: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Det er ikke registrert noen barn på søkeren')).toBeInTheDocument();
    await expect(canvas.queryByText(/Disse barna/)).not.toBeInTheDocument();
    await expect(canvas.getByText('Det er ikke registrert midlertidig aleneomsorg')).toBeInTheDocument();
  },
};

// Utvidet rett sender inn barn fra personopplysningene, med bare identifikator, fødselsdato og vanlig barntype
export const UtvidetRettMedBarnFraPersonopplysninger: Story = {
  args: {
    fagsakYtelseType: fagsakYtelsesType.OMSORGSPENGER_KS,
    barn: [{ personIdent: '150915', fødselsdato: fødselsdatoForAlder(8), barnType: BarnType.VANLIG }],
    rammevedtak: [
      { type: 'UtvidetRett', utvidetRettFor: '150915 #2', gyldigFraOgMed: '2021-01-01', gyldigTilOgMed: '2021-12-31' },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Barnet søknaden gjelder for')).toBeInTheDocument();
    await expect(canvas.getByText('150915 (8 år)')).toBeInTheDocument();
    await expect(canvas.getByText('Utvidet rett')).toBeInTheDocument();
    await expect(canvas.queryByText(/bosted med søker/)).not.toBeInTheDocument();
  },
};

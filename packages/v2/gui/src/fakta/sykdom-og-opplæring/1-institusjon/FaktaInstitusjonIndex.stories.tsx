import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { expect, fn, userEvent, within } from 'storybook/test';
import { oppslagKodeverkSomObjektK9Sak } from '../../../kodeverk/mocks/oppslagKodeverkSomObjektK9Sak.js';
import { K9SakKodeverkoppslag } from '../../../kodeverk/oppslag/K9SakKodeverkoppslag.js';
import withK9Kodeverkoppslag from '../../../storybook/decorators/withK9Kodeverkoppslag.jsx';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex.jsx';
import FaktaInstitusjonIndex from './FaktaInstitusjonIndex';
import SykdomOgOpplæringBackendClient from '../SykdomOgOpplæringBackendClient';
import { k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_institusjon_InstitusjonResultat as InstitusjonResultat } from '@k9-sak-web/backend/k9sak/generated/types.js';

const løsAksjonspunkt9300 = fn(action('løsAksjonspunkt9300'));
const løsAksjonspunkt9301 = fn(action('løsAksjonspunkt9301'));
const løsAksjonspunkt9302 = fn(action('løsAksjonspunkt9302'));
const løsAksjonspunkt9303 = fn(action('løsAksjonspunkt9303'));

const withSykdomOgOpplæringContext = (): Decorator => Story => {
  const sykdomOgOpplæringContextState = {
    readOnly: false,
    løsAksjonspunkt9300,
    løsAksjonspunkt9301,
    løsAksjonspunkt9302,
    løsAksjonspunkt9303,
    behandlingUuid: '111-2222',
    aksjonspunkter: [],
  };
  return (
    <SykdomOgOpplæringContext value={sykdomOgOpplæringContextState}>
      <Story />
    </SykdomOgOpplæringContext>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sakKodeverkOppslag = new K9SakKodeverkoppslag(oppslagKodeverkSomObjektK9Sak);

const withMockData: Decorator = Story => {
  // Mock institusjon info (perioder + vurderinger)
  // Grouping logic in component expects same journalpostId to group periods
  const institusjonInfoMock = {
    perioder: [
      {
        institusjon: 'St. Olavs hospital',
        periode: { fom: '2025-02-01', tom: '2025-02-05' },
        journalpostId: { journalpostId: 'jp-1' },
      },
      {
        institusjon: 'St. Olavs hospital',
        periode: { fom: '2025-02-10', tom: '2025-02-12' },
        journalpostId: { journalpostId: 'jp-1' },
      },
      {
        institusjon: 'Rikshospitalet',
        periode: { fom: '2025-03-01', tom: '2025-03-03' },
        journalpostId: { journalpostId: 'jp-2' },
      },
    ],
    vurderinger: [
      {
        journalpostId: { journalpostId: 'jp-1' },
        resultat: InstitusjonResultat.MÅ_VURDERES,
        begrunnelse: '',
        organisasjonsnummer: null,
        erTilVurdering: true,
        perioder: [
          { fom: '2025-02-01', tom: '2025-02-05' },
          { fom: '2025-02-10', tom: '2025-02-12' },
        ],
      },
      {
        journalpostId: { journalpostId: 'jp-2' },
        resultat: InstitusjonResultat.GODKJENT_MANUELT,
        begrunnelse: 'OK',
        organisasjonsnummer: '123456789',
        erTilVurdering: false,
        perioder: [{ fom: '2025-03-01', tom: '2025-03-03' }],
      },
    ],
  } as const;

  // Mock list of institutions used by selector
  const alleInstitusjonerMock = [
    { uuid: 'i1', navn: 'St. Olavs hospital' },
    { uuid: 'i2', navn: 'Rikshospitalet' },
    { uuid: 'i3', navn: 'Haukeland universitetssjukehus' },
  ];

  // Monkey-patch backend client for story runtime
  SykdomOgOpplæringBackendClient.prototype.getInstitusjonInfo = async () => institusjonInfoMock as any;
  SykdomOgOpplæringBackendClient.prototype.hentAlleInstitusjoner = async () => alleInstitusjonerMock as any;

  return <Story />;
};

const meta = {
  title: 'gui/fakta/sykdom-og-opplæring/1-institusjon',
  component: FaktaInstitusjonIndex,
  decorators: [withK9Kodeverkoppslag(), withSykdomOgOpplæringContext()],
} satisfies Meta<typeof FaktaInstitusjonIndex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [withMockData],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for navigation items to load and click the first period (St. Olavs hospital)
    const firstPeriodButton = await canvas.findByRole('button', { name: /01.02.2025/i });
    await expect(firstPeriodButton).toBeInTheDocument();
    await userEvent.click(firstPeriodButton);

    // Wait for the form to appear
    const godkjentRadioGroup = await canvas.findByRole('group', {
      name: /Er institusjonen en godkjent helseinstitusjon/i,
    });
    await expect(godkjentRadioGroup).toBeInTheDocument();

    // Select institution from dropdown
    const institutionSelect = canvas.getByRole('combobox', {
      name: /På hvilken helseinstitusjon eller kompetansesenter/i,
    });
    await userEvent.selectOptions(institutionSelect, 'St. Olavs hospital');

    // Select "Ja" for godkjent institusjon
    const jaRadio = within(godkjentRadioGroup).getByLabelText('Ja');
    await userEvent.click(jaRadio);

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: /Bekreft og fortsett/i });
    await userEvent.click(submitButton);

    // Verify that the action was called with expected data
    await expect(løsAksjonspunkt9300).toHaveBeenCalledWith({
      godkjent: true,
      begrunnelse: null,
      journalpostId: { journalpostId: 'jp-1' },
      redigertInstitusjonNavn: 'St. Olavs hospital',
      organisasjonsnummer: null,
    });
  },
};

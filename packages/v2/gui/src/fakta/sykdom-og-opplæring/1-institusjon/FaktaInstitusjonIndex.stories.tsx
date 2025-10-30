import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { expect, fn, userEvent, within, waitFor } from 'storybook/test';
import withK9Kodeverkoppslag from '../../../storybook/decorators/withK9Kodeverkoppslag';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
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
    <SykdomOgOpplæringContext.Provider value={sykdomOgOpplæringContextState}>
      <Story />
    </SykdomOgOpplæringContext.Provider>
  );
};

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
        organisasjonsnummer: undefined,
        vurdertAv: '',
        vurdertTidspunkt: '',
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
        vurdertAv: 'Pål Opel',
        vurdertTidspunkt: '2025-02-10T10:00:00Z',
      },
    ],
  };

  // Mock list of institutions used by selector
  const alleInstitusjonerMock = [
    { uuid: 'i1', navn: 'St. Olavs hospital' },
    { uuid: 'i2', navn: 'Rikshospitalet' },
    { uuid: 'i3', navn: 'Haukeland universitetssjukehus' },
  ];

  SykdomOgOpplæringBackendClient.prototype.getInstitusjonInfo = async () => institusjonInfoMock;
  SykdomOgOpplæringBackendClient.prototype.hentAlleInstitusjoner = async () => alleInstitusjonerMock;

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

export const GodkjentMedSkriftligVurdering: Story = {
  decorators: [withMockData],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click first period
    const firstPeriodButton = await canvas.findByRole('button', { name: /01.02.2025/i });
    await userEvent.click(firstPeriodButton);

    // Wait for form
    const godkjentRadioGroup = await canvas.findByRole('group', {
      name: /Er institusjonen en godkjent helseinstitusjon/i,
    });

    // Select institution
    const institutionSelect = canvas.getByRole('combobox', {
      name: /På hvilken helseinstitusjon eller kompetansesenter/i,
    });
    await userEvent.selectOptions(institutionSelect, 'St. Olavs hospital');

    // Select "Ja"
    const jaRadio = within(godkjentRadioGroup).getByLabelText('Ja');
    await userEvent.click(jaRadio);

    // Check "Legg til skriftlig vurdering"
    const skriftligVurderingCheckbox = canvas.getByRole('checkbox', {
      name: /Legg til skriftlig vurdering/i,
    });
    await expect(skriftligVurderingCheckbox).toBeInTheDocument();
    await userEvent.click(skriftligVurderingCheckbox);

    // Fill begrunnelse
    const begrunnelseTextarea = await canvas.findByLabelText(/Skriv din vurdering/i);
    await expect(begrunnelseTextarea).toBeVisible();
    await userEvent.type(begrunnelseTextarea, 'Institusjonen er godkjent og oppfyller kravene.');

    // Submit
    const submitButton = canvas.getByRole('button', { name: /Bekreft og fortsett/i });
    await userEvent.click(submitButton);

    // Verify
    await expect(løsAksjonspunkt9300).toHaveBeenCalledWith({
      godkjent: true,
      begrunnelse: 'Institusjonen er godkjent og oppfyller kravene.',
      journalpostId: { journalpostId: 'jp-1' },
      redigertInstitusjonNavn: 'St. Olavs hospital',
      organisasjonsnummer: null,
    });
  },
};

export const IkkeGodkjent: Story = {
  decorators: [withMockData],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click first period
    const firstPeriodButton = await canvas.findByRole('button', { name: /01.02.2025/i });
    await userEvent.click(firstPeriodButton);

    // Wait for form
    const godkjentRadioGroup = await canvas.findByRole('group', {
      name: /Er institusjonen en godkjent helseinstitusjon/i,
    });

    // Select institution
    const institutionSelect = canvas.getByRole('combobox', {
      name: /På hvilken helseinstitusjon eller kompetansesenter/i,
    });
    await userEvent.selectOptions(institutionSelect, 'St. Olavs hospital');

    // Select "Nei"
    const neiRadio = within(godkjentRadioGroup).getByLabelText('Nei');
    await userEvent.click(neiRadio);

    // Fill begrunnelse (should appear automatically)
    const begrunnelseTextarea = await canvas.findByLabelText(/Skriv din vurdering/i);
    await expect(begrunnelseTextarea).toBeVisible();
    await userEvent.type(begrunnelseTextarea, 'Institusjonen er ikke godkjent helseinstitusjon.');

    // Submit
    const submitButton = canvas.getByRole('button', { name: /Bekreft og fortsett/i });
    await userEvent.click(submitButton);

    // Verify
    await expect(løsAksjonspunkt9300).toHaveBeenCalledWith({
      godkjent: false,
      begrunnelse: 'Institusjonen er ikke godkjent helseinstitusjon.',
      journalpostId: { journalpostId: 'jp-1' },
      redigertInstitusjonNavn: 'St. Olavs hospital',
      organisasjonsnummer: null,
    });
  },
};

export const Validering: Story = {
  decorators: [withMockData],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click first period
    const firstPeriodButton = await canvas.findByRole('button', { name: /01.02.2025/i });
    await userEvent.click(firstPeriodButton);

    // Wait for form
    const godkjentRadioGroup = await canvas.findByRole('group', {
      name: /Er institusjonen en godkjent helseinstitusjon/i,
    });

    // TEST 1: Mangler institusjonvalg
    // Select "Ja" without selecting an institution
    const jaRadio = within(godkjentRadioGroup).getByLabelText('Ja');
    await userEvent.click(jaRadio);

    // Try to submit without selecting institution
    const submitButton = canvas.getByRole('button', { name: /Bekreft og fortsett/i });
    await userEvent.click(submitButton);

    // Verify that the action was NOT called
    await waitFor(() => expect(løsAksjonspunkt9300).not.toHaveBeenCalled());

    // TEST 2: Mangler begrunnelse
    // Select institution
    const institutionSelect = canvas.getByRole('combobox', {
      name: /På hvilken helseinstitusjon eller kompetansesenter/i,
    });
    await userEvent.selectOptions(institutionSelect, 'St. Olavs hospital');

    // Select "Nei" without filling begrunnelse
    const neiRadio = within(godkjentRadioGroup).getByLabelText('Nei');
    await userEvent.click(neiRadio);

    // Begrunnelse field should be visible but empty
    const begrunnelseTextarea = await canvas.findByLabelText(/Skriv din vurdering/i);
    await expect(begrunnelseTextarea).toBeVisible();

    // Try to submit without filling begrunnelse
    await userEvent.click(submitButton);

    // Verify that the action was still NOT called (form validation should prevent submission)
    await waitFor(() => expect(løsAksjonspunkt9300).not.toHaveBeenCalled());
  },
};

import { Period } from '@navikt/ft-utils';
import {
  k9_kodeverk_vilkår_Avslagsårsak as Avslagsårsak,
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_opplæring_OpplæringResultat as OpplæringVurderingDtoResultat,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { expect, fn, userEvent, within, waitFor } from 'storybook/test';
import { oppslagKodeverkSomObjektK9Sak } from '../../../kodeverk/mocks/oppslagKodeverkSomObjektK9Sak.js';
import { K9SakKodeverkoppslag } from '../../../kodeverk/oppslag/K9SakKodeverkoppslag.js';
import withK9Kodeverkoppslag from '../../../storybook/decorators/withK9Kodeverkoppslag';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import NødvendigOpplæringForm from './NødvendigOpplæringForm';

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
    behandlingUuid: '333-4444',
    aksjonspunkter: [],
  };
  return (
    <SykdomOgOpplæringContext.Provider value={sykdomOgOpplæringContextState}>
      <Story />
    </SykdomOgOpplæringContext.Provider>
  );
};

const sakKodeverkOppslag = new K9SakKodeverkoppslag(oppslagKodeverkSomObjektK9Sak);

const meta = {
  title: 'gui/fakta/sykdom-og-opplæring/3-nødvendig-opplæring',
  component: NødvendigOpplæringForm,
  decorators: [withK9Kodeverkoppslag(), withSykdomOgOpplæringContext()],
} satisfies Meta<typeof NødvendigOpplæringForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Avslagsårsaker: Story = {
  args: {
    vurdering: {
      avslagsårsak: Avslagsårsak.IKKE_NØDVENDIG_OPPLÆRING,
      begrunnelse: 'Begrunnelse for at opplæring ikke er nødvendig',
      opplæring: {
        fom: '2025-02-14',
        tom: '2025-02-23',
      },
      perioder: [new Period('2025-02-14', '2025-02-23')],
      resultat: OpplæringVurderingDtoResultat.IKKE_GODKJENT,
      vurdertAv: 'testbruker',
      vurdertTidspunkt: '2025-02-14T10:00:00Z',
    },
    setRedigerer: action('setRedigerer'),
    redigerer: true,
    andrePerioderTilVurdering: [],
  },
  play: async ({ canvas }) => {
    const harViFåttLegeerklæringGroup = canvas.getByRole('group', {
      name: /Har vi fått legeerklæring/i,
    });
    const jaKnapp = within(harViFåttLegeerklæringGroup).getByLabelText('Ja');
    await expect(jaKnapp).toBeInTheDocument();
    await userEvent.click(jaKnapp);
    const vurderingTextInput = canvas.getByLabelText(
      'Vurder om opplæringen er nødvendig for at søker skal kunne ta seg av og behandle barnet etter § 9-14, første ledd',
      { exact: false },
    );
    await expect(vurderingTextInput).toBeVisible();
    await userEvent.clear(vurderingTextInput);
    await userEvent.type(vurderingTextInput, 'Testbegrunnelse');
    const harSøkerOpplæringGroup = canvas.getByRole('group', { name: /Har søker opplæring som er nødvendig/ });
    const neiKnapp = within(harSøkerOpplæringGroup).getByLabelText('Nei');
    await userEvent.click(neiKnapp);
    const opplæringIkkeNødvendigRadio = canvas.getByText(
      sakKodeverkOppslag.avslagsårsaker(Avslagsårsak.IKKE_NØDVENDIG_OPPLÆRING).navn,
    );
    const kursInneholderIkkeOpplæringRadio = canvas.getByText(
      sakKodeverkOppslag.avslagsårsaker(Avslagsårsak.IKKE_OPPLÆRING_I_PERIODEN).navn,
    );
    await expect(opplæringIkkeNødvendigRadio).toBeVisible();
    await expect(kursInneholderIkkeOpplæringRadio).toBeVisible();
    await userEvent.click(opplæringIkkeNødvendigRadio);
    const bekreftKnapp = canvas.getByRole('button', { name: 'Bekreft og fortsett' });
    await userEvent.click(bekreftKnapp);
    const expectedSubmitData = {
      perioder: [
        {
          periode: { fom: '2025-02-14', tom: '2025-02-23' },
          begrunnelse: 'Testbegrunnelse',
          resultat: OpplæringVurderingDtoResultat.IKKE_GODKJENT,
          avslagsårsak: '1101',
        },
      ],
    };
    await expect(løsAksjonspunkt9302).toHaveBeenCalledWith(expectedSubmitData);
  },
};

export const GodkjentOpplæring: Story = {
  args: {
    vurdering: {
      begrunnelse: '',
      opplæring: {
        fom: '2025-02-14',
        tom: '2025-02-23',
      },
      perioder: [new Period('2025-02-14', '2025-02-23')],
      resultat: OpplæringVurderingDtoResultat.MÅ_VURDERES,
      vurdertAv: 'testbruker',
      vurdertTidspunkt: '2025-02-14T10:00:00Z',
    },
    setRedigerer: action('setRedigerer'),
    redigerer: true,
    andrePerioderTilVurdering: [],
  },
  play: async ({ canvas }) => {
    // Select "Ja" for legeerklæring
    const harViFåttLegeerklæringGroup = canvas.getByRole('group', {
      name: /Har vi fått legeerklæring/i,
    });
    const jaKnapp = within(harViFåttLegeerklæringGroup).getByLabelText('Ja');
    await userEvent.click(jaKnapp);

    // Fill vurdering
    const vurderingTextInput = canvas.getByLabelText(
      'Vurder om opplæringen er nødvendig for at søker skal kunne ta seg av og behandle barnet etter § 9-14, første ledd',
      { exact: false },
    );
    await userEvent.type(vurderingTextInput, 'Opplæringen er nødvendig og godkjent');

    // Select "Ja" for nødvendig opplæring
    const harSøkerOpplæringGroup = canvas.getByRole('group', { name: /Har søker opplæring som er nødvendig/ });
    const nødvendigJaKnapp = within(harSøkerOpplæringGroup).getByLabelText('Ja');
    await userEvent.click(nødvendigJaKnapp);

    // Submit
    const bekreftKnapp = canvas.getByRole('button', { name: 'Bekreft og fortsett' });
    await userEvent.click(bekreftKnapp);

    // Verify
    const expectedSubmitData = {
      perioder: [
        {
          periode: { fom: '2025-02-14', tom: '2025-02-23' },
          begrunnelse: 'Opplæringen er nødvendig og godkjent',
          resultat: OpplæringVurderingDtoResultat.GODKJENT,
          avslagsårsak: null,
        },
      ],
    };
    await expect(løsAksjonspunkt9302).toHaveBeenCalledWith(expectedSubmitData);
  },
};

export const GjenbrukValideringOgSubmit: Story = {
  args: {
    vurdering: {
      begrunnelse: '',
      opplæring: {
        fom: '2025-01-01',
        tom: '2025-01-10',
      },
      perioder: [new Period('2025-01-01', '2025-01-10')],
      resultat: OpplæringVurderingDtoResultat.MÅ_VURDERES,
      vurdertAv: 'testbruker',
      vurdertTidspunkt: '2025-01-01T10:00:00Z',
    },
    setRedigerer: action('setRedigerer'),
    redigerer: true,
    andrePerioderTilVurdering: [
      { fom: '2025-02-01', tom: '2025-02-05' },
      { fom: '2025-03-10', tom: '2025-03-12' },
    ],
  },
  play: async ({ canvas }) => {
    // Legeerklæring: Ja
    const legeGroup = await canvas.findByRole('group', { name: /Har vi fått legeerklæring/i });
    await userEvent.click(within(legeGroup).getByLabelText('Ja'));

    //begrunnelse
    const begrunnelse = canvas.getByLabelText(
      'Vurder om opplæringen er nødvendig for at søker skal kunne ta seg av og behandle barnet etter § 9-14, første ledd',
      { exact: false },
    );
    const begrunnelseTekst = 'Dette er en testbegrunnelse';
    await userEvent.clear(begrunnelse);
    await userEvent.type(begrunnelse, begrunnelseTekst);

    // Nødvendig opplæring: Ja
    const nodvGroup = await canvas.findByRole('group', { name: /Har søker opplæring som er nødvendig/i });
    await userEvent.click(within(nodvGroup).getByLabelText('Ja'));

    // Kryss av for gjenbruk uten å velge periode
    const gjenbrukCheckbox = canvas.getByRole('checkbox', { name: /Bruk denne vurderingen for andre perioder/i });
    await userEvent.click(gjenbrukCheckbox);

    // Forsøk å sende inn -> forvent feilmelding for perioder
    const bekreft = canvas.getByRole('button', { name: /Bekreft og fortsett/i });
    await userEvent.click(bekreft);
    await expect(await canvas.findByText('Du må velge minst én periode')).toBeInTheDocument();

    // Velg en periode
    const valgtPeriodeLabel = '01.02.2025 - 05.02.2025';
    await userEvent.click(canvas.getByRole('checkbox', { name: valgtPeriodeLabel }));

    // Send inn
    await userEvent.click(bekreft);

    // Verifiser at feilmelding er borte
    await expect(canvas.queryByText('Du må velge minst én periode')).not.toBeInTheDocument();

    // Verifiser payload (to perioder: original + valgt)
    await expect(løsAksjonspunkt9302).toHaveBeenCalledWith({
      perioder: [
        {
          periode: { fom: '2025-01-01', tom: '2025-01-10' },
          begrunnelse: begrunnelseTekst,
          resultat: OpplæringVurderingDtoResultat.GODKJENT,
          avslagsårsak: null,
        },
        {
          periode: { fom: '2025-02-01', tom: '2025-02-05' },
          begrunnelse: begrunnelseTekst,
          resultat: OpplæringVurderingDtoResultat.GODKJENT,
          avslagsårsak: null,
        },
      ],
    });
  },
};

export const AlleValidatorerUtenTilleggsperioder: Story = {
  args: {
    vurdering: {
      begrunnelse: '',
      opplæring: {
        fom: '2025-04-01',
        tom: '2025-04-10',
      },
      perioder: [new Period('2025-04-01', '2025-04-10')],
      resultat: OpplæringVurderingDtoResultat.MÅ_VURDERES,
      vurdertAv: 'testbruker',
      vurdertTidspunkt: '2025-04-01T10:00:00Z',
    },
    setRedigerer: action('setRedigerer'),
    redigerer: true,
    andrePerioderTilVurdering: [],
  },
  play: async ({ canvas }) => {
    // 1) Forsøk submit uten valg av legeerklæring -> feilmelding og ingen submit
    const bekreft = canvas.getByRole('button', { name: /Bekreft og fortsett/i });
    await userEvent.click(bekreft);
    await expect(await canvas.findByText('Dokumentert opplæring er påkrevd')).toBeInTheDocument();
    await waitFor(() => expect(løsAksjonspunkt9302).not.toHaveBeenCalled());

    // 2) Velg legeerklæring: Ja. Forsøk submit uten nødvendig opplæring -> feilmelding og ingen submit
    const legeGroup = await canvas.findByRole('group', { name: /Har vi fått legeerklæring/i });
    await userEvent.click(within(legeGroup).getByLabelText('Ja'));
    await userEvent.click(bekreft);
    await expect(await canvas.findByText('Nødvendig opplæring er påkrevd')).toBeInTheDocument();
    await waitFor(() => expect(løsAksjonspunkt9302).not.toHaveBeenCalled());

    // 3) Velg nødvendig opplæring: Ja. Forsøk submit uten begrunnelse -> feilmelding og ingen submit
    const nodvGroup = await canvas.findByRole('group', { name: /Har søker opplæring som er nødvendig/i });
    await userEvent.click(within(nodvGroup).getByLabelText('Ja'));

    // Forsøk å sende inn -> forvent feilmelding for perioder
    await userEvent.click(bekreft);
    await expect(await canvas.findByText('Begrunnelse er påkrevd')).toBeInTheDocument();
    await waitFor(() => expect(løsAksjonspunkt9302).not.toHaveBeenCalled());

    // 4) Fyll begrunnelse og submit -> forvent korrekt payload og at submit kalles
    const begrunnelseInput = canvas.getByLabelText(
      'Vurder om opplæringen er nødvendig for at søker skal kunne ta seg av og behandle barnet etter § 9-14, første ledd',
      { exact: false },
    );
    await userEvent.type(begrunnelseInput, 'Begrunnelse fylt inn for validering');
    await userEvent.click(bekreft);

    await expect(løsAksjonspunkt9302).toHaveBeenCalledWith({
      perioder: [
        {
          periode: { fom: '2025-04-01', tom: '2025-04-10' },
          begrunnelse: 'Begrunnelse fylt inn for validering',
          resultat: OpplæringVurderingDtoResultat.GODKJENT,
          avslagsårsak: null,
        },
      ],
    });
  },
};

export const ValideringAvReisedagIHelg: Story = {
  args: {
    vurdering: {
      begrunnelse: '',
      opplæring: {
        fom: '2025-02-14', // Fredag
        tom: '2025-02-17', // Mandag
      },
      perioder: [new Period('2025-02-14', '2025-02-17')],
      resultat: OpplæringVurderingDtoResultat.MÅ_VURDERES,
      vurdertAv: 'testbruker',
      vurdertTidspunkt: '2025-02-14T10:00:00Z',
    },
    setRedigerer: action('setRedigerer'),
    redigerer: true,
    andrePerioderTilVurdering: [],
  },
  play: async ({ canvas }) => {
    // Legeerklæring: Ja
    const legeGroup = await canvas.findByRole('group', { name: /Har vi fått legeerklæring/i });
    await userEvent.click(within(legeGroup).getByLabelText('Ja'));

    // Begrunnelse
    const begrunnelseInput = canvas.getByLabelText(
      'Vurder om opplæringen er nødvendig for at søker skal kunne ta seg av og behandle barnet etter § 9-14, første ledd',
      { exact: false },
    );
    await userEvent.type(begrunnelseInput, 'Test av reisedag validering');

    // Nødvendig opplæring: Deler av perioden
    const nodvGroup = await canvas.findByRole('group', { name: /Har søker opplæring som er nødvendig/i });
    await userEvent.click(within(nodvGroup).getByLabelText('Deler av perioden'));

    // Legg til en periode med opplæring (Fredag 14.02)
    const periodeInputs = canvas.getAllByRole('textbox', { name: /Fra|Til/i });
    // Første par er "Fra" og "Til" for den første perioden i listen
    if (periodeInputs[0]) {
      await expect(periodeInputs[0]).toBeEnabled();
      await userEvent.click(periodeInputs[0]);
      await userEvent.clear(periodeInputs[0]);
      await userEvent.type(periodeInputs[0], '14.02.2025');
    }
    if (periodeInputs[1]) {
      await expect(periodeInputs[1]).toBeEnabled();
      await userEvent.click(periodeInputs[1]);
      await userEvent.clear(periodeInputs[1]);
      await userEvent.type(periodeInputs[1], '15.02.2025');
    }
    await userEvent.tab(); // Trigger blur/validation

    // Nå skal vi ha en "resterende periode" som dekker 15.02-17.02 (Lør-Man)
    // Finn radio group for den resterende perioden
    // Vi må vente litt på at den dukker opp/oppdateres
    const reisedagRadio = await canvas.findByRole('radio', { name: /Vurder som reisedag/i });

    // Velg "Vurder som reisedag"
    await userEvent.click(reisedagRadio);
    // send inn
    canvas.getByRole('button', { name: /Bekreft og fortsett/i }).click();
    // forvent feilmelding fordi perioden inneholder helg (15. februar)
    await expect(await canvas.findByText('Reisedag kan ikke være en helgedag')).toBeInTheDocument();
    await waitFor(() => expect(løsAksjonspunkt9302).not.toHaveBeenCalled());

    // Endre perioden til å ikke inneholde helg (14.02-16.02)
    if (periodeInputs[1]) {
      await userEvent.click(periodeInputs[1]);
      await userEvent.clear(periodeInputs[1]);
      await userEvent.type(periodeInputs[1], '16.02.2025');
    }
    // Velg "Vurder som reisedag"
    await userEvent.click(await canvas.findByRole('radio', { name: /Vurder som reisedag/i }));

    // Send inn
    await userEvent.click(canvas.getByRole('button', { name: /Bekreft og fortsett/i }));
    // Verifiser at feilmelding er borte
    await expect(canvas.queryByText('Reisedag kan ikke være en helgedag')).not.toBeInTheDocument();
    // Verifiser at payload er korrekt
    await expect(løsAksjonspunkt9302).toHaveBeenCalledWith({
      perioder: [
        { fom: '2025-02-14', tom: '2025-02-17', resultat: OpplæringVurderingDtoResultat.VURDERES_SOM_REISETID },
      ],
    });
  },
};

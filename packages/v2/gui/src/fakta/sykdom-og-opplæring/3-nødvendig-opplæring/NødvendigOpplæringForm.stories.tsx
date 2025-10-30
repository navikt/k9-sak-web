import { Period } from '@navikt/ft-utils';
import {
  k9_kodeverk_vilkår_Avslagsårsak as Avslagsårsak,
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_opplæring_OpplæringResultat as OpplæringVurderingDtoResultat,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
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

export const ValideringManglerBegrunnelse: Story = {
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

    // Don't fill vurdering

    // Select "Ja" for nødvendig opplæring
    const harSøkerOpplæringGroup = canvas.getByRole('group', { name: /Har søker opplæring som er nødvendig/ });
    const nødvendigJaKnapp = within(harSøkerOpplæringGroup).getByLabelText('Ja');
    await userEvent.click(nødvendigJaKnapp);

    // Try to submit without begrunnelse
    const bekreftKnapp = canvas.getByRole('button', { name: 'Bekreft og fortsett' });
    await userEvent.click(bekreftKnapp);

    // Verify that the action was NOT called
    await waitFor(() => expect(løsAksjonspunkt9302).not.toHaveBeenCalled());
  },
};

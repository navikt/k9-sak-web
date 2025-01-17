import { behandlingResultatType as behandlingResultatTypeK9Klage } from '@k9-sak-web/backend/k9klage/generated';
import { behandlingType as BehandlingTypeK9Klage } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';
import { behandlingResultatType as behandlingResultatTypeK9Sak, sakstype } from '@k9-sak-web/backend/k9sak/generated';
import { behandlingType as BehandlingTypeK9SAK } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent } from '@storybook/test';
import MenyHenleggIndexV2 from './MenyHenleggIndex';
import type { Klagepart } from './types/Klagepart';

interface HenleggParams {
  behandlingVersjon: number;
  behandlingId: number;
  årsakKode: string;
  begrunnelse: string;
}

const meta = {
  title: 'gui/sak/meny/henlegg-behandling',
  component: MenyHenleggIndexV2,
} satisfies Meta<typeof MenyHenleggIndexV2>;

export default meta;

export const HenleggFørstegangssøknadPleiepenger: StoryObj<typeof MenyHenleggIndexV2> = {
  args: {
    behandlingId: 1,
    behandlingVersjon: 2,
    henleggBehandling: action('button-click') as (params: HenleggParams) => Promise<any>,
    forhandsvisHenleggBehandling: action('button-click'),
    ytelseType: sakstype.PSB,
    behandlingType: BehandlingTypeK9SAK.FØRSTEGANGSSØKNAD,
    behandlingResultatTyper: [
      behandlingResultatTypeK9Sak.HENLAGT_FEILOPPRETTET,
      behandlingResultatTypeK9Sak.HENLAGT_SØKNAD_TRUKKET,
    ],
    gaaTilSokeside: action('button-click'),
    lukkModal: action('button-click'),
    hentMottakere: action('button-click') as () => Promise<Klagepart[]>,
  },
  play: async ({ canvas }) => {
    expect(canvas.getByRole('dialog', { name: 'Behandlingen henlegges' })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: 'Henlegg behandling' })).toBeInTheDocument();
    expect(canvas.getByRole('button', { name: 'Henlegg behandling' })).not.toBeDisabled();
    expect(canvas.queryByRole('link', { name: 'Forhåndsvis brev' })).not.toBeInTheDocument();
    expect(canvas.getByRole('combobox', { name: 'Velg årsak til henleggelse' })).toBeInTheDocument();
    expect(canvas.getByRole('option', { name: 'Søknaden er trukket' })).toBeInTheDocument();
    expect(canvas.getByRole('option', { name: 'Behandlingen er feilaktig opprettet' })).toBeInTheDocument();
  },
};

export const HenleggKlagebehandling: StoryObj<typeof MenyHenleggIndexV2> = {
  args: {
    ...HenleggFørstegangssøknadPleiepenger.args,
    behandlingType: BehandlingTypeK9Klage.KLAGE,
    behandlingResultatTyper: [behandlingResultatTypeK9Klage.HENLAGT_KLAGE_TRUKKET],
    hentMottakere: () =>
      Promise.resolve([
        {
          identifikasjon: {
            id: '123',
            type: 'FNR',
            navn: 'Ola Nordmann',
          },
          rolleType: 'KLAGE_PART',
        },
      ]),
    arbeidsgiverOpplysningerPerId: {
      '123': {
        navn: 'Ola Nordmann',
        arbeidsforholdreferanser: [],
      },
    },
  },
  play: async ({ canvas }) => {
    expect(canvas.queryByRole('button', { name: 'Forhåndsvis brev' })).not.toBeInTheDocument();
    expect(canvas.queryByRole('combobox', { name: 'Velg mottaker av henleggelsesbrev' })).not.toBeInTheDocument();
    await userEvent.selectOptions(canvas.getByRole('combobox'), 'HENLAGT_KLAGE_TRUKKET');
    expect(canvas.getByRole('button', { name: 'Forhåndsvis brev' })).toBeInTheDocument();
    expect(canvas.getByRole('combobox', { name: 'Velg mottaker av henleggelsesbrev' })).toBeInTheDocument();
    expect(canvas.getByRole('option', { name: 'Ola Nordmann (123)' })).toBeInTheDocument();
  },
};

export const HenleggRevurderingTilbakekreving: StoryObj<typeof MenyHenleggIndexV2> = {
  args: {
    ...HenleggFørstegangssøknadPleiepenger.args,
    behandlingType: BehandlingTypeK9Klage.REVURDERING_TILBAKEKREVING,
    behandlingResultatTyper: ['HENLAGT_FEILOPPRETTET_MED_BREV'],
  },
  play: async ({ canvas }) => {
    expect(canvas.queryByRole('textbox', { name: 'Fritekst til brev' })).not.toBeInTheDocument();
    await userEvent.selectOptions(canvas.getByRole('combobox'), 'HENLAGT_FEILOPPRETTET_MED_BREV');
    expect(canvas.getByRole('textbox', { name: 'Fritekst til brev' })).toBeInTheDocument();
  },
};

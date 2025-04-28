import { BehandlingDtoBehandlingResultatType as behandlingResultatTypeK9Klage } from '@k9-sak-web/backend/k9klage/generated/types.js';
import { behandlingType as BehandlingTypeK9Klage } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';
import {
  BehandlingsresultatDtoType as behandlingResultatTypeK9Sak,
  BehandlingDtoSakstype as fagsakYtelseType,
} from '@k9-sak-web/backend/k9sak/generated';
import { behandlingType as BehandlingTypeK9SAK } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent } from '@storybook/test';
import { asyncAction } from '../../../storybook/asyncAction';
import MenyHenleggIndexV2 from './MenyHenleggIndex';

const meta = {
  title: 'gui/sak/meny/henlegg-behandling',
  component: MenyHenleggIndexV2,
} satisfies Meta<typeof MenyHenleggIndexV2>;

export default meta;

export const HenleggFørstegangssøknadPleiepenger: StoryObj<typeof MenyHenleggIndexV2> = {
  args: {
    behandlingId: 1,
    behandlingVersjon: 2,
    henleggBehandling: asyncAction('henlegg behandling'),
    forhandsvisHenleggBehandling: action('forhåndsvis henlegg behandling'),
    ytelseType: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
    behandlingType: BehandlingTypeK9SAK.FØRSTEGANGSSØKNAD,
    behandlingResultatTyper: [
      behandlingResultatTypeK9Sak.HENLAGT_FEILOPPRETTET,
      behandlingResultatTypeK9Sak.HENLAGT_SØKNAD_TRUKKET,
    ],
    gaaTilSokeside: action('button-click'),
    lukkModal: action('button-click'),
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
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('dialog', { name: 'Behandlingen henlegges' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Henlegg behandling' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Henlegg behandling' })).not.toBeDisabled();
    await expect(canvas.queryByRole('link', { name: 'Forhåndsvis brev' })).not.toBeInTheDocument();
    await expect(canvas.getByRole('combobox', { name: 'Velg årsak til henleggelse' })).toBeInTheDocument();
    await expect(canvas.getByRole('option', { name: 'Søknaden er trukket' })).toBeInTheDocument();
    await expect(canvas.getByRole('option', { name: 'Behandlingen er feilaktig opprettet' })).toBeInTheDocument();
  },
};

export const HenleggKlagebehandling: StoryObj<typeof MenyHenleggIndexV2> = {
  args: {
    ...HenleggFørstegangssøknadPleiepenger.args,
    behandlingType: BehandlingTypeK9Klage.KLAGE,
    behandlingResultatTyper: [behandlingResultatTypeK9Klage.HENLAGT_KLAGE_TRUKKET],
    arbeidsgiverOpplysningerPerId: {
      '123': {
        navn: 'Ola Nordmann',
        arbeidsforholdreferanser: [],
      },
    },
  },
  parameters: {
    test: {
      dangerouslyIgnoreUnhandledErrors: true,
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button', { name: 'Forhåndsvis brev' })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('combobox', { name: 'Velg mottaker av henleggelsesbrev' })).not.toBeInTheDocument();
    await userEvent.selectOptions(canvas.getByRole('combobox'), 'HENLAGT_KLAGE_TRUKKET');
    await expect(canvas.getByRole('button', { name: 'Forhåndsvis brev' })).toBeInTheDocument();
    await expect(canvas.getByRole('combobox', { name: 'Velg mottaker av henleggelsesbrev' })).toBeInTheDocument();
    await expect(canvas.getByRole('option', { name: 'Ola Nordmann (123)' })).toBeInTheDocument();
  },
};

export const HenleggRevurderingTilbakekreving: StoryObj<typeof MenyHenleggIndexV2> = {
  args: {
    ...HenleggFørstegangssøknadPleiepenger.args,
    behandlingType: BehandlingTypeK9Klage.REVURDERING_TILBAKEKREVING,
    behandlingResultatTyper: ['HENLAGT_FEILOPPRETTET_MED_BREV'],
  },
  parameters: {
    test: {
      dangerouslyIgnoreUnhandledErrors: true,
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('textbox', { name: 'Fritekst til brev' })).not.toBeInTheDocument();
    await userEvent.selectOptions(canvas.getByRole('combobox'), 'HENLAGT_FEILOPPRETTET_MED_BREV');
    await expect(canvas.getByRole('textbox', { name: 'Fritekst til brev' })).toBeInTheDocument();
  },
};

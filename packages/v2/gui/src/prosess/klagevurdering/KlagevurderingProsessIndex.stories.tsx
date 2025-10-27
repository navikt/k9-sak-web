import {
  type ung_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon,
  ung_kodeverk_behandling_BehandlingStatus,
  ung_kodeverk_behandling_BehandlingType,
  ung_kodeverk_behandling_FagsakYtelseType,
  ung_kodeverk_klage_KlageVurderingType,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import AksjonspunktCodes from '@k9-sak-web/lib/kodeverk/types/AksjonspunktCodes.js';
import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { expect, userEvent, waitFor } from 'storybook/test';
import { asyncAction } from '../../storybook/asyncAction';
import { KlagevurderingProsessIndex } from './KlagevurderingProsessIndex';

const meta = {
  title: 'gui/prosess/klagevurdering',
  component: KlagevurderingProsessIndex,
  args: {
    fagsak: {
      saksnummer: '123',
      sakstype: ung_kodeverk_behandling_FagsakYtelseType.PLEIEPENGER_SYKT_BARN,
    },
    saveKlage: asyncAction('saveKlage'),
    submitCallback: asyncAction('submitCallback'),
    previewCallback: asyncAction('previewCallback'),
    isReadOnly: false,
    readOnlySubmitButton: false,
  },
} satisfies Meta<typeof KlagevurderingProsessIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const VisPanelForKlagevurderingMedAksjonspunktNk: Story = {
  args: {
    aksjonspunkter: [
      {
        definisjon: AksjonspunktCodes.BEHANDLE_KLAGE_NK as ung_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon,
      },
    ],
    behandling: {
      opprettet: '123',
      sakstype: ung_kodeverk_behandling_FagsakYtelseType.UNGDOMSYTELSE,
      status: ung_kodeverk_behandling_BehandlingStatus.OPPRETTET,
      type: ung_kodeverk_behandling_BehandlingType.KLAGE,
      uuid: '123',
      versjon: 1,
    },
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/klage-v2', async () => {
          // await delay(250);
          return HttpResponse.json(
            {
              klageVurderingResultatNK: {
                klageVurdertAv: 'NK',
                klageVurdering: ung_kodeverk_klage_KlageVurderingType.STADFESTE_YTELSESVEDTAK,
                fritekstTilBrev: 'test',
                klageMedholdArsakNavn: 'TEST',
                godkjentAvMedunderskriver: false,
              },
            },
            { status: 200 },
          );
        }),
      ],
    },
  },
  play: async ({ canvas, step }) => {
    await step('skal vise fire options når klage stadfestet', async () => {
      await waitFor(async () => {
        await expect(canvas.getByRole('radio', { name: 'Stadfest vedtaket' })).toBeInTheDocument();
      });
      await expect(canvas.getByRole('radio', { name: 'Omgjør vedtaket' })).toBeInTheDocument();
      await expect(canvas.getByRole('radio', { name: 'Hjemsend vedtaket' })).toBeInTheDocument();
      await expect(canvas.getByRole('radio', { name: 'Opphev og hjemsend vedtaket' })).toBeInTheDocument();
      await userEvent.click(canvas.getByRole('radio', { name: 'Omgjør vedtaket' }));
      await expect(canvas.getByRole('combobox', { name: 'Årsak' })).toBeInTheDocument();
    });
  },
};

export const KlagevurderingMedAksjonspunktNfpKlageOpprettholdt: Story = {
  args: {
    aksjonspunkter: [
      {
        definisjon: AksjonspunktCodes.BEHANDLE_KLAGE_NFP as ung_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon,
      },
    ],
    behandling: {
      opprettet: '123',
      sakstype: ung_kodeverk_behandling_FagsakYtelseType.UNGDOMSYTELSE,
      status: ung_kodeverk_behandling_BehandlingStatus.OPPRETTET,
      type: ung_kodeverk_behandling_BehandlingType.KLAGE,
      uuid: '123',
      versjon: 1,
    },
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/klage-v2', async () => {
          return HttpResponse.json(
            {
              klageVurderingResultatNFP: {
                klageVurdertAv: 'NK',
                klageVurdering: ung_kodeverk_klage_KlageVurderingType.STADFESTE_YTELSESVEDTAK,
                fritekstTilBrev: 'test',
                klageMedholdArsakNavn: 'TEST',
                godkjentAvMedunderskriver: false,
              },
            },
            { status: 200 },
          );
        }),
      ],
    },
  },
  play: async ({ canvas, step }) => {
    await step('skal vise to options når klage opprettholdt', async () => {
      await waitFor(async () => {
        await expect(canvas.getByRole('radio', { name: 'Omgjør vedtaket' })).toBeInTheDocument();
      });
      await expect(canvas.getByRole('radio', { name: 'Oppretthold vedtaket' })).toBeInTheDocument();
      await userEvent.click(canvas.getByRole('radio', { name: 'Oppretthold vedtaket' }));
      await expect(canvas.getByRole('combobox', { name: 'Hjemmel' })).toBeInTheDocument();
    });

    await step('skal vise lenke til forhåndsvis brev når fritekst er fylt, og klagevurdering valgt', async () => {
      await userEvent.type(canvas.getByRole('textbox', { name: 'Fritekst til brev' }), 'Dette er en fritekst');
      await expect(canvas.getByRole('button', { name: 'Lagre og forhåndsvis brev' })).toBeInTheDocument();
    });
  },
};

export const KlagevurderingMedAksjonspunktNfpKlageMedhold: Story = {
  args: {
    ...KlagevurderingMedAksjonspunktNfpKlageOpprettholdt.args,
    behandling: {
      opprettet: '123',
      sakstype: ung_kodeverk_behandling_FagsakYtelseType.UNGDOMSYTELSE,
      status: ung_kodeverk_behandling_BehandlingStatus.OPPRETTET,
      type: ung_kodeverk_behandling_BehandlingType.KLAGE,
      uuid: '123',
      versjon: 1,
    },
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/klage-v2', async () => {
          return HttpResponse.json(
            {
              klageVurderingResultatNFP: {
                klageVurdertAv: 'NK',
                fritekstTilBrev: 'test',
                klageMedholdArsakNavn: 'TEST',
                godkjentAvMedunderskriver: false,
                klageVurdering: ung_kodeverk_klage_KlageVurderingType.MEDHOLD_I_KLAGE,
              },
            },
            { status: 200 },
          );
        }),
      ],
    },
  },
  play: async ({ canvas, step }) => {
    await step('skal vise to options når klage opprettholdt', async () => {
      await waitFor(async () => {
        await expect(canvas.getByRole('radio', { name: 'Omgjør vedtaket' })).toBeInTheDocument();
      });
      await expect(canvas.getByRole('radio', { name: 'Oppretthold vedtaket' })).toBeInTheDocument();
      await userEvent.click(canvas.getByRole('radio', { name: 'Omgjør vedtaket' }));
      await expect(canvas.getByRole('radio', { name: 'Til gunst' })).toBeInTheDocument();
      await expect(canvas.getByRole('radio', { name: 'Til ugunst' })).toBeInTheDocument();
      await expect(canvas.getByRole('radio', { name: 'Delvis omgjør, til gunst' })).toBeInTheDocument();
    });
  },
};

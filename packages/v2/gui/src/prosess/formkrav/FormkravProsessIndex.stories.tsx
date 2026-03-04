import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { BehandlingStatus } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingStatus.js';
import { behandlingType } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';
import { KlageAvvistÅrsak } from '@k9-sak-web/backend/k9klage/kodeverk/vedtak/KlageAvvistÅrsak.js';
import { KlageVurdering } from '@k9-sak-web/backend/k9klage/kodeverk/vedtak/KlageVurdering.js';
import { k9_klage_typer_IdType } from '@k9-sak-web/backend/k9klage/kontrakt/k9_klage_typer_IdType.js';
import { k9_klage_typer_RolleType } from '@k9-sak-web/backend/k9klage/kontrakt/k9_klage_typer_RolleType.js';
import { FagsakYtelseType } from '@k9-sak-web/backend/combined/kodeverk/behandling/FagsakYtelseType.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { FormkravProsessIndex } from './FormkravProsessIndex';

const behandling = {
  id: 1,
  versjon: 1,
  uuid: '123',
  type: behandlingType.KLAGE,
  status: BehandlingStatus.OPPRETTET,
  opprettet: '2025-10-13',
};

const avsluttedeBehandlinger = [
  {
    id: 1,
    versjon: 1,
    uuid: '456',
    type: behandlingType.KLAGE,
    status: BehandlingStatus.AVSLUTTET,
    opprettet: '2017-08-01T00:54:25.455',
    avsluttet: '2017-08-02T00:54:25.455',
  },
];

const meta = {
  title: 'gui/prosess/formkrav',
  component: FormkravProsessIndex,
} satisfies Meta<typeof FormkravProsessIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const VisFormkravPanelForAksjonspunktNfp: Story = {
  args: {
    behandling: behandling,
    aksjonspunkter: [
      {
        definisjon: AksjonspunktDefinisjon.VURDERING_AV_FORMKRAV_KLAGE_NFP,
      },
    ],
    klageVurdering: {
      klageVurderingResultatNK: {
        klageVurdertAv: 'NK',
        klageVurdering: KlageVurdering.AVVIS_KLAGE,
        fritekstTilBrev: 'test',
        klageMedholdArsakNavn: 'TEST',
        godkjentAvMedunderskriver: false,
      },
      klageFormkravResultatKA: {
        avvistArsaker: [KlageAvvistÅrsak.KLAGET_FOR_SENT],
      },
    },
    isReadOnly: false,
    submitCallback: fn(),
    fagsak: {
      opprettet: '123',
      person: {},
      saksnummer: '123',
      sakstype: FagsakYtelseType.UNGDOMSYTELSE,
    },
    arbeidsgiverOpplysningerPerId: {},
    avsluttedeBehandlinger: avsluttedeBehandlinger,
    readOnlySubmitButton: false,
    parterMedKlagerett: [
      {
        identifikasjon: {
          id: '123',
          type: k9_klage_typer_IdType.AKTØRID,
        },
        rolleType: k9_klage_typer_RolleType.ARBEIDSGIVER,
      },
    ],
  },
  play: async ({ args, canvas }) => {
    await userEvent.type(canvas.getByLabelText('Vurdering'), 'test');
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Vedtaket som er påklagd' }), '456');
    await userEvent.click(
      canvas
        .getByRole('group', { name: /Er klager part og\/eller har rettslig klageinteresse/i })
        .querySelector('input[value="true"]')!,
    );
    await userEvent.click(
      canvas
        .getByRole('group', { name: /Klages det på konkrete elementer i vedtaket/i })
        .querySelector('input[value="true"]')!,
    );
    await userEvent.click(
      canvas.getByRole('group', { name: /Er klagefristen overholdt/i }).querySelector('input[value="true"]')!,
    );
    await userEvent.click(
      canvas.getByRole('group', { name: /Er klagen signert/i }).querySelector('input[value="true"]')!,
    );

    await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));

    const expectedResponse = [
      {
        begrunnelse: 'test',
        erFristOverholdt: true,
        erKlagerPart: true,
        erKonkret: true,
        erSignert: true,
        erTilbakekreving: false,
        kode: '5082',
        påklagdBehandlingInfo: {
          påklagBehandlingType: 'BT-003',
          påklagBehandlingUuid: '456',
          påklagBehandlingVedtakDato: '2017-08-02T00:54:25.455',
        },
        valgtKlagePart: args.parterMedKlagerett?.[0],
        vedtak: '456',
      },
    ];
    await expect(args.submitCallback).toHaveBeenCalledWith(expectedResponse);
  },
};
export const VisFormkravPanelForAksjonspunktKa: Story = {
  args: {
    behandling: behandling,
    aksjonspunkter: [
      {
        definisjon: AksjonspunktDefinisjon.VURDERING_AV_FORMKRAV_KLAGE_KA,
      },
    ],
    klageVurdering: {
      klageVurderingResultatNK: {
        klageVurdertAv: 'NK',
        klageVurdering: KlageVurdering.AVVIS_KLAGE,
        fritekstTilBrev: 'test',
        klageMedholdArsakNavn: 'TEST',
        godkjentAvMedunderskriver: false,
      },
      klageFormkravResultatKA: {
        avvistArsaker: [KlageAvvistÅrsak.KLAGET_FOR_SENT],
      },
    },
    isReadOnly: false,
    submitCallback: fn(),
    fagsak: {
      opprettet: '123',
      person: {},
      saksnummer: '123',
      sakstype: FagsakYtelseType.UNGDOMSYTELSE,
    },
    arbeidsgiverOpplysningerPerId: {},
    avsluttedeBehandlinger: avsluttedeBehandlinger,
    readOnlySubmitButton: false,
    parterMedKlagerett: [],
  },
  play: async ({ args, canvas }) => {
    await userEvent.type(canvas.getByLabelText('Vurdering'), 'test');
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Vedtaket som er påklagd' }), '456');
    await userEvent.click(
      canvas
        .getByRole('group', { name: /Er klager part og\/eller har rettslig klageinteresse/i })
        .querySelector('input[value="false"]')!,
    );
    await userEvent.click(
      canvas
        .getByRole('group', { name: /Klages det på konkrete elementer i vedtaket/i })
        .querySelector('input[value="false"]')!,
    );
    await userEvent.click(
      canvas.getByRole('group', { name: /Er klagefristen overholdt/i }).querySelector('input[value="false"]')!,
    );
    await userEvent.click(
      canvas.getByRole('group', { name: /Er klagen signert/i }).querySelector('input[value="false"]')!,
    );

    await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));

    const expectedResponse = [
      {
        begrunnelse: 'test',
        erFristOverholdt: false,
        erKlagerPart: false,
        erKonkret: false,
        erSignert: false,
        erTilbakekreving: false,
        kode: '5083',
        påklagdBehandlingInfo: {
          påklagBehandlingType: 'BT-003',
          påklagBehandlingUuid: '456',
          påklagBehandlingVedtakDato: '2017-08-02T00:54:25.455',
        },
        valgtKlagePart: undefined,
        vedtak: '456',
      },
    ];
    await expect(args.submitCallback).toHaveBeenCalledWith(expectedResponse);
  },
};

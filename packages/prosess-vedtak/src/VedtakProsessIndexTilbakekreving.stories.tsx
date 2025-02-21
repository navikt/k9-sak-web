import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import {
  AksjonspunktDtoAksjonspunktType,
  AksjonspunktDtoDefinisjon,
  AksjonspunktDtoStatus,
  AksjonspunktDtoVenteårsak,
  BehandlingDtoBehandlingResultatType,
} from '@navikt/k9-sak-typescript-client';
import { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent } from '@storybook/test';
import VedtakProsessIndex from './VedtakProsessIndex';

const behandling = {
  id: 1,
  versjon: 1,
  type: behandlingType.SOKNAD,
  status: behandlingStatus.BEHANDLING_UTREDES,
  sprakkode: 'NO',
  behandlingsresultat: {
    vedtaksbrev: 'FRITEKST',
    type: BehandlingDtoBehandlingResultatType.IKKE_FASTSATT,
  },
  behandlingPaaVent: false,
  behandlingHenlagt: false,
  behandlingArsaker: [
    {
      behandlingArsakType: klageBehandlingArsakType.ETTER_KLAGE,
    },
  ],
};

const meta: Meta<typeof VedtakProsessIndex> = {
  title: 'prosess/prosess-vedtak',
  component: VedtakProsessIndex,
};

export default meta;

const aksjonspunkt5085 = {
  aksjonspunktType: AksjonspunktDtoAksjonspunktType.MANUELL,
  begrunnelse: null,
  besluttersBegrunnelse: null,
  definisjon: AksjonspunktDtoDefinisjon.SJEKK_TILBAKEKREVING,
  erAktivt: true,
  fristTid: null,
  kanLoses: true,
  status: AksjonspunktDtoStatus.OPPRETTET,
  toTrinnsBehandling: false,
  toTrinnsBehandlingGodkjent: null,
  vilkarType: null,
  vurderPaNyttArsaker: null,
  AksjonspunktDtoVenteårsak: AksjonspunktDtoVenteårsak.UDEFINERT,
};

export const visSjekkTilbakekreving: StoryObj<typeof meta> = {
  args: {
    behandling,
    isReadOnly: false,
    vilkar: [],
    medlemskap: { fom: '2019-01-01' },
    aksjonspunkter: [aksjonspunkt5085],
    previewCallback: fn(),
    submitCallback: fn(),
  },
  play: async ({ args, canvas, step }) => {
    await step('Test å svare nei', async () => {
      const neiRadio = canvas.getByText('Nei, behandle denne behandlingen videre');
      await expect(neiRadio).toBeInTheDocument();
      await userEvent.click(neiRadio);
      const bekreftBtn = canvas.getByText('Bekreft');
      await userEvent.click(bekreftBtn);
      await expect(args.submitCallback).toHaveBeenCalledWith([{ kode: aksjonspunkt5085.definisjon }]);
    });
  },
};

import {
  AksjonspunktDtoDefinisjon,
  type AksjonspunktDto,
  type BehandlingDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { Meta, StoryObj } from '@storybook/react';

import { HStack } from '@navikt/ds-react';
import { fn, within, expect, userEvent, fireEvent } from '@storybook/test';
import dayjs from 'dayjs';
import { FakeBehandlingAvregningBackendApi } from '../../../storybook/mocks/FakeBehandlingAvregningBackendApi';
import KontrollerEtterbetaling, {
  type BekreftKontrollerEtterbetalingAksjonspunktRequest,
} from './KontrollerEtterbetaling';

const bekreftAksjonspunktRequest: BekreftKontrollerEtterbetalingAksjonspunktRequest = {
  behandlingId: '123',
  behandlingVersjon: 1,
  bekreftedeAksjonspunktDtoer: [
    {
      '@type': AksjonspunktDtoDefinisjon.SJEKK_HØY_ETTERBETALING,
      kode: AksjonspunktDtoDefinisjon.SJEKK_HØY_ETTERBETALING,
      begrunnelse: 'Dette er en grundig begrunnelse',
    },
  ],
};

const api = new FakeBehandlingAvregningBackendApi();
const meta = {
  title: 'gui/prosess/Simulering/Høy-Etterbetaling',
  component: KontrollerEtterbetaling,
  beforeEach: () => {
    api.reset();
  },
} satisfies Meta<typeof KontrollerEtterbetaling>;

type Story = StoryObj<typeof meta>;

const behandling: Omit<BehandlingDto, 'uuid' | 'status'> = {
  opprettet: dayjs().subtract(5, 'day').toISOString(),
  sakstype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
  type: 'BT-002',
  versjon: 1,
  id: 123,
};

const uløstBehandling: BehandlingDto = {
  uuid: '1',
  status: 'UTRED',
  ...behandling,
};

const aksjonspunkt: AksjonspunktDto = {
  aksjonspunktType: 'MANU',
  erAktivt: true,
  besluttersBegrunnelse: undefined,
  definisjon: AksjonspunktDtoDefinisjon.SJEKK_HØY_ETTERBETALING,
  vilkarType: undefined,
  vurderPaNyttArsaker: undefined,
  venteårsak: '-',
  venteårsakVariant: undefined,
  opprettetAv: 'vtp',
};

const uløstAksjonspunkt: AksjonspunktDto = {
  begrunnelse: undefined,
  kanLoses: true,
  status: 'OPPR',
  ...aksjonspunkt,
};

const oppdaterBehandling = fn();

export const LøsAksjonspunkt: Story = {
  args: { behandling: uløstBehandling, aksjonspunkt: uløstAksjonspunkt, readOnly: false, api, oppdaterBehandling },
  play: async ({ args, canvasElement, step }) => {
    const user = userEvent.setup();
    const canvas = await within(canvasElement);

    await step('Skal ha aksjonspunktboks for kontroller etterbetaling', async () => {
      await expect(await canvas.findByRole('button', { name: 'Dette bør du undersøke rundt etterbetalingen' }));
      await expect(
        await canvas.findByRole('textbox', { name: 'Begrunn hvorfor du går videre med denne behandlingen.' }),
      );
      await expect(await canvas.findByRole('button', { name: 'Bekreft og fortsett' }));
    });

    await fireEvent.change(
      await canvas.findByRole('textbox', { name: 'Begrunn hvorfor du går videre med denne behandlingen.' }),
      {
        target: {
          value: 'Dette er en grundig begrunnelse',
        },
      },
    );

    await step('Skal kunne løse aksjonspunkt', async () => {
      await user.click(await canvas.findByRole('button', { name: 'Bekreft og fortsett' }));
      await expect(args.oppdaterBehandling).toHaveBeenCalled();
      await expect(api.sisteBekreftAksjonspunktResultat).toEqual(bekreftAksjonspunktRequest);
    });
  },
  render: props => (
    <HStack>
      <KontrollerEtterbetaling {...props} />
    </HStack>
  ),
};

export default meta;

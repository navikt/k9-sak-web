import {
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon,
  type k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  type k9_sak_kontrakt_behandling_BehandlingDto as BehandlingDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { BehandlingProvider } from '@k9-sak-web/gui/context/BehandlingContext.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { BekreftAksjonspunktClient } from '@k9-sak-web/gui/shared/hooks/useBekreftAksjonspunkt.js';

import { HStack } from '@navikt/ds-react';
import dayjs from 'dayjs';
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test';
import KontrollerEtterbetaling from './KontrollerEtterbetaling';

const refetchBehandling = fn();
const bekreftFn = fn();

const mockAksjonspunktClient: BekreftAksjonspunktClient<unknown> = {
  bekreft: async (...args) => {
    bekreftFn(...args);
    return { response: new Response(null, { status: 200 }) };
  },
  poll: async () => ({ data: undefined, response: new Response(null, { status: 200 }) }),
};
const meta = {
  title: 'gui/prosess/Simulering/Høy-Etterbetaling',
  component: KontrollerEtterbetaling,
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
  definisjon: AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING,
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

export const LøsAksjonspunkt: Story = {
  args: { behandling: uløstBehandling, aksjonspunkt: uløstAksjonspunkt, readOnly: false },
  play: async ({ canvasElement, step }) => {
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
    });
  },
  render: props => (
    <BehandlingProvider
      behandling={props.behandling}
      refetchBehandling={refetchBehandling}
      aksjonspunktClient={mockAksjonspunktClient}
    >
      <HStack>
        <KontrollerEtterbetaling {...props} />
      </HStack>
    </BehandlingProvider>
  ),
};

export default meta;

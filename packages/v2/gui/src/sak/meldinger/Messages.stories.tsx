/* eslint-disable import/no-relative-packages */
import type { Meta, StoryObj } from '@storybook/react';

import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { fagsakStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/FagsakStatus.js';
import { userEvent, within } from '@storybook/test';
import withMaxWidth from '../../../../../storybook/decorators/withMaxWidth.tsx';
import { FakeMessagesBackendApi } from '../../../../../storybook/stories/mocks/FakeMessagesBackendApi.js';
import arbeidsgivere from '../../../../../storybook/stories/mocks/arbeidsgivere.json';
import { templates } from '../../../../../storybook/stories/mocks/brevmaler';
import personopplysninger from '../../../../../storybook/stories/mocks/personopplysninger';
import Messages from './Messages.tsx';
import { tredjepartsmottakerValg } from './MottakerSelect.js';

const meta: Meta<typeof Messages> = {
  title: 'gui/sak/meldinger/Messages.tsx',
  component: Messages,
  decorators: [withMaxWidth(420)],
};
export default meta;

type Story = StoryObj<typeof Messages>;
const api = new FakeMessagesBackendApi();
export const DefaultStory: Story = {
  args: {
    fagsak: {
      saksnummer: '100',
      sakstype: { kode: fagsakYtelsesType.PSB, kodeverk: 'FAGSAK_YTELSE' },
      status: { kode: fagsakStatus.UNDER_BEHANDLING, kodeverk: 'FAGSAK_STATUS' },
      person: {
        aktørId: 'person-aktørid-1',
      },
    },
    behandling: {
      id: 101,
      uuid: 'XUYPS4',
      type: { kode: behandlingType.FØRSTEGANGSSØKNAD, kodeverk: 'BEHANDLING_TYPE' },
      sprakkode: {
        kode: 'NB',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    maler: templates,
    personopplysninger,
    arbeidsgiverOpplysningerPerId: arbeidsgivere,
    api,
  },
};

export const MedFritekstTittel: Story = {
  args: {
    ...DefaultStory.args,
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(canvasElement);
    const canvas = within(canvasElement);
    const malSelectBox = canvas.getByLabelText('Mal');
    await userEvent.selectOptions(malSelectBox, 'GENERELT_FRITEKSTBREV');
  },
};

export const FritekstValg: Story = {
  args: {
    ...DefaultStory.args,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvasElement); // Nødvendig for at selectOptions kall under skal fungere. Må ha fokus på sida.
    const selectBox = canvas.getByLabelText('Mal');
    await userEvent.selectOptions(selectBox, 'VARSEL_FRITEKST');
  },
};

export const TilTredjepartsmottaker: Story = {
  args: {
    ...DefaultStory.args,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvasElement); // Nødvendig for at selectOptions kall under skal fungere. Må ha fokus på sida.
    const selectBox = canvas.getByLabelText('Mottaker');
    await userEvent.selectOptions(selectBox, tredjepartsmottakerValg);
  },
};

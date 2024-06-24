/* eslint-disable import/no-relative-packages */
import type { Meta, StoryObj } from '@storybook/react';

import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { fagsakStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/FagsakStatus.js';
import { expect, userEvent, within } from '@storybook/test';
import withMaxWidth from '@k9-sak-web/gui/storybook/decorators/withMaxWidth.js';
import { FakeMessagesBackendApi } from '@k9-sak-web/gui/storybook/mocks/FakeMessagesBackendApi.js';
import arbeidsgivere from '@k9-sak-web/gui/storybook/mocks/arbeidsgivere.json';
import { templates } from '@k9-sak-web/gui/storybook/mocks/brevmaler.js';
import personopplysninger from '@k9-sak-web/gui/storybook/mocks/personopplysninger.js';
import Messages from './Messages.js';

const meta: Meta<typeof Messages> = {
  title: 'gui/sak/meldinger/Messages.tsx',
  component: Messages,
  decorators: [withMaxWidth(420)],
};
export default meta;

const elemsfinder = (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement)
  return {
    canvas,
    malEl: () => canvas.getByLabelText('Mal'),
    mottakerEl: () => canvas.queryByLabelText('Mottaker'),
    sendTilTredjepartEl: () => canvas.getByLabelText('Send til tredjepart'),
    tittelEl: () => canvas.queryByLabelText('Tittel'),
    fritekstEl: () => canvas.getByLabelText('Fritekst', {exact: false}),
    sendBrevBtn: () => canvas.getByRole('button', {name: "Send brev"}),
    forhåndsvisBtn: () => canvas.getByRole('button', {name: "Forhåndsvis"}),
    innholdsVelgerElQuery: () => canvas.queryByLabelText('Type dokumentasjon du vil etterspørre'),
    innholdsVelgerEl: () => canvas.getByLabelText('Type dokumentasjon du vil etterspørre'),
    orgnrInp: () => canvas.getByLabelText("Organisasjonsnr"),
    orgnrInpQuery: () => canvas.queryByLabelText("Organisasjonsnr"),
    orgNavnInp: () => canvas.queryByLabelText("Navn"),
  }
}

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
  play: async ({canvasElement, step}) => {
    const {
      malEl,
      mottakerEl,
      sendTilTredjepartEl,
      tittelEl,
      fritekstEl,
      sendBrevBtn,
      forhåndsvisBtn,
      orgnrInpQuery,
      orgNavnInp,
    } = elemsfinder(canvasElement)
    await step('Sjekk visning basert på initiell default state', async () => {
      await expect(malEl()).toBeInTheDocument()
      await expect(mottakerEl()).toBeInTheDocument()
      await expect(sendTilTredjepartEl()).toSatisfy(e => e instanceof HTMLInputElement && e.type === "checkbox")
      await expect(sendTilTredjepartEl()).not.toBeChecked()
      await expect(tittelEl()).toBeNull()
      await expect(fritekstEl()).toBeInTheDocument()
      await expect(sendBrevBtn()).toBeInTheDocument()
      await expect(forhåndsvisBtn()).toBeInTheDocument()
      await expect(orgnrInpQuery()).toBeNull()
      await expect(orgNavnInp()).toBeNull()
    })
  }
};

export const MedFritekstTittel: Story = {
  args: {
    ...DefaultStory.args,
  },
  play: async ({ canvasElement, step }) => {
    await userEvent.click(canvasElement);
    const elems = elemsfinder(canvasElement)
    await step('Sjekk visning ved valg av mal som krever tittel felt', async () => {
      await userEvent.selectOptions(elems.malEl(), 'GENERELT_FRITEKSTBREV');
      await expect(elems.tittelEl()).toBeInTheDocument()
      await expect(elems.fritekstEl()).toBeInTheDocument()
      await expect(elems.sendBrevBtn()).toBeInTheDocument()
      await expect(elems.forhåndsvisBtn()).toBeInTheDocument()
      await expect(elems.innholdsVelgerElQuery()).not.toBeInTheDocument()
    })
  },
};

export const FritekstValg: Story = {
  args: {
    ...DefaultStory.args,
  },
  play: async ({ canvasElement, step }) => {
    const {
      malEl,
      innholdsVelgerEl,
      fritekstEl,
    } = elemsfinder(canvasElement)
    await userEvent.click(canvasElement); // Nødvendig for at selectOptions kall under skal fungere. Må ha fokus på sida.
    await step("Sjekk initiell visning ved valg av mal med innholdsforslag", async () => {
      await userEvent.selectOptions(malEl(), 'INNHENT_MEDISINSKE_OPPLYSNINGER');
      await expect(innholdsVelgerEl()).toBeInTheDocument()
      await expect(innholdsVelgerEl()).toHaveValue(FakeMessagesBackendApi.dummyMalinnhold[0]?.tittel)
      await expect(fritekstEl()).toHaveValue(FakeMessagesBackendApi.dummyMalinnhold[0]?.fritekst)
    })
    await step("Fritekst skal skifte viss ny type dokumentasjon blir valgt", async () => {
      await userEvent.selectOptions(innholdsVelgerEl(), FakeMessagesBackendApi.dummyMalinnhold[1]!.tittel)
      await expect(fritekstEl()).toHaveValue(FakeMessagesBackendApi.dummyMalinnhold[1]?.fritekst)
    })
  },
};

export const TilTredjepartsmottaker: Story = {
  args: {
    ...DefaultStory.args,
  },
  play: async ({ canvasElement, step }) => {
    const { sendTilTredjepartEl, orgnrInp, orgNavnInp } = elemsfinder(canvasElement)
    await userEvent.click(canvasElement); // Nødvendig for at tredjepartsmottakerCheckbox kall under skal fungere. Må ha fokus på sida.
    await step("Sjekk initiell visining ved sending til tredjepart", async () => {
      await userEvent.click(sendTilTredjepartEl()) // Aktiver sending til tredjepartsmottaker
      await expect(orgnrInp()).toBeInTheDocument()
      await expect(orgNavnInp()).toBeInTheDocument()
    })
    await step("Inntasting av org nr skal fungere", async () => {
      const orgnr = "333444555"
      await userEvent.type(orgnrInp(), orgnr)
      await expect(orgNavnInp()).toHaveValue(`Fake storybook org (${orgnr})`)
    })
  },
};

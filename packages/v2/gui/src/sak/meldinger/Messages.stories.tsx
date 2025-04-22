import type { Decorator, Meta, StoryObj } from '@storybook/react';

import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { fagsakStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/FagsakStatus.js';
import { expect, fn, userEvent, within } from '@storybook/test';
import withMaxWidth from '@k9-sak-web/gui/storybook/decorators/withMaxWidth.js';
import { FakeMessagesBackendApi } from '@k9-sak-web/gui/storybook/mocks/FakeMessagesBackendApi.js';
import arbeidsgivere from '@k9-sak-web/gui/storybook/mocks/arbeidsgivere.json';
import { templates } from '@k9-sak-web/gui/storybook/mocks/brevmaler.js';
import personopplysninger from '@k9-sak-web/gui/storybook/mocks/personopplysninger.js';
import Messages, { type MessagesProps } from './Messages.js';
import {
  type Mottaker,
  type UtilgjengeligÅrsak,
  utilgjengeligÅrsaker,
} from '@k9-sak-web/backend/k9formidling/models/Mottaker.js';
import { makeFakeExtendedApiError } from '../../storybook/mocks/fakeExtendedApiError.js';
import { action } from '@storybook/addon-actions';
import { StickyStateReducer } from '../../utils/StickyStateReducer.js';

const newStickyState = (): MessagesProps['stickyState'] => ({
  messages: new StickyStateReducer(),
  fritekst: {
    tekst: new StickyStateReducer(),
    tittel: new StickyStateReducer(),
  },
});

const withStickyState = (): Decorator => (Story, ctx) => {
  ctx.args['stickyState'] = newStickyState();
  return <Story />;
};

const api = new FakeMessagesBackendApi();
const meta = {
  title: 'gui/sak/meldinger/Messages.tsx',
  component: Messages,
  decorators: [withMaxWidth(420), withStickyState()],
  beforeEach: () => {
    api.reset();
  },
  args: {
    stickyState: newStickyState(),
  },
} satisfies Meta<typeof Messages>;
export default meta;

const elemsfinder = (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  return {
    canvas,
    malEl: () => canvas.getByLabelText('Mal'),
    mottakerEl: () => canvas.getByLabelText('Mottaker'),
    sendTilTredjepartEl: () => canvas.getByLabelText('Send til tredjepart'),
    tittelEl: () => canvas.queryByLabelText('Tittel'),
    fritekstEl: () => canvas.getByLabelText('Fritekst', { exact: false }),
    sendBrevBtn: () => canvas.getByRole('button', { name: 'Send brev' }),
    forhåndsvisBtn: () => canvas.getByRole('button', { name: 'Forhåndsvis' }),
    innholdsVelgerElQuery: () => canvas.queryByLabelText('Type dokumentasjon du vil etterspørre'),
    innholdsVelgerEl: () => canvas.getByLabelText('Type dokumentasjon du vil etterspørre'),
    orgnrInp: () => canvas.getByLabelText('Organisasjonsnr'),
    orgnrInpQuery: () => canvas.queryByLabelText('Organisasjonsnr'),
    orgNavnInp: () => canvas.queryByLabelText('Navn'),
  };
};

type Story = StoryObj<typeof meta>;
export const DefaultStory: Story = {
  args: {
    fagsak: {
      saksnummer: '100',
      sakstype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN, // FAGSAK_YTELSE
      status: { kode: fagsakStatus.UNDER_BEHANDLING, kodeverk: 'FAGSAK_STATUS' },
      person: {
        aktørId: 'person-aktørid-1',
      },
    },
    behandling: {
      id: 101,
      uuid: 'XUYPS4',
      type: { kode: behandlingType.FØRSTEGANGSSØKNAD, kodeverk: 'BEHANDLING_TYPE' },
      språkkode: {
        kode: 'NB',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    maler: templates,
    personopplysninger,
    arbeidsgiverOpplysningerPerId: arbeidsgivere,
    api,
    onMessageSent: fn(() => action('onMessageSent')),
  },
  play: async ({ canvasElement, step }) => {
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
      innholdsVelgerElQuery,
    } = elemsfinder(canvasElement);
    await step('Sjekk visning basert på initiell default state', async () => {
      await expect(malEl()).toBeInTheDocument();
      await expect(mottakerEl()).toBeInTheDocument();
      await expect(sendTilTredjepartEl()).toSatisfy(e => e instanceof HTMLInputElement && e.type === 'checkbox');
      await expect(sendTilTredjepartEl()).not.toBeChecked();
      await expect(tittelEl()).toBeNull();
      await expect(fritekstEl()).toBeInTheDocument();
      await expect(sendBrevBtn()).toBeInTheDocument();
      await expect(forhåndsvisBtn()).toBeInTheDocument();
      await expect(orgnrInpQuery()).toBeNull();
      await expect(orgNavnInp()).toBeNull();
    });
    await step('Endring til mal med tekstforslag og tilbake skal vise samme initielle default state', async () => {
      await userEvent.selectOptions(malEl(), 'INNHENT_MEDISINSKE_OPPLYSNINGER');
      await expect(innholdsVelgerElQuery()).toBeInTheDocument();
      await userEvent.selectOptions(malEl(), 'INNHEN');
      await expect(innholdsVelgerElQuery()).not.toBeInTheDocument();
      //await userEvent.clear(fritekstEl())
      await expect(fritekstEl()).toHaveValue('');
    });
  },
};

export const MedFritekstTittel: Story = {
  args: {
    ...DefaultStory.args,
  },
  play: async ({ canvasElement, step }) => {
    await userEvent.click(canvasElement);
    const elems = elemsfinder(canvasElement);
    await step('Sjekk visning ved valg av mal som krever tittel felt', async () => {
      await userEvent.selectOptions(elems.malEl(), 'GENERELT_FRITEKSTBREV');
      await expect(elems.tittelEl()).toBeInTheDocument();
      await expect(elems.fritekstEl()).toBeInTheDocument();
      await expect(elems.sendBrevBtn()).toBeInTheDocument();
      await expect(elems.forhåndsvisBtn()).toBeInTheDocument();
      await expect(elems.innholdsVelgerElQuery()).not.toBeInTheDocument();
    });
  },
};

export const FritekstValg: Story = {
  args: {
    ...DefaultStory.args,
  },
  play: async ({ canvasElement, step }) => {
    const { malEl, innholdsVelgerEl, fritekstEl } = elemsfinder(canvasElement);
    await userEvent.click(canvasElement); // Nødvendig for at selectOptions kall under skal fungere. Må ha fokus på sida.
    await step('Sjekk initiell visning ved valg av mal med innholdsforslag', async () => {
      await userEvent.selectOptions(malEl(), 'INNHENT_MEDISINSKE_OPPLYSNINGER');
      await expect(innholdsVelgerEl()).toBeInTheDocument();
      await expect(innholdsVelgerEl()).toHaveValue(FakeMessagesBackendApi.dummyMalinnhold[0]?.tittel);
      await expect(fritekstEl()).toHaveValue(FakeMessagesBackendApi.dummyMalinnhold[0]?.fritekst);
    });
    await step('Fritekst skal skifte viss ny type dokumentasjon blir valgt', async () => {
      await userEvent.selectOptions(innholdsVelgerEl(), FakeMessagesBackendApi.dummyMalinnhold[1]!.tittel);
      await expect(fritekstEl()).toHaveValue(FakeMessagesBackendApi.dummyMalinnhold[1]?.fritekst);
    });
  },
};

export const TilTredjepartsmottaker: Story = {
  args: {
    ...DefaultStory.args,
  },
  play: async ({ canvasElement, step }) => {
    const { sendTilTredjepartEl, orgnrInp, orgNavnInp } = elemsfinder(canvasElement);
    await userEvent.click(canvasElement); // Nødvendig for at tredjepartsmottakerCheckbox kall under skal fungere. Må ha fokus på sida.
    await step('Sjekk initiell visining ved sending til tredjepart', async () => {
      await userEvent.click(sendTilTredjepartEl()); // Aktiver sending til tredjepartsmottaker
      await expect(orgnrInp()).toBeInTheDocument();
      await expect(orgNavnInp()).toBeInTheDocument();
    });
    await step('Inntasting av org nr skal fungere', async () => {
      const orgnr = '333444555';
      await userEvent.type(orgnrInp(), orgnr);
      await expect(orgNavnInp()).toHaveValue(`Fake storybook org (${orgnr})`);
    });
  },
};

// Hjelpefunksjoner brukt i justering av mock data under
const leggTilUtilgjengelig = (mottaker: Mottaker, årsak: UtilgjengeligÅrsak): Mottaker => ({
  ...mottaker,
  utilgjengelig: årsak,
});
const dummyÅrsakResolver = (mottaker: Mottaker): UtilgjengeligÅrsak =>
  mottaker.type === 'AKTØRID' ? utilgjengeligÅrsaker.PERSON_DØD : utilgjengeligÅrsaker.ORG_OPPHØRT;
const leggTilDummyUtilgjengeligÅrsak = (mottaker: Mottaker): Mottaker =>
  leggTilUtilgjengelig(mottaker, dummyÅrsakResolver(mottaker));

export const UtilgjengeligeMottakere: Story = {
  args: {
    ...DefaultStory.args,
    maler: DefaultStory.args?.maler?.map(template => {
      // Juster to første mottakere på alle maler til å vere utilgjengelige
      const mottakere = template.mottakere.map((mottaker, idx) =>
        idx < 2 ? leggTilDummyUtilgjengeligÅrsak(mottaker) : mottaker,
      );
      return {
        ...template,
        mottakere,
      };
    }),
  },
  play: async ({ canvasElement, args, step }) => {
    api.fakeDelayMillis = 0; // Deaktiver delay i automatisert køyring
    const { mottakerEl, fritekstEl, sendBrevBtn } = elemsfinder(canvasElement);
    const tilgjengeligMottaker = args.maler[0]?.mottakere.find(m => m.utilgjengelig === undefined);
    const utilgjengeligMottaker = args.maler[0]?.mottakere.find(m => m.utilgjengelig !== undefined);
    const dummyText = 'dummy text';
    await userEvent.click(canvasElement);
    await step('Initiell visning skal ha valgt mottaker som er tilgjengelig', async () => {
      await expect(mottakerEl()).toHaveValue(tilgjengeligMottaker?.id);
    });
    await step('Submit med gyldig mottaker skal fungere', async () => {
      api.resetSisteFakeDokumentBestilling();
      // Fyll inn tekst så den input er gyldig
      await userEvent.type(fritekstEl(), dummyText);
      await userEvent.click(sendBrevBtn());

      await expect(api.sisteFakeDokumentBestilling?.fritekst).toEqual(dummyText);
      await expect(api.sisteFakeDokumentBestilling?.overstyrtMottaker).toEqual(tilgjengeligMottaker);
    });
    await step(
      'Ved valg av utilgjengelig mottaker skal ein få valideringsfeil ved submit, og bestilling skal ikkje gjennomførast',
      async () => {
        api.resetSisteFakeDokumentBestilling();
        // Fyll inn tekst så den input er gyldig
        await userEvent.type(fritekstEl(), dummyText);
        await expect(utilgjengeligMottaker).toBeDefined();
        await userEvent.selectOptions(mottakerEl(), utilgjengeligMottaker?.id || '');
        await userEvent.click(sendBrevBtn());

        await expect(mottakerEl()).toBeInvalid();
        await expect(api.sisteFakeDokumentBestilling?.fritekst).toBeUndefined();
        await expect(api.sisteFakeDokumentBestilling?.overstyrtMottaker).toBeUndefined();
      },
    );
    api.fakeDelayMillis = 800; // Reaktiver delay
  },
};

class FakeFailingApi extends FakeMessagesBackendApi {
  public override async bestillDokument() {
    throw makeFakeExtendedApiError({ status: 400 });
  }
}

const fakeFailingApi = new FakeFailingApi();
/**
 * Eksempel på feil ved serverkall
 */
export const TekstValideringsfeilServer: Story = {
  args: {
    ...DefaultStory.args,
    api: fakeFailingApi,
  },
};

import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import ugunstAarsakTyper from '@fpsak-frontend/kodeverk/src/ugunstAarsakTyper';
import type { EregOrganizationLookupResponse } from '@k9-sak-web/gui/sak/meldinger/EregOrganizationLookupResponse.js';
import { Meta, StoryObj } from '@storybook/react';
import withMaxWidth from '@k9-sak-web/gui/storybook/decorators/withMaxWidth.js';
import arbeidsgivere from '@k9-sak-web/gui/storybook/mocks/arbeidsgivere.json';
import { FritekstbrevDokumentdata } from '@k9-sak-web/backend/k9formidling/models/FritekstbrevDokumentdata.js';
import { fagsakYtelsesType, FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { ForhåndsvisDto } from '@k9-sak-web/backend/k9formidling/models/ForhåndsvisDto.js';
import type { sak_kontrakt_dokument_BestillBrevDto as BestillBrevDto } from '@k9-sak-web/backend/k9sak/generated';
import { fagsakStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/FagsakStatus.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import type { Språkkode } from '@k9-sak-web/backend/k9sak/kodeverk/Språkkode.js';
import mockedBrevmaler from '../../storybook/stories/mocks/brevmaler';
import MeldingerSakIndex, { BackendApi } from './MeldingerSakIndex';
import personopplysninger from '../../storybook/stories/mocks/personopplysninger.js';

const meta: Meta<typeof MeldingerSakIndex> = {
  title: 'sak/sak-meldinger',
  component: MeldingerSakIndex,
  decorators: [withMaxWidth(500)],
  argTypes: {
    onMessageSent: {
      action: 'onSubmitted',
    },
  },
};
export default meta;

type Story = StoryObj<typeof MeldingerSakIndex>;

const bokmål: Språkkode = {
  kode: 'NB',
  kodeverk: 'SPRAAK_KODE',
};

const defaultFakeBackend = {
  /* eslint-disable @typescript-eslint/no-unused-vars -- Fordi alt er ikkje implementert i fake backend */
  async getBrevMottakerinfoEreg(orgnr: string): Promise<EregOrganizationLookupResponse> {
    if (orgnr.length === 9) {
      if (Number.isFinite(Number(orgnr))) {
        if (orgnr === '000000000') {
          // To test what happens when orgnr is not found
          return { notFound: true };
        }
        return { name: `Fake storybook org (${orgnr})` };
      }
    }
    return { invalidOrgnum: true };
  },

  async bestillDokument(bestilling: BestillBrevDto): Promise<void> {
    throw new Error('Not implemented for test');
  },

  async lagForhåndsvisningPdf(data: ForhåndsvisDto): Promise<Blob> {
    throw new Error('Not implemented for test');
  },

  async hentInnholdBrevmal(
    fagsakYtelsestype: FagsakYtelsesType,
    eksternReferanse: string,
    maltype: string,
  ): Promise<FritekstbrevDokumentdata[]> {
    throw new Error('Not implemented for test');
  },
} satisfies BackendApi;
/* eslint-enable */

const revurderingVarslingArsak = [
  {
    kode: ugunstAarsakTyper.BARN_IKKE_REGISTRERT_FOLKEREGISTER,
    navn: 'Barn ikke registrert i folkeregisteret',
    kodeverk: 'UGUNST',
  },
  {
    kode: ugunstAarsakTyper.ANNET,
    navn: 'Annet',
    kodeverk: 'UGUNST',
  },
];

/**
 * Eit vanleg tilfelle (pleiepenger sykt barn), med mockdata kopiert frå Q
 */
export const SendMeldingPanel: Story = {
  args: {
    templates: mockedBrevmaler,
    behandlingVersjon: 1,
    isKontrollerRevurderingApOpen: false,
    personopplysninger,
    arbeidsgiverOpplysningerPerId: arbeidsgivere,
    revurderingVarslingArsak,
    erTilbakekreving: false,
    featureToggles: { BRUK_V2_MELDINGER: false },
    fagsak: {
      saksnummer: '100',
      sakstype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN, // FAGSAK_YTELSE
      status: { kode: fagsakStatus.UNDER_BEHANDLING, kodeverk: 'FAGSAK_STATUS' },
      person: {
        aktørId: 'person-aktørid-1',
      },
    },
    behandling: {
      id: 1,
      uuid: 'XUYPS4',
      type: { kode: behandlingType.FØRSTEGANGSSØKNAD, kodeverk: 'BEHANDLING_TYPE' },
      språkkode: bokmål,
    },
    backendApi: defaultFakeBackend,
  },
};

/**
 * Viser kva som skjer viss ein berre sende inn ein brevmal til panelet
 */
export const SendMeldingPanelEnMal: Story = {
  args: {
    ...SendMeldingPanel.args,
    templates: {
      [dokumentMalType.INNHENT_DOK]: mockedBrevmaler.INNHEN,
    },
  },
};

/**
 * Viser meldingspanel med engelsk språk kode input
 */
export const SendMeldingPanelEngelsk: Story = {
  args: {
    ...SendMeldingPanel.args,
    behandling: {
      ...SendMeldingPanel.args.behandling,
      språkkode: {
        kode: 'EN',
        kodeverk: 'SPRAAK_KODE',
      },
    },
  },
};

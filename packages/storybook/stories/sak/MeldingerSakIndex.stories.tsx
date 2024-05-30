import React from 'react';
import { action } from '@storybook/addon-actions';

import MeldingerSakIndex, { MessagesModalSakIndex } from '@k9-sak-web/sak-meldinger';
import ugunstAarsakTyper from '@fpsak-frontend/kodeverk/src/ugunstAarsakTyper';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import { BackendApi } from '@k9-sak-web/sak-meldinger/src/MeldingerSakIndex';
import type { EregOrganizationLookupResponse } from '@k9-sak-web/gui/sak/meldinger/EregOrganizationLookupResponse.js';
import { Meta, StoryObj } from '@storybook/react';
import type { BestillBrevDto } from '@k9-sak-web/backend/k9sak/generated';
import type { ForhåndsvisDto } from '@k9-sak-web/backend/k9formidling/models/ForhåndsvisDto.js';
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { FritekstbrevDokumentdata } from '@k9-sak-web/backend/k9formidling/models/FritekstbrevDokumentdata.js';
import arbeidsgivere from '../mocks/arbeidsgivere.json';
import personopplysninger from '../mocks/personopplysninger';
import mockedBrevmaler from '../mocks/brevmaler';
import withReduxProvider from '../../decorators/withRedux';
import withMaxWidth from '../../decorators/withMaxWidth.js';

const meta: Meta<typeof MeldingerSakIndex> = {
  title: 'sak/sak-meldinger',
  component: MeldingerSakIndex,
  decorators: [withMaxWidth(500), withReduxProvider],
  argTypes: {
    submitCallback: {
      action: 'submitCallback',
    },
    previewCallback: {
      action: 'previewCallback',
    },
  },
};
export default meta;

type Story = StoryObj<typeof MeldingerSakIndex>;

const emptySprakKode = {
  kode: '',
  kodeverk: '',
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
    sprakKode: emptySprakKode,
    behandlingId: 1,
    behandlingVersjon: 1,
    isKontrollerRevurderingApOpen: false,
    personopplysninger,
    arbeidsgiverOpplysningerPerId: arbeidsgivere,
    revurderingVarslingArsak,
    erTilbakekreving: false,
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
    sprakKode: {
      kode: 'EN',
      kodeverk: 'Engelsk',
    },
  },
};

export const visMeldingModal = () => <MessagesModalSakIndex showModal closeEvent={action('button-click')} />;

/* eslint-disable import/no-relative-packages */
import { action } from '@storybook/addon-actions';
import React from 'react';

import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import ugunstAarsakTyper from '@fpsak-frontend/kodeverk/src/ugunstAarsakTyper';
import type { EregOrganizationLookupResponse } from '@k9-sak-web/gui/sak/meldinger/EregOrganizationLookupResponse.js';
import { Brevmaler, Kodeverk } from '@k9-sak-web/types';
import arbeidsgivere from '../../storybook/stories/mocks/arbeidsgivere.json';
import mockedBrevmaler from '../../storybook/stories/mocks/brevmaler';
import personopplysninger from '../../storybook/stories/mocks/personopplysninger';
import MeldingerSakIndex, { BackendApi } from './MeldingerSakIndex';
import MessagesModalSakIndex from './MessagesModalSakIndex';

export default {
  title: 'sak/sak-meldinger',
  component: MeldingerSakIndex,
};

const emptySprakKode = {
  kode: '',
  kodeverk: '',
};

interface SendMeldingPanelStoryArgs {
  readonly brevmaler: Brevmaler;
  readonly sprakKode: Kodeverk;
  readonly backendApi?: BackendApi;
}

const defaultFakeBackend = {
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
} satisfies BackendApi;

const sendMeldingTemplate = (props: SendMeldingPanelStoryArgs) => (
  <div
    style={{
      width: '600px',
      margin: '50px',
      padding: '20px',
      backgroundColor: 'white',
    }}
  >
    <MeldingerSakIndex
      submitCallback={action('button-click')}
      previewCallback={action('button-click')}
      behandlingId={1}
      behandlingVersjon={1}
      isKontrollerRevurderingApOpen={false}
      personopplysninger={personopplysninger}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
      revurderingVarslingArsak={[
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
      ]}
      erTilbakekreving={false}
      backendApi={defaultFakeBackend}
      {...props}
    />
  </div>
);

/**
 * Eit vanleg tilfelle (pleiepenger sykt barn), med mockdata kopiert frå Q
 */
export const SendMeldingPanel = props => sendMeldingTemplate(props);

SendMeldingPanel.args = {
  templates: mockedBrevmaler,
  sprakKode: emptySprakKode,
};

/**
 * Viser kva som skjer viss ein berre sende inn ein brevmal til panelet
 */
export const SendMeldingPanelEnMal = props => sendMeldingTemplate(props);

SendMeldingPanelEnMal.args = {
  templates: {
    [dokumentMalType.INNHENT_DOK]: mockedBrevmaler.INNHEN,
  },
  sprakKode: emptySprakKode,
};

/**
 * Viser meldingspanel med engelsk språk kode input
 */
export const SendMeldingPanelEngelsk = props => sendMeldingTemplate(props);

SendMeldingPanelEngelsk.args = {
  templates: mockedBrevmaler,
  sprakKode: {
    kode: 'EN',
    kodeverk: 'Engelsk',
  },
};

export const visMeldingModal = () => <MessagesModalSakIndex showModal closeEvent={action('button-click')} />;

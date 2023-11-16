import React from 'react';
import { action } from '@storybook/addon-actions';
import { object, withKnobs } from '@storybook/addon-knobs';

import MeldingerSakIndex, { MessagesModalSakIndex } from '@k9-sak-web/sak-meldinger';
import ugunstAarsakTyper from '@fpsak-frontend/kodeverk/src/ugunstAarsakTyper';

import { Brevmaler, EregOrganizationLookupResponse, Kodeverk } from "@k9-sak-web/types";
import dokumentMalType from "@fpsak-frontend/kodeverk/src/dokumentMalType";
import { BackendApi } from "@k9-sak-web/sak-meldinger/src/MeldingerSakIndex";
import arbeidsgivere from '../mocks/arbeidsgivere.json';
import personopplysninger from '../mocks/personopplysninger';
import mockedBrevmaler from '../mocks/brevmaler';
import withReduxProvider from '../../decorators/withRedux';

export default {
  title: 'sak/sak-meldinger',
  component: MeldingerSakIndex,
  decorators: [withKnobs, withReduxProvider],
};

const emptySprakKode = {
  kode: '',
  kodeverk: '',
};

interface SendMeldingPanelStoryArgs {
  readonly brevmaler: Brevmaler;
  readonly sprakKode?: Kodeverk;
  readonly backendApi?: BackendApi;
}

const defaultFakeBackend = {
  async getTredjepartsmottakerInfo(orgnr: string): Promise<EregOrganizationLookupResponse> {
    if (orgnr.length === 9) {
      if(Number.isFinite(Number(orgnr))) {
        if(orgnr === "000000000") { // To test what happens when orgnr is not found
          return {notFound: true}
        }
        return {name: `Fake storybook org (${orgnr})`}
      }
    }
    return {invalidOrgnum: true}
  }
} satisfies BackendApi

const sendMeldingTemplate = ({brevmaler, sprakKode = emptySprakKode}: SendMeldingPanelStoryArgs) => (
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
      templates={object('templates', brevmaler)}
      sprakKode={object('sprakKode', sprakKode)}
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
    />
  </div>
)

/**
 * Eit vanleg tilfelle (pleiepenger sykt barn), med mockdata kopiert frå Q
 */
export const SendMeldingPanel= () => sendMeldingTemplate({brevmaler: mockedBrevmaler})

/**
 * Viser kva som skjer viss ein berre sende inn ein brevmal til panelet
 */
export const SendMeldingPanelEnMal = () => {
  const enBrevmal: Brevmaler = {
    [dokumentMalType.INNHENT_DOK]: mockedBrevmaler.INNHEN
  }
  return sendMeldingTemplate({brevmaler: enBrevmal})
}

/**
 * Viser meldingspanel med engelsk språk kode input
 */
export const SendMeldingPanelEngelsk= () => {
  const sprakKode: Kodeverk = {
    kode: 'EN',
    kodeverk: 'Engelsk'
  }

  return sendMeldingTemplate({brevmaler: mockedBrevmaler, sprakKode})
}


export const visMeldingModal = () => <MessagesModalSakIndex showModal closeEvent={action('button-click')} />;

import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs';

import MeldingerSakIndex, { MessagesModalSakIndex } from '@k9-sak-web/sak-meldinger';
import ugunstAarsakTyper from '@fpsak-frontend/kodeverk/src/ugunstAarsakTyper';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';

import arbeidsgivere from '../mocks/arbeidsgivere.json';
import withReduxProvider from '../../decorators/withRedux';

const templates = {
  [dokumentMalType.INNHENT_DOK]: {
    navn: 'Innhent dokumentasjon',
    mottakere: [
      {
        id: '00000000',
        type: 'AKTØRID',
      },
      {
        id: '123456789',
        type: 'ORGNR',
      },
    ],
  },
  [dokumentMalType.REVURDERING_DOK]: {
    navn: 'Revurderingsdokumentasjon',
    mottakere: [
      {
        id: '00000000',
        type: 'AKTØRID',
      },
      {
        id: '123456789',
        type: 'ORGNR',
      },
    ],
  },
};

const sprakKode = {
  kode: '',
  kodeverk: '',
};

export default {
  title: 'sak/sak-meldinger',
  component: MeldingerSakIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visMeldingerPanel = () => (
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
      templates={object('templates', templates)}
      sprakKode={object('sprakKode', sprakKode)}
      previewCallback={action('button-click')}
      behandlingId={1}
      behandlingVersjon={1}
      isKontrollerRevurderingApOpen={false}
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
    />
  </div>
);

export const visMeldingModal = () => <MessagesModalSakIndex showModal closeEvent={action('button-click')} />;

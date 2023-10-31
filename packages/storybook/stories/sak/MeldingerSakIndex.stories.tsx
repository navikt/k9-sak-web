import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs';

import MeldingerSakIndex, { MessagesModalSakIndex } from '@k9-sak-web/sak-meldinger';
import ugunstAarsakTyper from '@fpsak-frontend/kodeverk/src/ugunstAarsakTyper';

import arbeidsgivere from '../mocks/arbeidsgivere.json';
import personopplysninger from '../mocks/personopplysninger';
import brevmaler from '../mocks/brevmaler';
import withReduxProvider from '../../decorators/withRedux';


export default {
  title: 'sak/sak-meldinger',
  component: MeldingerSakIndex,
  decorators: [withKnobs, withReduxProvider],
};

const sprakKode = {
  kode: '',
  kodeverk: '',
};

export const SendMeldingPanel = () => (
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
      />
    </div>
  )


export const visMeldingModal = () => <MessagesModalSakIndex showModal closeEvent={action('button-click')} />;

import { action } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import React from 'react';

import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@k9-sak-web/kodeverk/src/aksjonspunktStatus';
import RisikoklassifiseringSakIndex from '@k9-sak-web/sak-risikoklassifisering';
import kontrollresultatKode from '@k9-sak-web/sak-risikoklassifisering/src/kodeverk/kontrollresultatKode';

import { Aksjonspunkt } from '@k9-sak-web/types';
import withReduxProvider from '../../decorators/withRedux';

const withWidthProvider = story => <div style={{ width: '600px' }}>{story()}</div>;

export default {
  title: 'sak/sak-risikoklassifisering',
  component: RisikoklassifiseringSakIndex,
  decorators: [withKnobs, withReduxProvider, withWidthProvider],
};

export const visPanelUtenInformasjon = () => (
  <RisikoklassifiseringSakIndex
    behandlingId={1}
    behandlingVersjon={1}
    isPanelOpen={boolean('isPanelOpen', false)}
    readOnly={boolean('readOnly', false)}
    submitAksjonspunkt={action('button-click') as () => Promise<any>}
    toggleRiskPanel={action('button-click')}
  />
);

export const visPanelForLavRisikoklassifisering = () => (
  <RisikoklassifiseringSakIndex
    behandlingId={1}
    behandlingVersjon={1}
    risikoklassifisering={{
      kontrollresultat: {
        kode: kontrollresultatKode.IKKE_HOY,
        kodeverk: '',
      },
    }}
    isPanelOpen={boolean('isPanelOpen', false)}
    readOnly={boolean('readOnly', false)}
    submitAksjonspunkt={action('button-click') as () => Promise<any>}
    toggleRiskPanel={action('button-click')}
  />
);

export const visPanelForHøyRisikoklassifisering = () => (
  <RisikoklassifiseringSakIndex
    behandlingId={1}
    behandlingVersjon={1}
    aksjonspunkt={
      {
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FARESIGNALER,
          kodeverk: '',
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
          kodeverk: '',
        },
        begrunnelse: undefined,
      } as Aksjonspunkt
    }
    risikoklassifisering={{
      kontrollresultat: {
        kode: kontrollresultatKode.HOY,
        kodeverk: '',
      },
      medlFaresignaler: {
        faresignaler: ['Søker bor hos foreldre'],
      },
      iayFaresignaler: {
        faresignaler: [
          'Søkers lønn har runde tall',
          'Det er nær relasjon mellom søker og sentral rolle hos Statoil',
          'Statoil er nyoppstartet',
        ],
      },
    }}
    readOnly={boolean('readOnly', false)}
    submitAksjonspunkt={action('button-click') as () => Promise<any>}
    isPanelOpen
    toggleRiskPanel={action('button-click')}
  />
);

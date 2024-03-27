import React from 'react';
import { action } from '@storybook/addon-actions';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import RisikoklassifiseringSakIndex from '@fpsak-frontend/sak-risikoklassifisering';
import kontrollresultatKode from '@fpsak-frontend/sak-risikoklassifisering/src/kodeverk/kontrollresultatKode';

import { Aksjonspunkt } from '@k9-sak-web/types';
import withReduxProvider from '../../decorators/withRedux';

const withWidthProvider = story => <div style={{ width: '600px' }}>{story()}</div>;

export default {
  title: 'sak/sak-risikoklassifisering',
  component: RisikoklassifiseringSakIndex,
  decorators: [withReduxProvider, withWidthProvider],
};

export const visPanelUtenInformasjon = () => (
  <RisikoklassifiseringSakIndex
    behandlingId={1}
    behandlingVersjon={1}
    isPanelOpen={false}
    readOnly={false}
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
    isPanelOpen={false}
    readOnly={false}
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
    readOnly={false}
    submitAksjonspunkt={action('button-click') as () => Promise<any>}
    isPanelOpen
    toggleRiskPanel={action('button-click')}
  />
);

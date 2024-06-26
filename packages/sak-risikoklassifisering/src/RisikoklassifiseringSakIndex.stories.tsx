import { action } from '@storybook/addon-actions';
import React from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { Aksjonspunkt } from '@k9-sak-web/types';
import RisikoklassifiseringSakIndex from './RisikoklassifiseringSakIndex';
import kontrollresultatKode from './kodeverk/kontrollresultatKode';

const withWidthProvider = story => <div style={{ width: '600px' }}>{story()}</div>;

export default {
  title: 'sak/sak-risikoklassifisering',
  component: RisikoklassifiseringSakIndex,
  decorators: [withWidthProvider],
};

export const visPanelUtenInformasjon = props => (
  <RisikoklassifiseringSakIndex
    behandlingId={1}
    behandlingVersjon={1}
    submitAksjonspunkt={action('button-click') as () => Promise<any>}
    toggleRiskPanel={action('button-click')}
    {...props}
  />
);

visPanelUtenInformasjon.args = {
  isPanelOpen: false,
  readOnly: false,
};

export const visPanelForLavRisikoklassifisering = props => (
  <RisikoklassifiseringSakIndex
    behandlingId={1}
    behandlingVersjon={1}
    risikoklassifisering={{
      kontrollresultat: {
        kode: kontrollresultatKode.IKKE_HOY,
        kodeverk: '',
      },
    }}
    submitAksjonspunkt={action('button-click') as () => Promise<any>}
    toggleRiskPanel={action('button-click')}
    {...props}
  />
);

visPanelForLavRisikoklassifisering.args = {
  isPanelOpen: false,
  readOnly: false,
};

export const visPanelForHøyRisikoklassifisering = props => (
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
    submitAksjonspunkt={action('button-click') as () => Promise<any>}
    isPanelOpen
    toggleRiskPanel={action('button-click')}
    {...props}
  />
);

visPanelForHøyRisikoklassifisering.args = {
  readOnly: false,
};

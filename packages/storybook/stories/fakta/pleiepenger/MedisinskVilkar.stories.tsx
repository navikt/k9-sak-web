import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';
import MedisinskVilkarIndex from '@fpsak-frontend/fakta-medisinsk-vilkar';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import withReduxProvider from '../../../decorators/withRedux';
import alleKodeverk from '../../mocks/alleKodeverk.json';

const behandling = {
  id: '1',
  versjon: 1,
  sprakkode: {
    kode: 'NO',
  },
};

// FIXME bytt ut med riktig akjsonpunkt når det er klart
const aksjonspunkter = [
  {
    definisjon: {
      kode: aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN,
    },
    status: {
      kode: aksjonspunktStatus.OPPRETTET,
    },
    begrunnelse: undefined,
    kanLoses: true,
    erAktivt: true,
  },
];

const toggle = (openInfoPanels, togglePanel) => value => {
  const exists = openInfoPanels.some(op => op === value);
  return togglePanel(exists ? [] : [value]);
};

export default {
  title: 'fakta/pleiepenger/fakta-medisinsk-vilkar',
  component: MedisinskVilkarIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visFaktaOmMedisinskVilkar = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.MEDISINSKVILKAAR]);
  return (
    <MedisinskVilkarIndex
      behandling={object('behandling', behandling)}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
      aksjonspunkter={[]}
      alleKodeverk={alleKodeverk}
    />
  );
};

export const visFaktaOmMedisinskVilkarMedAkjsonspunkt = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.MEDISINSKVILKAAR]);
  return (
    <MedisinskVilkarIndex
      behandling={object('behandling', behandling)}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
      aksjonspunkter={aksjonspunkter}
      alleKodeverk={alleKodeverk}
    />
  );
};

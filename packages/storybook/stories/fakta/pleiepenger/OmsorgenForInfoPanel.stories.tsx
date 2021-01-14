import * as React from 'react';
import { action } from '@storybook/addon-actions';

import OmsorgenForFaktaIndex from '@fpsak-frontend/fakta-omsorgen-for/src/OmsorgenForFaktaIndex';
import { Behandling, OmsorgenFor, Personopplysninger } from '@k9-sak-web/types';

import withReduxProvider from '../../../decorators/withRedux';

const behandling = {
  id: 1,
  versjon: 1,
} as Behandling;

export default {
  title: 'fakta/pleiepenger/fakta-omsorgen-for',
  component: OmsorgenForFaktaIndex,
  decorators: [withReduxProvider],
};

export const visFaktaOmAlderOgOmsorg = () => {
  return (
    <OmsorgenForFaktaIndex
      behandling={behandling}
      personopplysninger={{} as Personopplysninger}
      omsorgenFor={{} as OmsorgenFor}
      submitCallback={action('button-click')}
      harApneAksjonspunkter
      submittable
      aksjonspunkter={[]}
      readOnly
    />
  );
};

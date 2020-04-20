import React from 'react';
import { Behandling } from '@k9-sak-web/types';
import { action } from '@storybook/addon-actions';
import OmsorgenForFaktaIndex from '@k9-sak-web/omsorgen-for-oms';
import withReduxProvider from '../../decorators/withRedux';

export default {
  title: 'omsorgspenger/fakta/Omsorgen for',
  component: OmsorgenForFaktaIndex,
  decorators: [withReduxProvider],
};

const behandling: Behandling = {
  id: 1,
  versjon: 1,
  status: {
    kode: '1',
    kodeverk: '1',
  },
  type: {
    kode: '1',
    kodeverk: '1',
  },
  behandlingPaaVent: false,
  behandlingHenlagt: false,
  links: [],
};

export const omsorgenFor = () => <OmsorgenForFaktaIndex behandling={behandling} submitCallback={action('Send inn')} />;

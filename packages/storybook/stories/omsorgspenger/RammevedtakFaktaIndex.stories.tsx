import * as React from 'react';
import FaktaRammevedtakIndex from '@k9-sak-web/omsorgspenger-fakta-rammevedtak';
import { Behandling } from '@k9-sak-web/types';
import { action } from '@storybook/addon-actions';
import withReduxProvider from '../../decorators/withRedux';

export default {
  title: 'omsorgspenger/fakta',
  component: FaktaRammevedtakIndex,
  decorators: [withReduxProvider],
};

const behandling: Behandling = {
  id: 1,
  versjon: 1,
  status: {
    kode: '',
    kodeverk: '',
  },
  type: {
    kode: '',
    kodeverk: 'BEHANDLING_TYPE',
  },
  behandlingPaaVent: false,
  behandlingHenlagt: false,
  links: [],
};

export const faktaRammevedtak = () => (
  <FaktaRammevedtakIndex behandling={behandling} submitCallback={action('Send inn')} />
);

import SoknadsperioderIndex from '@k9-sak-web/fakta-soknadsperioder';
import { withKnobs } from '@storybook/addon-knobs';
import React from 'react';
import withReduxProvider from '../../../decorators/withRedux';

export default {
  title: 'fakta/pleiepenger/fakta-soknadsperioder',
  component: SoknadsperioderIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visFaktaOmSøknadsperioder = () => <SoknadsperioderIndex readOnly={false} />;

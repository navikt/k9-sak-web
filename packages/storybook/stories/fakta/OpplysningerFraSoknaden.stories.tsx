import OpplysningerFraSoknadenIndex from '@fpsak-frontend/fakta-opplysninger-fra-soknaden';
import { action } from '@storybook/addon-actions';
import * as React from 'react';
import withReduxProvider from '../../decorators/withRedux';

const behandling = {
  id: 1,
  versjon: 1,
};

const opplysningerFraSøknaden = {
  førSøkerPerioden: {
    oppgittEgenNæring: [{ periode: { fom: '2019-01-01', tom: '2019-12-31' }, bruttoInntekt: { verdi: 540000.0 } }],
    oppgittFrilans: null,
  },
  iSøkerPerioden: {
    oppgittEgenNæring: [{ periode: { fom: '2020-04-01', tom: '2020-04-30' }, bruttoInntekt: { verdi: 20000.0 } }],
    oppgittFrilans: null,
  },
  periodeFraSøknad: { fom: '2020-04-01', tom: '2020-04-30' },
  søkerYtelseForFrilans: false,
  søkerYtelseForNæring: true,
};

export default {
  title: 'fakta/fakta-opplysninger-fra-søknaden',
  component: OpplysningerFraSoknadenIndex,
  decorators: [withReduxProvider],
};

export const visOpplysningerFraSøknaden = () => {
  return (
    <OpplysningerFraSoknadenIndex
      behandling={behandling}
      readOnly={false}
      submitCallback={action('button-click')}
      harApneAksjonspunkter
      submittable
      kanEndrePåSøknadsopplysninger
      oppgittOpptjening={opplysningerFraSøknaden}
    />
  );
};

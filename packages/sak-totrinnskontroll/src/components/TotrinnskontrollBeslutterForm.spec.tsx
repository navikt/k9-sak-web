import React from 'react';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { Behandling, TotrinnskontrollSkjermlenkeContext } from '@k9-sak-web/types';

import { TotrinnskontrollBeslutterForm } from './TotrinnskontrollBeslutterForm';
import shallowWithIntl from '../../i18n/index';

const location = {
  pathname: '',
  search: '',
  state: {},
  hash: '',
  key: '',
};

describe('<TotrinnskontrollBeslutterForm>', () => {
  const behandling = {
    id: 1234,
    versjon: 123,
    type: 'BT-001',
    opprettet: '‎29.08.‎2017‎ ‎09‎:‎54‎:‎22',
    status: 'FVED',
    toTrinnsBehandling: true,
  } as Behandling;

  it('skal ikke vise preview brev link for tilbakekreving', () => {
    const totrinnskontrollSkjermlenkeContext = [
      {
        skjermlenkeType: 'test',
        totrinnskontrollAksjonspunkter: [],
      },
    ] as TotrinnskontrollSkjermlenkeContext[];

    const wrapper = shallowWithIntl(
      <TotrinnskontrollBeslutterForm
        {...reduxFormPropsMock}
        behandling={behandling}
        totrinnskontrollSkjermlenkeContext={totrinnskontrollSkjermlenkeContext}
        readOnly={false}
        erTilbakekreving
        lagLenke={() => location}
        erForeldrepengerFagsak
        arbeidsforholdHandlingTyper={[]}
        skjemalenkeTyper={[]}
        aksjonspunktGodkjenning={[]}
      />,
    );

    const form = wrapper.find('form');
    expect(form).toHaveLength(1);

    const button = wrapper.find('button');
    expect(button).toHaveLength(0);
  });
});

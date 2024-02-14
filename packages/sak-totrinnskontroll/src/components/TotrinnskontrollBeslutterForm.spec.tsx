import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { Behandling, TotrinnskontrollSkjermlenkeContext } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import { TotrinnskontrollBeslutterForm } from './TotrinnskontrollBeslutterForm';

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
    type: {
      kode: 'BT-001',
      kodeverk: '',
    },
    opprettet: '‎29.08.‎2017‎ ‎09‎:‎54‎:‎22',
    status: {
      kode: 'FVED',
      kodeverk: '',
    },
    toTrinnsBehandling: true,
  } as Behandling;

  it('skal ikke vise preview brev link for tilbakekreving', () => {
    const totrinnskontrollSkjermlenkeContext = [
      {
        skjermlenkeType: 'test',
        totrinnskontrollAksjonspunkter: [],
      },
    ] as TotrinnskontrollSkjermlenkeContext[];

    renderWithIntlAndReduxForm(
      <TotrinnskontrollBeslutterForm
        {...reduxFormPropsMock}
        behandling={behandling}
        totrinnskontrollSkjermlenkeContext={totrinnskontrollSkjermlenkeContext}
        readOnly={false}
        erTilbakekreving
        lagLenke={() => location}
        arbeidsforholdHandlingTyper={[]}
        skjemalenkeTyper={[]}
        aksjonspunktGodkjenning={[]}
      />,
      { messages },
    );
    expect(screen.queryByRole('button', { name: 'Forhåndsvis' })).not.toBeInTheDocument();
  });
});

import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
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
  const behandling: Behandling = {
    id: 1234,
    uuid: 'uuid-1234',
    versjon: 123,
    type: {
      kode: 'BT-002',
      kodeverk: 'BEHANDLING_TYPE',
    },
    opprettet: '‎29.08.‎2017‎ ‎09‎:‎54‎:‎22',
    status: {
      kode: 'FVED',
      kodeverk: '',
    },
    behandlingHenlagt: false,
    behandlingPaaVent: false,
    gjeldendeVedtak: false,
    links: [],
    toTrinnsBehandling: true,
    sprakkode: { kode: 'NO', kodeverk: 'SPRAAK_KODE' },
    behandlendeEnhetId: 'XX',
    behandlendeEnhetNavn: 'YYY',
    behandlingKoet: false,
    behandlingÅrsaker: [
      {
        behandlingArsakType: { kode: '-', kodeverk: '' },
        manueltOpprettet: true,
        erAutomatiskRevurdering: false,
      },
    ],
  };

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

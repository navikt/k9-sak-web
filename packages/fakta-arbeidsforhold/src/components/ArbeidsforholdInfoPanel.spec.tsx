import React from 'react';
import sinon from 'sinon';
import { screen } from '@testing-library/react';

import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';

import ArbeidsforholdInfoPanel from './ArbeidsforholdInfoPanel';

import messages from '../../i18n/nb_NO.json';

const ap5080 = {
  aksjonspunktType: 'MANU',
  begrunnelse: null,
  besluttersBegrunnelse: null,
  definisjon: '5080',
  erAktivt: true,
  fristTid: null,
  kanLoses: true,
  status: 'OPPR',
  toTrinnsBehandling: false,
  toTrinnsBehandlingGodkjent: null,
  vilkarType: null,
  vurderPaNyttArsaker: null,
  venteårsak: '-',
};

const submitCallback = sinon.spy();

describe('<ArbeidsforholdInfoPanel>', () => {
  it('Skal vise komponenten korrekt med aksjonspunkt hvor man ikke kan legge til nye arbeidsforhold', () => {
    renderWithIntlAndReduxForm(
      <ArbeidsforholdInfoPanel
        intl={intlMock}
        aksjonspunkter={[ap5080]}
        readOnly={false}
        submitCallback={submitCallback}
        arbeidsforhold={[]}
        hasOpenAksjonspunkter
        behandlingId={1}
        behandlingVersjon={1}
        arbeidsgiverOpplysningerPerId={{}}
        alleMerknaderFraBeslutter={{}}
        {...reduxFormPropsMock}
      />,
      { messages },
    );

    expect(screen.getByText('Aktive arbeidsforhold')).toBeInTheDocument();
    expect(screen.getByText('Avklar om arbeidsforholdene skal benyttes i behandlingen')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeInTheDocument();
  });

  it('Skal vise komponenten korrekt uten aksjonspunkt hvor man kan legge til nye arbeidsforhold', () => {
    renderWithIntlAndReduxForm(
      <ArbeidsforholdInfoPanel
        intl={intlMock}
        aksjonspunkter={[]}
        submitCallback={submitCallback}
        arbeidsforhold={[]}
        readOnly={false}
        hasOpenAksjonspunkter={false}
        behandlingId={1}
        behandlingVersjon={1}
        arbeidsgiverOpplysningerPerId={{}}
        alleMerknaderFraBeslutter={{}}
        {...reduxFormPropsMock}
      />,
      { messages },
    );
    expect(screen.getByText('Aktive arbeidsforhold')).toBeInTheDocument();
    expect(screen.queryByText('Avklar om arbeidsforholdene skal benyttes i behandlingen')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

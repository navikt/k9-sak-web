import { intlMock } from '@k9-sak-web/utils-test/intl-test-helper';
import { reduxFormPropsMock } from '@k9-sak-web/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import ArbeidsforholdInfoPanel from './ArbeidsforholdInfoPanel';

const ap5080 = {
  aksjonspunktType: {
    kode: 'MANU',
    kodeverk: 'AKSJONSPUNKT_TYPE',
  },
  begrunnelse: null,
  besluttersBegrunnelse: null,
  definisjon: {
    kode: '5080',
    kodeverk: 'AKSJONSPUNKT_DEF',
  },
  erAktivt: true,
  fristTid: null,
  kanLoses: true,
  status: {
    kode: 'OPPR',
    kodeverk: 'AKSJONSPUNKT_STATUS',
  },
  toTrinnsBehandling: false,
  toTrinnsBehandlingGodkjent: null,
  vilkarType: null,
  vurderPaNyttArsaker: null,
  venteårsak: {
    kode: '-',
    kodeverk: 'VENT_AARSAK',
  },
};

const submitCallback = vi.fn();

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
        alleKodeverk={{}}
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
        alleKodeverk={{}}
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

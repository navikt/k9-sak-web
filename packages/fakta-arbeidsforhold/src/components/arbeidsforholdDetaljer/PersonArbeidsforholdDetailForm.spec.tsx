import React from 'react';
import { screen } from '@testing-library/react';

import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';

import { PersonArbeidsforholdDetailForm } from './PersonArbeidsforholdDetailForm';

import messages from '../../../i18n/nb_NO.json';

describe('<PersonArbeidsforholdDetailForm>', () => {
  const arbeidsforhold = {
    id: '1',
    arbeidsforhold: {
      eksternArbeidsforholdId: '1231-2345',
      internArbeidsforholdId: '1231-2345',
    },
    arbeidsgiver: {
      arbeidsgiverOrgnr: '1234567',
      arbeidsgiverAktørId: null,
    },
    perioder: [
      {
        fom: '2018-01-01',
        tom: '2018-10-10',
      },
    ],
    kilde: ['INNTEKT'],
    handlingType: 'BRUK',
    aksjonspunktÅrsaker: ['INNTEKTSMELDING_UTEN_ARBEIDSFORHOLD'],
    inntektsmeldinger: [],
  };
  it('skal ikke vise tekstfelt for begrunnelse når form ikke er dirty og begrunnelse ikke har verdi', () => {
    renderWithIntlAndReduxForm(
      <PersonArbeidsforholdDetailForm
        {...reduxFormPropsMock}
        intl={intlMock}
        updateArbeidsforhold={() => undefined}
        onSubmit={() => undefined}
        validate={() => undefined}
        skjulArbeidsforhold={() => undefined}
        arbeidsforhold={arbeidsforhold}
        initialValues={{
          begrunnelse: '',
        }}
        behandlingId={1}
        behandlingVersjon={1}
      />,
      { messages },
    );

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('skal vise radioknapper når arbeidsforholdUtenIM', () => {
    renderWithIntlAndReduxForm(
      <PersonArbeidsforholdDetailForm
        {...reduxFormPropsMock}
        intl={intlMock}
        updateArbeidsforhold={() => undefined}
        onSubmit={() => undefined}
        validate={() => undefined}
        skjulArbeidsforhold={() => undefined}
        arbeidsforhold={arbeidsforhold}
        initialValues={{
          begrunnelse: '',
        }}
        behandlingId={1}
        behandlingVersjon={1}
      />,
      { messages },
    );

    expect(
      screen.getByText('Skal arbeidsforholdet opprettes selv om det ikke finnes i Aa-registeret?'),
    ).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Ja' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Nei, fortsett behandling' })).toBeInTheDocument();
  });

  it('skal ikke vise radioknapper når det er mismatch med arbeidsforholdId og virksomhetsnummer', () => {
    const arbeidsforhold2 = {
      ...arbeidsforhold,
      aksjonspunktÅrsaker: ['OVERGANG_ARBEIDSFORHOLDS_ID_UNDER_YTELSE'],
    };
    renderWithIntlAndReduxForm(
      <PersonArbeidsforholdDetailForm
        {...reduxFormPropsMock}
        intl={intlMock}
        updateArbeidsforhold={() => undefined}
        onSubmit={() => undefined}
        validate={() => undefined}
        skjulArbeidsforhold={() => undefined}
        arbeidsforhold={arbeidsforhold2}
        initialValues={{
          begrunnelse: '',
        }}
        behandlingId={1}
        behandlingVersjon={1}
      />,
      { messages },
    );
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
  });
});

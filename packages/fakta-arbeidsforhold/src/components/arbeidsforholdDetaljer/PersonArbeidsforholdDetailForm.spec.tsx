import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../i18n/nb_NO.json';
import { PersonArbeidsforholdDetailForm } from './PersonArbeidsforholdDetailForm';

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
    kilde: [
      {
        kode: 'INNTEKT',
        kodeverk: '',
      },
    ],
    handlingType: {
      kode: 'BRUK',
      kodeverk: 'ARBEIDSFORHOLD_HANDLING_TYPE',
    },
    aksjonspunktÅrsaker: [
      {
        kode: 'INNTEKTSMELDING_UTEN_ARBEIDSFORHOLD',
        kodeverk: 'ARBEIDSFORHOLD_AKSJONSPUNKT_ÅRSAKER',
      },
    ],
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
      aksjonspunktÅrsaker: [
        {
          kode: 'OVERGANG_ARBEIDSFORHOLDS_ID_UNDER_YTELSE',
          kodeverk: 'ARBEIDSFORHOLD_AKSJONSPUNKT_ÅRSAKER',
        },
      ],
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

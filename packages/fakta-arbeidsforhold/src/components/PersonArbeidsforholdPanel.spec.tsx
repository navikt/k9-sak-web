import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import { PersonArbeidsforholdPanelImpl } from './PersonArbeidsforholdPanel';

const arbeidsgiverOpplysningerPerId = {
  1234567: {
    identifikator: '1234567',
    referanse: '1234567',
    navn: 'Svendsen Eksos',
    fødselsdato: null,
    erPrivatPerson: true,
    arbeidsforholdreferanser: [
      {
        eksternArbeidsforholdId: '1231-2345',
        internArbeidsforholdId: '1231-2345',
      },
    ],
  },
  2345678: {
    identifikator: '2345678',
    referanse: '2345678',
    navn: 'Nav',
    fødselsdato: null,
    erPrivatPerson: true,
    arbeidsforholdreferanser: [],
  },
};

describe('<PersonArbeidsforholdPanel>', () => {
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

  it('skal rendre komponent', async () => {
    const arbeidsgiver = {
      arbeidsgiverOrgnr: '1234567',
      arbeidsgiverAktørId: null,
    };

    renderWithIntlAndReduxForm(
      <PersonArbeidsforholdPanelImpl
        intl={intlMock}
        readOnly={false}
        harAksjonspunktAvklarArbeidsforhold
        arbeidsforhold={[arbeidsforhold]}
        behandlingFormPrefix="panel"
        reduxFormChange={vi.fn()}
        reduxFormInitialize={vi.fn()}
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />,
      { messages },
    );

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'PersonArbeidsforholdPanel.VisArbeidsforhold' }));
    });
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});

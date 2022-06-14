import React from 'react';
import sinon from 'sinon';
import PersonArbeidsforholdTable from './arbeidsforholdTabell/PersonArbeidsforholdTable';
import { PersonArbeidsforholdPanelImpl } from './PersonArbeidsforholdPanel';
import shallowWithIntl, { intlMock } from '../../i18n/intl-enzyme-test-helper-fakta-arbeidsforhold';

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
      }
    ]
  },
  2345678: {
    identifikator: '2345678',
    referanse: '2345678',
    navn: 'Nav',
    fødselsdato: null,
    erPrivatPerson: true,
    arbeidsforholdreferanser: []
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
    kilde: ['INNTEKT'],
    handlingType: 'BRUK',
    aksjonspunktÅrsaker: ['INNTEKTSMELDING_UTEN_ARBEIDSFORHOLD'],
    inntektsmeldinger: [],
  };

  it('skal rendre komponent', () => {
    const arbeidsgiver = {
      arbeidsgiverOrgnr: '1234567',
      arbeidsgiverAktørId: null,
    };

    const wrapper = shallowWithIntl(
      <PersonArbeidsforholdPanelImpl
        intl={intlMock}
        readOnly={false}
        harAksjonspunktAvklarArbeidsforhold
        arbeidsforhold={[arbeidsforhold]}
        behandlingFormPrefix="panel"
        reduxFormChange={sinon.spy()}
        reduxFormInitialize={sinon.spy()}
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />,
    );

    wrapper.setState({ selectedArbeidsgiver: arbeidsgiver.arbeidsgiverOrgnr });
    expect(wrapper.find(PersonArbeidsforholdTable)).toHaveLength(1);
  });
});

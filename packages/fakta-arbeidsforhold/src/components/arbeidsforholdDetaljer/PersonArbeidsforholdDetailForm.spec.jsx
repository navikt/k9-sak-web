import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { TextAreaField } from '@fpsak-frontend/form';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { PersonArbeidsforholdDetailForm } from './PersonArbeidsforholdDetailForm';
import LeggTilArbeidsforholdFelter from './LeggTilArbeidsforholdFelter';
import shallowWithIntl from '../../../i18n';
import arbeidsforholdHandling from '../../kodeverk/arbeidsforholdHandling';

describe('<PersonArbeidsforholdDetailForm>', () => {
  const arbeidsforhold = {
    id: '1',
    arbeidsgiver: {
      arbeidsgiverOrgnr: '98000167',
      arbeidsgiverAktørId: 'aktørId',
    },
    arbeidsforhold: {
      internArbeidsforholdId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      eksternArbeidsforholdId: '9056806408',
    },
    yrkestittel: 'Vaktmester',
    begrunnelse: null,
    perioder: [
      {
        fom: '2020-02-14',
        tom: '2020-12-14',
      },
    ],
    handlingType: 'UDEFINERT',
    kilde: ['AAREGISTERET'],
    permisjoner: [
      {
        permisjonFom: '2020-12-14',
        permisjonTom: '2020-12-14',
      },
    ],
    stillingsprosent: 40,
    aksjonspunktÅrsaker: ['MANGLENDE_INNTEKTSMELDING'],
    inntektsmeldinger: [
      {
        journalpostId: '98548088',
        mottattTidspunkt: '2020-12-14T14:04:49.348Z',
        status: 'GYLDIG',
        begrunnelse: 'null',
      },
    ],
  };

  it('skal ikke vise tekstfelt for begrunnelse når form ikke er dirty og begrunnelse ikke har verdi', () => {
    const wrapper = shallowWithIntl(
      <PersonArbeidsforholdDetailForm
        {...reduxFormPropsMock}
        intl={intlMock}
        cancelArbeidsforhold={sinon.spy()}
        isErstattArbeidsforhold
        hasReceivedInntektsmelding
        harErstattetEttEllerFlere
        readOnly={false}
        vurderOmSkalErstattes={false}
        aktivtArbeidsforholdTillatUtenIM={false}
        arbeidsforhold={arbeidsforhold}
        skalKunneLeggeTilNyeArbeidsforhold={false}
        skalKunneLageArbeidsforholdBasertPaInntektsmelding={false}
        initialValues={{
          begrunnelse: '',
          replaceOptions: [],
        }}
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
      />,
    );
    expect(wrapper.find(TextAreaField)).has.length(0);
  });

  it('skal ikke vise LeggTilArbeidsforholdFelter ', () => {
    const wrapper = shallowWithIntl(
      <PersonArbeidsforholdDetailForm
        {...reduxFormPropsMock}
        intl={intlMock}
        cancelArbeidsforhold={sinon.spy()}
        arbeidsforholdHandlingVerdi={arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD}
        isErstattArbeidsforhold
        hasReceivedInntektsmelding={false}
        harErstattetEttEllerFlere
        readOnly={false}
        vurderOmSkalErstattes={false}
        aktivtArbeidsforholdTillatUtenIM={false}
        arbeidsforhold={arbeidsforhold}
        skalKunneLeggeTilNyeArbeidsforhold={false}
        skalKunneLageArbeidsforholdBasertPaInntektsmelding={false}
        initialValues={{
          begrunnelse: '',
          replaceOptions: [],
        }}
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
      />,
    );
    const radiogroup = wrapper.find(LeggTilArbeidsforholdFelter);
    expect(radiogroup).has.length(0);
  });
});

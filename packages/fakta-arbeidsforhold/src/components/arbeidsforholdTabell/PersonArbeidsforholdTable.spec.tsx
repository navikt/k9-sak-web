import arbeidsforholdHandlingType from '@fpsak-frontend/kodeverk/src/arbeidsforholdHandlingType';
import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../i18n/nb_NO.json';
import PersonArbeidsforholdTable from './PersonArbeidsforholdTable';

describe('<PersonArbeidsforholdTable>', () => {
  const arbeidsforhold = {
    id: '1',
    arbeidsforhold: {
      eksternArbeidsforholdId: '1231-2345',
      internArbeidsforholdId: null,
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
    yrkestittel: 'Vaktmester',
    stillingsprosent: 80,
  };

  const arbeidsforhold2 = {
    id: '2',
    arbeidsforhold: {
      eksternArbeidsforholdId: null,
      internArbeidsforholdId: '4532-2345',
    },
    arbeidsgiver: {
      arbeidsgiverOrgnr: '234567',
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

  it('skal vise tabell med to arbeidsforhold der den ene raden er markert som valgt', () => {
    const { container } = renderWithIntlAndReduxForm(
      <PersonArbeidsforholdTable
        harAksjonspunktAvklarArbeidsforhold
        intl={intlMock}
        alleArbeidsforhold={[arbeidsforhold, arbeidsforhold2]}
        selectedId={arbeidsforhold.id}
        alleKodeverk={{}}
        behandlingId={1}
        behandlingVersjon={2}
        updateArbeidsforhold={() => undefined}
      />,
      { messages },
    );

    expect(container.getElementsByClassName('navds-table__row--selected').length).toBe(1);
    expect(screen.getByText(arbeidsforhold.arbeidsforhold.eksternArbeidsforholdId)).toBeInTheDocument();
    expect(screen.getByText('80.00 %')).toBeInTheDocument();
  });

  it('skal vise mottatt dato for inntektsmelding når denne finnes', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      inntektsmeldinger: [
        {
          mottattTidspunkt: new Date('2018-05-05T10:00:00.000Z').toISOString(),
        },
      ],
    };
    renderWithIntlAndReduxForm(
      <PersonArbeidsforholdTable
        harAksjonspunktAvklarArbeidsforhold
        intl={intlMock}
        alleArbeidsforhold={[newArbeidsforhold]}
        selectedId={newArbeidsforhold.id}
        alleKodeverk={{}}
        behandlingId={1}
        behandlingVersjon={2}
        updateArbeidsforhold={() => undefined}
      />,
      { messages },
    );
    expect(screen.getByText('05.05.2018')).toBeInTheDocument();
  });

  it('skal ikke vise ikon for at arbeidsforholdet er i bruk', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      handlingType: {
        kode: arbeidsforholdHandlingType.IKKE_BRUK,
        kodeverk: '',
      },
      aksjonspunktÅrsaker: [],
    };
    renderWithIntlAndReduxForm(
      <PersonArbeidsforholdTable
        harAksjonspunktAvklarArbeidsforhold
        intl={intlMock}
        alleArbeidsforhold={[newArbeidsforhold]}
        selectedId={arbeidsforhold.id}
        alleKodeverk={{}}
        behandlingId={1}
        behandlingVersjon={2}
        updateArbeidsforhold={() => undefined}
      />,
      { messages },
    );

    expect(screen.queryByAltText('PersonArbeidsforholdTable.ErIBruk')).not.toBeInTheDocument();
  });

  it('skal vise ikon for at arbeidsforholdet er i bruk', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      handlingType: {
        kode: arbeidsforholdHandlingType.BRUK,
        kodeverk: '',
      },
      aksjonspunktÅrsaker: [],
    };

    renderWithIntlAndReduxForm(
      <PersonArbeidsforholdTable
        harAksjonspunktAvklarArbeidsforhold={false}
        intl={intlMock}
        alleArbeidsforhold={[newArbeidsforhold]}
        selectedId={newArbeidsforhold.id}
        alleKodeverk={{}}
        behandlingId={1}
        behandlingVersjon={2}
        updateArbeidsforhold={() => undefined}
      />,
      { messages },
    );

    expect(screen.getByAltText('PersonArbeidsforholdTable.ErIBruk')).toBeInTheDocument();
  });

  it('skal vise IngenArbeidsforholdRegistrert komponent når ingen arbeidsforhold', () => {
    renderWithIntlAndReduxForm(
      <PersonArbeidsforholdTable
        harAksjonspunktAvklarArbeidsforhold
        intl={intlMock}
        alleArbeidsforhold={[]}
        selectedId={undefined}
        alleKodeverk={{}}
        behandlingId={1}
        behandlingVersjon={2}
        updateArbeidsforhold={() => undefined}
      />,
      { messages },
    );

    expect(screen.getByText('Ingen arbeidsforhold registrert')).toBeInTheDocument();
  });

  it('skal vise stillingsprosent selv når den er 0', () => {
    const endretArbeidsforhold = {
      ...arbeidsforhold,
      stillingsprosent: 0,
    };
    renderWithIntlAndReduxForm(
      <PersonArbeidsforholdTable
        harAksjonspunktAvklarArbeidsforhold
        intl={intlMock}
        alleArbeidsforhold={[endretArbeidsforhold]}
        selectedId={undefined}
        alleKodeverk={{}}
        behandlingId={1}
        behandlingVersjon={2}
        updateArbeidsforhold={() => undefined}
      />,
      { messages },
    );

    expect(screen.getByText('0.00 %')).toBeInTheDocument();
  });

  it('skal vise arbeidsforholdId når lagt til av saksbehandler', () => {
    const endretArbeidsforhold = {
      ...arbeidsforhold,
      handlingType: {
        kode: arbeidsforholdHandlingType.BASERT_PÅ_INNTEKTSMELDING,
        kodeverk: '',
      },
      yrkestittel: 'Lærer',
    };
    renderWithIntlAndReduxForm(
      <PersonArbeidsforholdTable
        harAksjonspunktAvklarArbeidsforhold
        intl={intlMock}
        alleArbeidsforhold={[endretArbeidsforhold]}
        selectedId={undefined}
        alleKodeverk={{}}
        behandlingId={1}
        behandlingVersjon={2}
        updateArbeidsforhold={() => undefined}
      />,
      { messages },
    );

    expect(screen.getByText(endretArbeidsforhold.arbeidsforhold.eksternArbeidsforholdId)).toBeInTheDocument();
  });

  it('skal vise tom dato', () => {
    const endretArbeidsforhold = {
      ...arbeidsforhold,
    };
    renderWithIntlAndReduxForm(
      <PersonArbeidsforholdTable
        harAksjonspunktAvklarArbeidsforhold
        intl={intlMock}
        alleArbeidsforhold={[endretArbeidsforhold]}
        selectedId={undefined}
        alleKodeverk={{}}
        behandlingId={1}
        behandlingVersjon={2}
        updateArbeidsforhold={() => undefined}
      />,
      { messages },
    );

    expect(screen.getByText('01.01.2018-10.10.2018')).toBeInTheDocument();
  });

  it('arbeidsforhold en med arbeidsforholdId og en uten, skal få ulik nøkkel', () => {
    const arbfor1 = { ...arbeidsforhold };
    arbfor1.arbeidsforhold.eksternArbeidsforholdId = '123';
    arbfor1.arbeidsforhold.internArbeidsforholdId = null;

    const arbfor2 = { ...arbeidsforhold2 };
    arbfor2.arbeidsforhold.eksternArbeidsforholdId = null;
    arbfor2.arbeidsforhold.internArbeidsforholdId = '345';

    expect(arbfor1.id).not.toEqual(arbfor2.id);
  });

  it('skal vise arbeidsforholddetaljer på alle arbeidsforhold som har et aksjonspunkt', () => {
    renderWithIntlAndReduxForm(
      <PersonArbeidsforholdTable
        harAksjonspunktAvklarArbeidsforhold
        intl={intlMock}
        alleArbeidsforhold={[arbeidsforhold]}
        selectedId="1"
        alleKodeverk={{}}
        behandlingId={1}
        behandlingVersjon={2}
        updateArbeidsforhold={() => undefined}
      />,
      { messages },
    );
    expect(screen.getByText(/Arbeidsforholdet Vaktmester/i)).toBeInTheDocument();
    expect(screen.getByText(/finnes ikke i Aa-Registeret./i)).toBeInTheDocument();
  });

  it('skal ikke vise arbeidsforhold automatisk når det ikke er aksjonspunkt på det', () => {
    renderWithIntlAndReduxForm(
      <PersonArbeidsforholdTable
        harAksjonspunktAvklarArbeidsforhold={false}
        intl={intlMock}
        alleArbeidsforhold={[
          {
            ...arbeidsforhold,
            aksjonspunktÅrsaker: [],
          },
        ]}
        selectedId={undefined}
        alleKodeverk={{}}
        behandlingId={1}
        behandlingVersjon={2}
        updateArbeidsforhold={() => undefined}
      />,
      { messages },
    );

    expect(screen.queryByTestId('PersonArbeidsforholdDetailForm')).not.toBeInTheDocument();
  });
});

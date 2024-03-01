import OAType from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../i18n/nb_NO.json';
import ActivityDataSubPanel from './ActivityDataSubPanel';

describe('<ActivityDataSubPanel>', () => {
  const activity1 = {
    arbeidsgiver: 'Svensen Eksos',
    oppdragsgiverOrg: '123456789',
  };
  const activity2 = {
    privatpersonNavn: 'Tom Hansen',
    privatpersonFødselsdato: '1992-11-10',
  };

  const arbeidsgiverOpplysningerPerId = {
    123456789: {
      identifikator: '123456789',
      referanse: '123456789',
      navn: 'Svensen Eksos',
      fødselsdato: null,
      erPrivatPerson: true,
      arbeidsforholdreferanser: [],
    },
  };

  it('skal vise arbeidsgiver, org-nr og stillingsandel for type Arbeid', () => {
    renderWithIntlAndReduxForm(
      <ActivityDataSubPanel
        initialValues={activity1}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        readOnly={false}
        isManuallyAdded={false}
        selectedActivityType={{ kode: OAType.ARBEID, kodeverk: 'arbeid' }}
      />,
      { messages },
    );

    expect(screen.getByText('Arbeidsgiver')).toBeInTheDocument();
    expect(screen.getByText('Svensen Eksos (123456789)')).toBeInTheDocument();
    expect(screen.getByText('Stillingsandel')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('skal vise "-" når arbeidsgiver ikke er oppgitt', () => {
    renderWithIntlAndReduxForm(
      <ActivityDataSubPanel
        initialValues={{}}
        readOnly={false}
        isManuallyAdded={false}
        selectedActivityType={{ kode: OAType.ARBEID, kodeverk: 'arbeid' }}
        arbeidsgiverOpplysningerPerId={undefined}
      />,
      { messages },
    );

    expect(screen.getByText('Arbeidsgiver')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
    expect(screen.getByText('Stillingsandel')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('skal ikke vise label Oppdragsgiver for type Frilans', () => {
    renderWithIntlAndReduxForm(
      <ActivityDataSubPanel
        initialValues={activity1}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        readOnly={false}
        isManuallyAdded={false}
        selectedActivityType={{ kode: OAType.FRILANS, kodeverk: 'FRILANS' }}
      />,
      { messages },
    );
    expect(screen.queryByText('Oppdragsgiver')).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('skal vise ikke vise stillingsandel for type Næring', () => {
    renderWithIntlAndReduxForm(
      <ActivityDataSubPanel
        initialValues={activity1}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        readOnly={false}
        isManuallyAdded={false}
        selectedActivityType={{ kode: OAType.NARING, kodeverk: OAType.NARING }}
      />,
      { messages },
    );

    expect(screen.getByText('Arbeidsgiver')).toBeInTheDocument();
    expect(screen.queryByText('Stillingsandel')).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('skal ikke vise noen felter for type Vartpenger', () => {
    renderWithIntlAndReduxForm(
      <ActivityDataSubPanel
        initialValues={activity1}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        readOnly={false}
        isManuallyAdded={false}
        selectedActivityType={{ kode: OAType.VARTPENGER, kodeverk: 'VARTPENGER' }}
      />,
      { messages },
    );

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('skal vise inputfelt for organisasjonsnr når saksbehandler manuelt har lagt til aktivitet Arbeid', () => {
    renderWithIntlAndReduxForm(
      <ActivityDataSubPanel
        initialValues={activity1}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        readOnly={false}
        isManuallyAdded
        selectedActivityType={{ kode: OAType.ARBEID, kodeverk: 'ARBEID' }}
      />,
      { messages },
    );

    expect(screen.getByRole('textbox', { name: 'Virksomhetsnr.' })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: 'Stillingsandel' })).toBeInTheDocument();
  });

  it('skal vise inputfelt som readOnly', () => {
    renderWithIntlAndReduxForm(
      <ActivityDataSubPanel
        initialValues={activity1}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        readOnly
        isManuallyAdded
        selectedActivityType={{ kode: OAType.ARBEID, kodeverk: 'ARBEID' }}
      />,
      { messages },
    );

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
    expect(screen.getByText('undefined %')).toBeInTheDocument();
  });
  it('skal vise arbeidsgiver som privatperson', () => {
    renderWithIntlAndReduxForm(
      <ActivityDataSubPanel
        initialValues={activity2}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        readOnly={false}
        isManuallyAdded={false}
        selectedActivityType={{ kode: OAType.ARBEID, kodeverk: 'ARBEID' }}
      />,
      { messages },
    );
    expect(screen.getByText('Tom Hansen (10.11.1992)')).toBeInTheDocument();
  });
  it('skal vise org når ikke privatperson', () => {
    renderWithIntlAndReduxForm(
      <ActivityDataSubPanel
        initialValues={activity1}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        readOnly={false}
        isManuallyAdded={false}
        selectedActivityType={{ kode: OAType.ARBEID, kodeverk: 'ARBEID' }}
      />,
      { messages },
    );
    expect(screen.getByText('Svensen Eksos (123456789)')).toBeInTheDocument();
  });
  it('skal vise - som arbeidsgiver når ikke arbeidsgiver eller privatperson', () => {
    renderWithIntlAndReduxForm(
      <ActivityDataSubPanel
        initialValues={{}}
        readOnly={false}
        isManuallyAdded={false}
        selectedActivityType={{ kode: OAType.ARBEID, kodeverk: 'ARBEID' }}
        arbeidsgiverOpplysningerPerId={undefined}
      />,
      { messages },
    );
    expect(screen.getByText('-')).toBeInTheDocument();
  });
});

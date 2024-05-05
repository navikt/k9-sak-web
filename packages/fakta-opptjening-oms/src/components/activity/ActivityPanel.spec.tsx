import OAType from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';
import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../i18n/nb_NO.json';
import { ActivityPanel } from './ActivityPanel';

describe('<ActivityPanel>', () => {
  const opptjeningAktivitetTypes = [
    {
      kode: OAType.ARBEID,
      navn: 'Arbeid',
      kodeverk: '',
    },
    {
      kode: OAType.NARING,
      navn: 'Næring',
      kodeverk: '',
    },
  ];

  it('skal vise periodevelger som aktiv når aktivitet ikke er godkjent eller avvist og en har aksjonspunkt', () => {
    const activity = {
      erManueltOpprettet: false,
      erGodkjent: undefined,
      begrunnelse: undefined,
    };

    const { container } = renderWithIntlAndReduxForm(
      <ActivityPanel
        {...reduxFormPropsMock}
        intl={intlMock}
        initialValues={activity}
        readOnly={false}
        opptjeningAktivitetTypes={opptjeningAktivitetTypes}
        cancelSelectedOpptjeningActivity={vi.fn()}
        selectedActivityType={{ kode: OAType.ARBEID, kodeverk: 'ARBEID' }}
        opptjeningFom="2017-08-15"
        opptjeningTom="2017-12-31"
        hasAksjonspunkt
        activityId={1}
        alleMerknaderFraBeslutter={{}}
      />,
      { messages },
    );

    expect(container.getElementsByClassName('navds-date__field-input').length).toBe(2);
  });

  it('skal vise periodevelger som aktiv når aktivitet er manuelt lagt til', () => {
    const activity = {
      erManueltOpprettet: true,
      erGodkjent: true,
      begrunnelse: 'en begrunnelse',
    };

    const { container } = renderWithIntlAndReduxForm(
      <ActivityPanel
        {...reduxFormPropsMock}
        intl={intlMock}
        initialValues={activity}
        readOnly={false}
        opptjeningAktivitetTypes={opptjeningAktivitetTypes}
        cancelSelectedOpptjeningActivity={vi.fn()}
        selectedActivityType={{ kode: OAType.ARBEID, kodeverk: 'ARBEID' }}
        opptjeningFom="2017-08-15"
        opptjeningTom="2017-12-31"
        hasAksjonspunkt
        activityId={1}
        alleMerknaderFraBeslutter={{}}
      />,
      { messages },
    );

    expect(container.getElementsByClassName('navds-date__field-input').length).toBe(2);
  });

  it('skal vise periodevelger som aktiv når aktivitet er markert med erEndret', () => {
    const activity = {
      erManueltOpprettet: false,
      erGodkjent: true,
      erEndret: true,
    };

    const { container } = renderWithIntlAndReduxForm(
      <ActivityPanel
        {...reduxFormPropsMock}
        intl={intlMock}
        initialValues={activity}
        readOnly={false}
        opptjeningAktivitetTypes={opptjeningAktivitetTypes}
        cancelSelectedOpptjeningActivity={vi.fn()}
        selectedActivityType={{ kode: OAType.ARBEID, kodeverk: 'ARBEID' }}
        opptjeningFom="2017-08-15"
        opptjeningTom="2017-12-31"
        hasAksjonspunkt
        activityId={1}
        alleMerknaderFraBeslutter={{}}
      />,
      { messages },
    );

    expect(container.getElementsByClassName('navds-date__field-input').length).toBe(2);
  });

  it('skal vise periodevelger som disablet når aktivitet er godkjent automatisk og en ikke har aksjonspunkt', () => {
    const activity = {
      erManueltOpprettet: false,
      erGodkjent: true,
      begrunnelse: undefined,
    };

    const { container } = renderWithIntlAndReduxForm(
      <ActivityPanel
        {...reduxFormPropsMock}
        intl={intlMock}
        initialValues={activity}
        readOnly={false}
        opptjeningAktivitetTypes={opptjeningAktivitetTypes}
        cancelSelectedOpptjeningActivity={vi.fn()}
        selectedActivityType={{ kode: OAType.ARBEID, kodeverk: 'ARBEID' }}
        opptjeningFom="2017-08-15"
        opptjeningTom="2017-12-31"
        hasAksjonspunkt={false}
        activityId={1}
        alleMerknaderFraBeslutter={{}}
      />,
      { messages },
    );

    expect(container.getElementsByClassName('navds-date__field-input').length).toBe(0);
  });

  it('skal vise antall månder og dager i valgt periode', () => {
    const activity = {
      erManueltOpprettet: false,
      erGodkjent: true,
      begrunnelse: undefined,
    };

    renderWithIntlAndReduxForm(
      <ActivityPanel
        {...reduxFormPropsMock}
        intl={intlMock}
        initialValues={activity}
        readOnly={false}
        opptjeningAktivitetTypes={opptjeningAktivitetTypes}
        cancelSelectedOpptjeningActivity={vi.fn()}
        selectedActivityType={{ kode: OAType.ARBEID, kodeverk: 'ARBEID' }}
        opptjeningFom="2017-08-15"
        opptjeningTom="2017-12-31"
        hasAksjonspunkt={false}
        activityId={1}
        alleMerknaderFraBeslutter={{}}
      />,
      { messages },
    );

    expect(screen.getByText('(4 mndr. 17 dager)')).toBeInTheDocument();
  });

  it('skal vise nedtrekksliste med opptjeningsaktiviteter når saksbehandler manuelt har lagt til aktivitet', () => {
    const activity = {
      erManueltOpprettet: true,
      erGodkjent: true,
      begrunnelse: undefined,
    };

    renderWithIntlAndReduxForm(
      <ActivityPanel
        {...reduxFormPropsMock}
        intl={intlMock}
        initialValues={activity}
        readOnly={false}
        opptjeningAktivitetTypes={opptjeningAktivitetTypes}
        cancelSelectedOpptjeningActivity={vi.fn()}
        selectedActivityType={{ kode: OAType.ARBEID, kodeverk: 'ARBEID' }}
        opptjeningFom="2017-08-15"
        opptjeningTom="2017-12-31"
        hasAksjonspunkt
        activityId={1}
        alleMerknaderFraBeslutter={{}}
      />,
      { messages },
    );

    expect(screen.getByRole('combobox', { name: 'ActivityPanel.Activity' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Arbeid' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Næring' })).toBeInTheDocument();
  });

  it('skal kun vise valgt opptjeningsaktivitet når aktivitet ikke manuelt er lagt til', () => {
    const activity = {
      erManueltOpprettet: false,
      erGodkjent: true,
      begrunnelse: undefined,
    };

    renderWithIntlAndReduxForm(
      <ActivityPanel
        {...reduxFormPropsMock}
        intl={intlMock}
        initialValues={activity}
        readOnly={false}
        opptjeningAktivitetTypes={opptjeningAktivitetTypes}
        cancelSelectedOpptjeningActivity={vi.fn()}
        selectedActivityType={{ kode: OAType.ARBEID, kodeverk: 'ARBEID' }}
        opptjeningFom="2017-08-15"
        opptjeningTom="2017-12-31"
        hasAksjonspunkt
        activityId={1}
        alleMerknaderFraBeslutter={{}}
      />,
      { messages },
    );

    expect(screen.getByText('Arbeidsgiver')).toBeInTheDocument();
  });

  it('skal kunne oppdatere aktivitet når den er del av aksjonspunktet', () => {
    const activity = {
      erManueltOpprettet: false,
      erGodkjent: undefined,
      begrunnelse: undefined,
    };

    renderWithIntlAndReduxForm(
      <ActivityPanel
        {...reduxFormPropsMock}
        intl={intlMock}
        initialValues={activity}
        readOnly={false}
        opptjeningAktivitetTypes={opptjeningAktivitetTypes}
        cancelSelectedOpptjeningActivity={vi.fn()}
        selectedActivityType={{ kode: OAType.ARBEID, kodeverk: 'ARBEID' }}
        opptjeningFom="2017-08-15"
        opptjeningTom="2017-12-31"
        hasAksjonspunkt
        activityId={1}
        alleMerknaderFraBeslutter={{}}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Oppdater' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio').length).toBeGreaterThan(0);
  });

  it('skal ikke kunne oppdatere aktivitet når den ikke er manuelt lagt til eller del av aksjonspunkt', () => {
    const activity = {
      erManueltOpprettet: false,
      erGodkjent: true,
      begrunnelse: undefined,
    };

    renderWithIntlAndReduxForm(
      <ActivityPanel
        {...reduxFormPropsMock}
        intl={intlMock}
        initialValues={activity}
        readOnly={false}
        opptjeningAktivitetTypes={opptjeningAktivitetTypes}
        cancelSelectedOpptjeningActivity={vi.fn()}
        selectedActivityType={{ kode: OAType.ARBEID, kodeverk: 'ARBEID' }}
        opptjeningFom="2017-08-15"
        opptjeningTom="2017-12-31"
        hasAksjonspunkt={false}
        activityId={1}
        alleMerknaderFraBeslutter={{}}
      />,
      { messages },
    );
    expect(screen.queryByRole('button', { name: 'Oppdater' })).not.toBeInTheDocument();
  });

  it('skal ikke kunne godkjenne eller avvise aksjonspunkt når aktivitet manuelt er lagt til', () => {
    const activity = {
      erManueltOpprettet: true,
      erGodkjent: undefined,
      begrunnelse: undefined,
    };

    renderWithIntlAndReduxForm(
      <ActivityPanel
        {...reduxFormPropsMock}
        intl={intlMock}
        initialValues={activity}
        readOnly={false}
        opptjeningAktivitetTypes={opptjeningAktivitetTypes}
        cancelSelectedOpptjeningActivity={vi.fn()}
        selectedActivityType={{ kode: OAType.ARBEID, kodeverk: 'ARBEID' }}
        opptjeningFom="2017-08-15"
        opptjeningTom="2017-12-31"
        hasAksjonspunkt
        activityId={1}
        alleMerknaderFraBeslutter={{}}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Oppdater' })).toBeInTheDocument();
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
  });

  it('skal vise uredigerbar begrunnelse hvis readOnly er true', () => {
    const activity = {
      erManueltOpprettet: false,
      erGodkjent: false,
      erEndret: false,
      begrunnelse: undefined,
    };

    renderWithIntlAndReduxForm(
      <ActivityPanel
        {...reduxFormPropsMock}
        intl={intlMock}
        initialValues={activity}
        readOnly
        opptjeningAktivitetTypes={opptjeningAktivitetTypes}
        cancelSelectedOpptjeningActivity={vi.fn()}
        selectedActivityType={{ kode: OAType.ARBEID, kodeverk: 'ARBEID' }}
        opptjeningFom="2017-08-15"
        opptjeningTom="2017-12-31"
        hasAksjonspunkt
        activityId={1}
        alleMerknaderFraBeslutter={{}}
      />,
      { messages },
    );

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('skal vise uredigerbar begrunnelse hvis man skal disable perioder picker', () => {
    const activity = {
      erManueltOpprettet: false,
      erGodkjent: true,
      erEndret: false,
      begrunnelse: undefined,
    };

    renderWithIntlAndReduxForm(
      <ActivityPanel
        {...reduxFormPropsMock}
        intl={intlMock}
        initialValues={activity}
        readOnly={false}
        opptjeningAktivitetTypes={opptjeningAktivitetTypes}
        cancelSelectedOpptjeningActivity={vi.fn()}
        selectedActivityType={{ kode: OAType.ARBEID, kodeverk: 'ARBEID' }}
        opptjeningFom="2017-08-15"
        opptjeningTom="2017-12-31"
        hasAksjonspunkt
        activityId={1}
        alleMerknaderFraBeslutter={{}}
      />,
      { messages },
    );
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('skal vise redigerbar begrunnelse hvis man ikke skal disable perioder picker og ikke readOnly', () => {
    const activity = {
      erManueltOpprettet: false,
      erGodkjent: false,
      erEndret: false,
      begrunnelse: undefined,
    };

    renderWithIntlAndReduxForm(
      <ActivityPanel
        {...reduxFormPropsMock}
        intl={intlMock}
        initialValues={activity}
        readOnly={false}
        opptjeningAktivitetTypes={opptjeningAktivitetTypes}
        cancelSelectedOpptjeningActivity={vi.fn()}
        selectedActivityType={{ kode: OAType.ARBEID, kodeverk: 'ARBEID' }}
        opptjeningFom="2017-08-15"
        opptjeningTom="2017-12-31"
        hasAksjonspunkt
        activityId={1}
        alleMerknaderFraBeslutter={{}}
      />,
      { messages },
    );

    expect(screen.getByRole('textbox', { name: 'Begrunn endringene' })).toBeInTheDocument();
  });
});

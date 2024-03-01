import OAType from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import sinon from 'sinon';
import messages from '../../i18n/nb_NO.json';
import { OpptjeningFaktaFormImpl as OpptjeningFaktaForm } from './OpptjeningFaktaForm';

describe('<OpptjeningFaktaForm>', () => {
  const opptjeningActivities = [
    {
      id: 1,
      aktivitetType: { kode: OAType.ARBEID, navn: 'ARBEID' },
      opptjeningFom: '2017-06-01',
      opptjeningTom: '2017-07-10',
      arbeidsgiver: 'Andersen Transport AS',
      oppdragsgiverOrg: '583948180',
      stillingsandel: 100,
      erGodkjent: true,
      begrunnelse: null,
      erManueltOpprettet: false,
      erEndret: false,
      originalFom: null,
      originalTom: null,
      arbeidsgiverNavn: null,
      arbeidsgiverIdentifikator: '973861778',
      privatpersonNavn: null,
      privatpersonFødselsdato: null,
      arbeidsforholdRef: null,
      naringRegistreringsdato: '1995-09-14',
      omsorgsovertakelseDato: '',
    },
    {
      id: 2,
      aktivitetType: { kode: OAType.NARING, navn: 'NARING' },
      opptjeningFom: '2017-07-15',
      opptjeningTom: '2017-08-15',
      arbeidsgiver: 'Andersen Transport AS',
      oppdragsgiverOrg: '583948180',
      stillingsandel: 100,
      registreringsdato: '2018-02-20',
      erGodkjent: null,
      begrunnelse: null,
      erManueltOpprettet: false,
      erEndret: false,
      originalFom: null,
      originalTom: null,
      arbeidsgiverNavn: null,
      arbeidsgiverIdentifikator: '973861778',
      privatpersonNavn: null,
      privatpersonFødselsdato: null,
      arbeidsforholdRef: null,
      naringRegistreringsdato: '1995-09-14',
      omsorgsovertakelseDato: '',
    },
  ];

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
  const opptjeningList = [
    {
      opptjeningAktivitetList: opptjeningActivities,
      fastsattOpptjening: {
        opptjeningFom: '2017-08-15',
        opptjeningTom: '2017-08-31',
        opptjeningperiode: { dager: 16, måneder: 0 },
        fastsattOpptjeningAktivitetList: [],
      },
    },
  ];
  it('skal vise aksjonspunktinformasjon og knapper når aksjonspunkt finnes', () => {
    renderWithIntlAndReduxForm(
      <OpptjeningFaktaForm
        hasAksjonspunkt
        readOnly={false}
        opptjeningAktivitetTypes={opptjeningAktivitetTypes}
        formName="test"
        behandlingFormPrefix="test"
        reduxFormChange={sinon.spy()}
        reduxFormInitialize={sinon.spy()}
        harApneAksjonspunkter
        submitting={false}
        isDirty={false}
        behandlingId={1}
        behandlingVersjon={1}
        alleMerknaderFraBeslutter={{}}
        alleKodeverk={{
          ArbeidType: [
            {
              kode: 'LØNN_UNDER_UTDANNING',
              kodeverk: 'ARBEID_TYPE',
              navn: 'Lønn under utdanning',
            },
          ],
        }}
        opptjeningList={opptjeningList}
        arbeidsgiverOpplysningerPerId={undefined}
        dokStatus="test"
      />,
      { messages },
    );

    expect(screen.getByText('Vurder om aktivitetene kan godkjennes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Oppdater' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Oppdater' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeInTheDocument();
  });

  it('skal ikke vise aksjonspunktinformasjon og knapper når aksjonspunkt ikke finnes', () => {
    renderWithIntlAndReduxForm(
      <OpptjeningFaktaForm
        hasAksjonspunkt={false}
        readOnly={false}
        opptjeningAktivitetTypes={opptjeningAktivitetTypes}
        formName="test"
        behandlingFormPrefix="test"
        reduxFormChange={sinon.spy()}
        reduxFormInitialize={sinon.spy()}
        harApneAksjonspunkter
        submitting={false}
        isDirty={false}
        behandlingId={1}
        behandlingVersjon={1}
        alleMerknaderFraBeslutter={{}}
        alleKodeverk={{}}
        opptjeningList={opptjeningList}
        arbeidsgiverOpplysningerPerId={undefined}
        dokStatus="test"
      />,
      { messages },
    );

    expect(screen.queryByText('Vurder om aktivitetene kan godkjennes')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Oppdater' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Avbryt' })).not.toBeInTheDocument();
  });

  it('skal ikke vise informasjon om aktiviteten når det ikke er valgt aktivitetstype i dropdown', async () => {
    renderWithIntlAndReduxForm(
      <OpptjeningFaktaForm
        hasAksjonspunkt
        readOnly={false}
        opptjeningAktivitetTypes={opptjeningAktivitetTypes}
        formName="test"
        behandlingFormPrefix="test"
        reduxFormChange={sinon.spy()}
        reduxFormInitialize={sinon.spy()}
        harApneAksjonspunkter
        submitting={false}
        isDirty={false}
        behandlingId={1}
        behandlingVersjon={1}
        alleMerknaderFraBeslutter={{}}
        alleKodeverk={{}}
        opptjeningList={opptjeningList}
        arbeidsgiverOpplysningerPerId={undefined}
        dokStatus="test"
      />,
      { messages },
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Avbryt' }));
    });

    expect(screen.queryByText('Detaljer for valgt aktivitet')).not.toBeInTheDocument();
  });

  it('skal kunne lagre og legge til når ingen aktivitet er valgt og alle aksjonspunkter er avklart', () => {
    const updatedOpptjeningList = [
      {
        ...opptjeningList[0],
        opptjeningAktivitetList: opptjeningList[0].opptjeningAktivitetList.map(oa => ({
          ...oa,
          erGodkjent: true,
        })),
      },
    ];

    renderWithIntlAndReduxForm(
      <OpptjeningFaktaForm
        hasAksjonspunkt
        readOnly={false}
        opptjeningAktivitetTypes={opptjeningAktivitetTypes}
        formName="test"
        behandlingFormPrefix="test"
        reduxFormChange={sinon.spy()}
        reduxFormInitialize={sinon.spy()}
        harApneAksjonspunkter
        submitting={false}
        isDirty={false}
        behandlingId={1}
        behandlingVersjon={1}
        alleMerknaderFraBeslutter={{}}
        alleKodeverk={{}}
        opptjeningList={updatedOpptjeningList}
        arbeidsgiverOpplysningerPerId={undefined}
        dokStatus="test"
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Legg til aktivitet' })).toBeInTheDocument();
  });

  it('skal automatisk åpne aktivitet som må avklares', () => {
    const formChangeCallback = sinon.spy();
    const formInitCallback = sinon.spy();

    renderWithIntlAndReduxForm(
      <OpptjeningFaktaForm
        hasAksjonspunkt
        readOnly={false}
        opptjeningAktivitetTypes={opptjeningAktivitetTypes}
        behandlingFormPrefix="Behandling_123"
        formName="OpptjeningFaktaForm"
        reduxFormChange={formChangeCallback}
        reduxFormInitialize={formInitCallback}
        harApneAksjonspunkter
        submitting={false}
        isDirty={false}
        behandlingId={1}
        behandlingVersjon={1}
        alleMerknaderFraBeslutter={{}}
        alleKodeverk={{}}
        opptjeningList={opptjeningList}
        arbeidsgiverOpplysningerPerId={undefined}
        dokStatus="test"
      />,
      { messages },
    );

    expect(screen.getByText('Vurder om aktivitetene kan godkjennes')).toBeInTheDocument();
  });

  it.skip('skal oppdatere aktivitet etter editering', async () => {
    const formChangeCallback = sinon.spy();
    const formInitCallback = sinon.spy();

    renderWithIntlAndReduxForm(
      <OpptjeningFaktaForm
        hasAksjonspunkt
        readOnly={false}
        opptjeningAktivitetTypes={opptjeningAktivitetTypes}
        behandlingFormPrefix="Behandling_123"
        formName="OpptjeningFaktaForm"
        reduxFormChange={formChangeCallback}
        reduxFormInitialize={formInitCallback}
        harApneAksjonspunkter
        submitting={false}
        isDirty={false}
        behandlingId={1}
        behandlingVersjon={1}
        alleMerknaderFraBeslutter={{}}
        alleKodeverk={{}}
        opptjeningList={opptjeningList}
        arbeidsgiverOpplysningerPerId={undefined}
        dokStatus="test"
      />,
      { messages },
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('radio', { name: 'Aktiviteten godkjennes' }));
      await userEvent.type(screen.getByRole('textbox', { name: 'Begrunn endringene' }), 'En begrunnelse');
      await userEvent.clear(screen.getByPlaceholderText('dd.mm.åååå - dd.mm.åååå'));
      // await userEvent.type(screen.getByPlaceholderText('dd.mm.åååå - dd.mm.åååå'), '16.08.2017 - 17.08.2017');
    });
    await act(async () => {
      await userEvent.type(screen.getByPlaceholderText('dd.mm.åååå - dd.mm.åååå'), '16.08.2017');
    });
    screen.debug(undefined, 30000);
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Oppdater' }));
    });
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Bekreft og fortsett' }));
    });

    // const activityPanel = wrapper.find(ActivityPanel);
    // expect(activityPanel).to.have.length(1);

    const editedActivity = {
      ...opptjeningActivities[1],
      erEndret: true,
      erGodkjent: true,
    };
    // activityPanel.prop('updateActivity')(editedActivity);

    const calls = formChangeCallback.getCalls();
    expect(calls).toBe(1);
    const { args } = calls[0];
    expect(args).toBe(3);
    expect(args[0]).toBe('Behandling_123.OpptjeningFaktaForm');
    expect(args[1]).toBe('opptjeningList[0].opptjeningAktivitetList');
    expect(args[2]).toBe([opptjeningActivities[0], editedActivity]);

    // expect(wrapper.state().selectedOpptjeningActivity).is.undefined;

    expect(formInitCallback.getCalls()).toBe(1);
  });

  it('skal legge til aktivitet', async () => {
    const formChangeCallback = sinon.spy();

    renderWithIntlAndReduxForm(
      <OpptjeningFaktaForm
        hasAksjonspunkt
        readOnly={false}
        opptjeningAktivitetTypes={opptjeningAktivitetTypes}
        behandlingFormPrefix="Behandling_123"
        formName="OpptjeningFaktaForm"
        reduxFormChange={formChangeCallback}
        reduxFormInitialize={sinon.spy()}
        harApneAksjonspunkter
        submitting={false}
        isDirty={false}
        behandlingId={1}
        behandlingVersjon={1}
        alleMerknaderFraBeslutter={{}}
        alleKodeverk={{
          ArbeidType: [
            {
              kode: 'LØNN_UNDER_UTDANNING',
              kodeverk: 'ARBEID_TYPE',
              navn: 'Lønn under utdanning',
            },
          ],
        }}
        opptjeningList={opptjeningList}
        arbeidsgiverOpplysningerPerId={undefined}
        dokStatus="test"
      />,
      { messages },
    );

    expect(screen.queryByText('Velg aktivitet')).not.toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Legg til aktivitet' }));
    });
    expect(screen.getByText('Velg aktivitet')).toBeInTheDocument();
  });

  it('skal kunne avbryte editering', async () => {
    const formChangeCallback = sinon.spy();
    const formInitCallback = sinon.spy();

    renderWithIntlAndReduxForm(
      <OpptjeningFaktaForm
        hasAksjonspunkt
        readOnly={false}
        opptjeningAktivitetTypes={opptjeningAktivitetTypes}
        behandlingFormPrefix="Behandling_123"
        formName="OpptjeningFaktaForm"
        reduxFormChange={formChangeCallback}
        reduxFormInitialize={formInitCallback}
        harApneAksjonspunkter
        submitting={false}
        isDirty={false}
        behandlingId={1}
        behandlingVersjon={1}
        alleMerknaderFraBeslutter={{}}
        alleKodeverk={{}}
        opptjeningList={opptjeningList}
        arbeidsgiverOpplysningerPerId={undefined}
        dokStatus="test"
      />,
      { messages },
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Avbryt' }));
    });

    const initCalls = formInitCallback.getCalls();
    expect(initCalls.length).toBe(1);
    expect(initCalls[0].args.length).toBe(2);
    expect(initCalls[0].args[0]).toBe('Behandling_123.ActivityPanelForm');
    expect(initCalls[0].args[1]).toStrictEqual({});
  });
});

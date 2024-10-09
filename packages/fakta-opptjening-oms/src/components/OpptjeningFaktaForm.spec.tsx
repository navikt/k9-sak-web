import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import type { OpptjeningAktivitetType } from '@k9-sak-web/types/src/opptjening/opptjeningAktivitetType.js';

import OAType from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import alleKodeverk from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { getKodeverkNavnFraKodeFnMock } from '@k9-sak-web/lib/kodeverk/mocks/kodeverkNavnFraKodeMock.js';
import { OpptjeningFaktaFormImpl as OpptjeningFaktaForm } from './OpptjeningFaktaForm';
import messages from '../../i18n/nb_NO.json';

describe('<OpptjeningFaktaForm>', () => {
  const kodeverkNavnFraKode = getKodeverkNavnFraKodeFnMock(alleKodeverk);

  const opptjeningActivities = [
    {
      id: 1,
      aktivitetType: OAType.ARBEID,
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
      aktivitetType: OAType.ARBEID,
      opptjeningFom: '2017-08-15',
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

  const opptjeningAktivitetTypes: OpptjeningAktivitetType[] = [
    {
      kode: OAType.ARBEID,
      navn: 'Arbeid',
      kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
    },
    {
      kode: OAType.NÆRING,
      navn: 'Næring',
      kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
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
    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);
    renderWithIntlAndReduxForm(
      <OpptjeningFaktaForm
        hasAksjonspunkt
        readOnly={false}
        opptjeningAktivitetTypes={opptjeningAktivitetTypes}
        formName="test"
        behandlingFormPrefix="test"
        reduxFormChange={vi.fn()}
        reduxFormInitialize={vi.fn()}
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
        kodeverkNavnFraKode={kodeverkNavnFraKode}
      />,
      { messages },
    );

    expect(screen.getByText('Vurder om aktivitetene kan godkjennes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Oppdater' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Oppdater' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeInTheDocument();
  });

  it('skal ikke vise aksjonspunktinformasjon og knapper når aksjonspunkt ikke finnes', () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);
    renderWithIntlAndReduxForm(
      <OpptjeningFaktaForm
        hasAksjonspunkt={false}
        readOnly={false}
        opptjeningAktivitetTypes={opptjeningAktivitetTypes}
        formName="test"
        behandlingFormPrefix="test"
        reduxFormChange={vi.fn()}
        reduxFormInitialize={vi.fn()}
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
        kodeverkNavnFraKode={kodeverkNavnFraKode}
      />,
      { messages },
    );

    expect(screen.queryByText('Vurder om aktivitetene kan godkjennes')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Oppdater' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Avbryt' })).not.toBeInTheDocument();
  });

  it('skal ikke vise informasjon om aktiviteten når det ikke er valgt aktivitetstype i dropdown', async () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);
    renderWithIntlAndReduxForm(
      <OpptjeningFaktaForm
        hasAksjonspunkt
        readOnly={false}
        opptjeningAktivitetTypes={opptjeningAktivitetTypes}
        formName="test"
        behandlingFormPrefix="test"
        reduxFormChange={vi.fn()}
        reduxFormInitialize={vi.fn()}
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
        kodeverkNavnFraKode={kodeverkNavnFraKode}
      />,
      { messages },
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Avbryt' }));
    });

    expect(screen.queryByText('Detaljer for valgt aktivitet')).not.toBeInTheDocument();
  });

  it('skal kunne lagre og legge til når ingen aktivitet er valgt og alle aksjonspunkter er avklart', () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);
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
        reduxFormChange={vi.fn()}
        reduxFormInitialize={vi.fn()}
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
        kodeverkNavnFraKode={kodeverkNavnFraKode}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Legg til aktivitet' })).toBeInTheDocument();
  });

  it('skal automatisk åpne aktivitet som må avklares', () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);
    const formChangeCallback = vi.fn();
    const formInitCallback = vi.fn();

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
        kodeverkNavnFraKode={kodeverkNavnFraKode}
      />,
      { messages },
    );

    expect(screen.getByText('Vurder om aktivitetene kan godkjennes')).toBeInTheDocument();
  });

  it('skal oppdatere aktivitet etter editering', async () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);
    const formChangeCallback = vi.fn();
    const formInitCallback = vi.fn();

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
        kodeverkNavnFraKode={kodeverkNavnFraKode}
      />,
      { messages },
    );

    await userEvent.click(screen.getByRole('radio', { name: 'Aktiviteten godkjennes' }));
    await userEvent.click(screen.getAllByRole('button', { name: 'Åpne datovelger' })[0]);
    await userEvent.click(screen.getByRole('button', { name: 'søndag 13' }));
    await userEvent.click(screen.getByRole('button', { name: 'mandag 14' }));
    await userEvent.click(screen.getByRole('button', { name: 'Oppdater' }));
    await userEvent.click(screen.getByRole('button', { name: 'Bekreft og fortsett' }));

    const editedActivity = {
      ...opptjeningActivities[1],
      erEndret: true,
      erGodkjent: true,
    };

    const { calls } = formChangeCallback.mock;
    expect(calls).toHaveLength(1);
    const args = calls[0];
    expect(args).toHaveLength(3);
    expect(args[0]).toBe('Behandling_123.OpptjeningFaktaForm');
    expect(args[1]).toBe('opptjeningList[0].opptjeningAktivitetList');
    expect(args[2]).toStrictEqual([opptjeningActivities[0], editedActivity]);

    expect(formInitCallback.mock.calls).toHaveLength(1);
  });

  it('skal legge til aktivitet', async () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);
    const formChangeCallback = vi.fn();

    renderWithIntlAndReduxForm(
      <OpptjeningFaktaForm
        hasAksjonspunkt
        readOnly={false}
        opptjeningAktivitetTypes={opptjeningAktivitetTypes}
        behandlingFormPrefix="Behandling_123"
        formName="OpptjeningFaktaForm"
        reduxFormChange={formChangeCallback}
        reduxFormInitialize={vi.fn()}
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
        kodeverkNavnFraKode={kodeverkNavnFraKode}
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
    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);
    const formChangeCallback = vi.fn();
    const formInitCallback = vi.fn();

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
        kodeverkNavnFraKode={kodeverkNavnFraKode}
      />,
      { messages },
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Avbryt' }));
    });

    const initCalls = formInitCallback.mock.calls;
    expect(initCalls.length).toBe(1);
    expect(initCalls[0].length).toBe(2);
    expect(initCalls[0][0]).toBe('Behandling_123.ActivityPanelForm');
    expect(initCalls[0][1]).toStrictEqual({});
  });
});

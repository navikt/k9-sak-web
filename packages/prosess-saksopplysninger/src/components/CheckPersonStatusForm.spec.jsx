import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';

import React from 'react';
import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import { CheckPersonStatusFormImpl as UnwrappedForm, buildInitialValues } from './CheckPersonStatusForm';

describe('<CheckPersonStatusForm>', () => {
  const alleKodeverk = {
    [kodeverkTyper.PERSONSTATUS_TYPE]: [
      {
        kode: 'UKJENT',
        kodeverk: 'PERSONSTATUS_TYPE',
        navn: 'Ukjent',
      },
      {
        kode: 'BOSATT',
        kodeverk: 'PERSONSTATUS_TYPE',
        navn: 'Bosatt',
      },
    ],
  };

  it('skal vise hjelpetekst med original personstatus og begrunnelse/submit', () => {
    renderWithIntlAndReduxForm(
      <UnwrappedForm
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        readOnlySubmitButton
        fortsettBehandling="false"
        originalPersonstatusName="Ukjent"
        personstatusName=""
        personStatuser={[]}
        gjeldeneFom="2018-10-10"
        behandlingId={1}
        behandlingVersjon={1}
      />,
      { messages },
    );

    expect(
      screen.getByText(
        'Søker har personstatus: Ukjent. Vurder om behandlingen skal henlegges eller kan fortsette med endret personstatus',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Vurdering' })).toBeInTheDocument();
  });

  it('skal vise radioknapper for å velge om behandlingen skal fortsette eller henlegges', () => {
    renderWithIntlAndReduxForm(
      <UnwrappedForm
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        readOnlySubmitButton
        fortsettBehandling="false"
        originalPersonstatusName="Ukjent"
        personstatusName=""
        personStatuser={[]}
        gjeldeneFom="2018-10-10"
        behandlingId={1}
        behandlingVersjon={1}
      />,
      { messages },
    );

    expect(screen.getByRole('radio', { name: 'Henlegg behandlingen' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Fortsett behandlingen' })).toBeInTheDocument();
  });

  it('skal vise en radioknapp for alle personstatuser', () => {
    const personstatuser = [
      {
        kode: 'BOSATT',
        navn: 'Bosatt',
      },
      {
        kode: 'ANNEN',
        navn: 'Annen',
      },
    ];
    renderWithIntlAndReduxForm(
      <UnwrappedForm
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        readOnlySubmitButton
        fortsettBehandling
        originalPersonstatusName="Ukjent"
        personstatusName=""
        personStatuser={personstatuser}
        gjeldeneFom="2018-10-10"
        behandlingId={1}
        behandlingVersjon={1}
      />,
      { messages },
    );

    expect(screen.getByRole('radio', { name: 'Bosatt' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Annen' })).toBeInTheDocument();
  });

  it('skal vise readonly-form når status er readonly', () => {
    const initialValues = {
      fortsettBehandling: 'false',
      begrunnelse: 'Dette er en begrunnelse',
    };
    renderWithIntlAndReduxForm(
      <UnwrappedForm
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly
        readOnlySubmitButton
        fortsettBehandling="false"
        originalPersonstatusName="Ukjent"
        personstatusName="Bosatt"
        initialValues={initialValues}
        personStatuser={[{}]}
        gjeldeneFom="2018-10-10"
        behandlingId={1}
        behandlingVersjon={1}
      />,
      { messages },
    );

    expect(screen.getByRole('radio', { name: 'Henlegg behandlingen' })).toBeDisabled();
    expect(screen.getByRole('radio', { name: 'Fortsett behandlingen' })).toBeDisabled();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Fortsett behandlingen' })).not.toBeInTheDocument();
  });

  it('skal sette opp initielle verdier gitt behandling og behandlingspunkt', () => {
    const behandlingHenlagt = true;
    const personopplysning = {
      personstatus: {
        kode: 'UKJENT',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
      avklartPersonstatus: {
        orginalPersonstatus: {
          kode: 'UKJENT',
          kodeverk: 'PERSONSTATUS_TYPE',
        },
        overstyrtPersonstatus: {
          kode: personstatusType.BOSATT,
          kodeverk: 'PERSONSTATUS_TYPE',
        },
      },
    };
    const aksjonspunkter = [
      {
        definisjon: {
          kode: 'test',
        },
        status: {
          kode: aksjonspunktStatus.AVBRUTT,
        },
        begrunnelse: 'Dette er en begrunnelse',
      },
    ];

    const initialValues = buildInitialValues.resultFunc(
      behandlingHenlagt,
      aksjonspunkter,
      personopplysning,
      alleKodeverk,
    );

    expect(initialValues).toEqual({
      originalPersonstatusName: 'Ukjent',
      fortsettBehandling: false,
      personstatus: personstatusType.BOSATT,
      begrunnelse: aksjonspunkter[0].begrunnelse,
    });
  });

  it('skal fortsette behandlingen når aksjonspunkt er lukket og behandlingsstatus er ulik avsluttet', () => {
    const behandlingHenlagt = false;
    const personopplysning = {
      personstatus: {
        kode: 'UKJENT',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
      avklartPersonstatus: {
        orginalPersonstatus: {
          kode: 'UKJENT',
          kodeverk: 'PERSONSTATUS_TYPE',
        },
        overstyrtPersonstatus: {
          kode: personstatusType.BOSATT,
          kodeverk: 'PERSONSTATUS_TYPE',
        },
      },
    };
    const aksjonspunkter = [
      {
        definisjon: {
          kode: 'test',
        },
        status: {
          kode: aksjonspunktStatus.AVBRUTT,
        },
        begrunnelse: 'Dette er en begrunnelse',
      },
    ];

    const initialValues = buildInitialValues.resultFunc(
      behandlingHenlagt,
      aksjonspunkter,
      personopplysning,
      alleKodeverk,
    );

    expect(initialValues).toEqual({
      originalPersonstatusName: 'Ukjent',
      fortsettBehandling: true,
      personstatus: personstatusType.BOSATT,
      begrunnelse: aksjonspunkter[0].begrunnelse,
    });
  });

  it('skal ikke ha satt verdi for om behandlingen skal fortsette om aksjonspunktet er åpent', () => {
    const behandlingHenlagt = false;
    const personopplysning = {
      personstatus: {
        kode: 'UKJENT',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
    };
    const aksjonspunkter = [
      {
        definisjon: {
          kode: 'test',
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: 'Dette er en begrunnelse',
      },
    ];

    const initialValues = buildInitialValues.resultFunc(
      behandlingHenlagt,
      aksjonspunkter,
      personopplysning,
      alleKodeverk,
    );

    expect(initialValues).toEqual({
      originalPersonstatusName: 'Ukjent',
      fortsettBehandling: undefined,
      personstatus: undefined,
      begrunnelse: aksjonspunkter[0].begrunnelse,
    });
  });
});

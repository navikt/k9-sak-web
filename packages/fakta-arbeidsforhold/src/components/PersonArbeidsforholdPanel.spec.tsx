import React from 'react';
import sinon from 'sinon';

import aktivtArbeidsforholdHandling from '../kodeverk/aktivtArbeidsforholdHandling';
import arbeidsforholdHandling from '../kodeverk/arbeidsforholdHandling';
import PersonArbeidsforholdTable from './arbeidsforholdTabell/PersonArbeidsforholdTable';
import PersonArbeidsforholdDetailForm from './arbeidsforholdDetaljer/PersonArbeidsforholdDetailForm';
import PersonArbeidsforholdPanel, { PersonArbeidsforholdPanelImpl } from './PersonArbeidsforholdPanel';
import shallowWithIntl, { intlMock } from '../../i18n/intl-enzyme-test-helper-fakta-arbeidsforhold';

const arbeidsgiverOpplysningerPerId = {
  1234567: {
    identifikator: '1234567',
    referanse: '1234567',
    navn: 'Svendsen Eksos',
    fødselsdato: null,
    erPrivatPerson: true,
  },
  2345678: {
    identifikator: '2345678',
    referanse: '2345678',
    navn: 'Nav',
    fødselsdato: null,
    erPrivatPerson: true,
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
        navn: '',
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

  it('skal rendre komponent', () => {
    const wrapper = shallowWithIntl(
      <PersonArbeidsforholdPanelImpl
        intl={intlMock}
        readOnly={false}
        hasAksjonspunkter
        hasOpenAksjonspunkter
        arbeidsforhold={[arbeidsforhold]}
        behandlingFormPrefix="panel"
        reduxFormChange={sinon.spy()}
        reduxFormInitialize={sinon.spy()}
        aktivtArbeidsforholdTillatUtenIM
        skalKunneLeggeTilNyeArbeidsforhold={false}
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />,
    );
    expect(wrapper.find(PersonArbeidsforholdTable)).toHaveLength(1);
    expect(wrapper.find(PersonArbeidsforholdDetailForm)).toHaveLength(1);
  });

  it('skal ikke vise arbeidsforhold-detaljer når ingen er valgt i tabell', () => {
    const wrapper = shallowWithIntl(
      <PersonArbeidsforholdPanelImpl
        intl={intlMock}
        readOnly={false}
        hasAksjonspunkter
        hasOpenAksjonspunkter
        arbeidsforhold={[arbeidsforhold]}
        behandlingFormPrefix="panel"
        reduxFormChange={sinon.spy()}
        reduxFormInitialize={sinon.spy()}
        aktivtArbeidsforholdTillatUtenIM
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />,
    );

    wrapper.setState({ selectedArbeidsforhold: undefined });

    expect(wrapper.find(PersonArbeidsforholdDetailForm)).toHaveLength(0);
  });

  it('skal automatisk vise arbeidsforhold når det er til vurdering og ikke allerede er endret av saksbehandler', () => {
    const wrapper = shallowWithIntl(
      <PersonArbeidsforholdPanelImpl
        intl={intlMock}
        readOnly={false}
        hasAksjonspunkter
        hasOpenAksjonspunkter
        arbeidsforhold={[arbeidsforhold]}
        behandlingFormPrefix="panel"
        reduxFormChange={sinon.spy()}
        reduxFormInitialize={sinon.spy()}
        aktivtArbeidsforholdTillatUtenIM
        skalKunneLeggeTilNyeArbeidsforhold={false}
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />,
    );

    expect(wrapper.find(PersonArbeidsforholdDetailForm)).toHaveLength(1);
  });

  it('skal ikke vise arbeidsforhold automatisk når det ikke er aksjonspunkt på det', () => {
    const wrapper = shallowWithIntl(
      <PersonArbeidsforholdPanelImpl
        intl={intlMock}
        readOnly={false}
        hasAksjonspunkter
        hasOpenAksjonspunkter
        arbeidsforhold={[
          {
            ...arbeidsforhold,
            aksjonspunktÅrsaker: [],
          },
        ]}
        behandlingFormPrefix="panel"
        reduxFormChange={sinon.spy()}
        reduxFormInitialize={sinon.spy()}
        aktivtArbeidsforholdTillatUtenIM
        skalKunneLeggeTilNyeArbeidsforhold={false}
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />,
    );

    expect(wrapper.find(PersonArbeidsforholdDetailForm)).toHaveLength(0);
  });

  it('skal fjerne detaljepanel ved avbryt', () => {
    const wrapper = shallowWithIntl(
      <PersonArbeidsforholdPanelImpl
        intl={intlMock}
        readOnly={false}
        hasAksjonspunkter
        hasOpenAksjonspunkter
        arbeidsforhold={[arbeidsforhold]}
        behandlingFormPrefix="panel"
        reduxFormChange={sinon.spy()}
        reduxFormInitialize={sinon.spy()}
        aktivtArbeidsforholdTillatUtenIM
        skalKunneLeggeTilNyeArbeidsforhold={false}
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />,
    );

    // @ts-ignore
    expect(wrapper.state().selectedArbeidsforhold).toEqual(arbeidsforhold);
    const detailForm = wrapper.find(PersonArbeidsforholdDetailForm);
    expect(detailForm).toHaveLength(1);

    detailForm.prop('cancelArbeidsforhold')({} as React.MouseEvent);
    wrapper.update();

    // @ts-ignore
    expect(wrapper.state().selectedArbeidsforhold).toBeUndefined();
    expect(wrapper.find(PersonArbeidsforholdDetailForm)).toHaveLength(0);
  });

  it('skal rulle tilbake markering av nytt arbeidsforhold når det ikke lenger skal brukes', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      erNyttArbeidsforhold: true,
    };
    const formChangeCallback = sinon.spy();
    const wrapper = shallowWithIntl(
      <PersonArbeidsforholdPanelImpl
        intl={intlMock}
        readOnly={false}
        hasAksjonspunkter
        hasOpenAksjonspunkter
        arbeidsforhold={[newArbeidsforhold]}
        behandlingFormPrefix="panel"
        reduxFormChange={formChangeCallback}
        reduxFormInitialize={sinon.spy()}
        aktivtArbeidsforholdTillatUtenIM
        skalKunneLeggeTilNyeArbeidsforhold={false}
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />,
    );
    const editedArbeidsforhold = {
      ...newArbeidsforhold,
      arbeidsforholdHandlingField: ArbeidsforholdHandling.FJERN_ARBEIDSFORHOLD,
    };
    const detailForm = wrapper.find(PersonArbeidsforholdDetailForm);
    detailForm.prop('updateArbeidsforhold')(editedArbeidsforhold);
    const calls = formChangeCallback.getCalls();
    expect(calls).toHaveLength(1);
    const { args } = calls[0];
    expect(args).toHaveLength(3);
    expect(args[0]).toEqual('panel.ArbeidsforholdInfoPanel');
    expect(args[1]).toEqual('arbeidsforhold');
    expect(args[2]).toEqual([
      {
        ...editedArbeidsforhold,
        erNyttArbeidsforhold: undefined,
        brukArbeidsforholdet: false,
        erEndret: true,
        fortsettBehandlingUtenInntektsmelding: false,
        brukMedJustertPeriode: false,
        brukPermisjon: undefined,
        inntektMedTilBeregningsgrunnlag: undefined,
      },
    ]);
    // @ts-ignore
    expect(wrapper.state().selectedArbeidsforhold).toBeUndefined();
  });

  it('skal rulle tilbake arbeidsforholdet som skal erstattes ved valg av nytt arbeidsforhold', () => {
    const oldArbeidsforhold = {
      ...arbeidsforhold,
      erSlettet: true,
      mottattDatoInntektsmelding: '2018-01-01',
      tilVurdering: false,
      id: '2',
    };
    const newArbeidsforhold = {
      ...arbeidsforhold,
      erNyttArbeidsforhold: false,
      erstatterArbeidsforholdId: oldArbeidsforhold.id,
      mottattDatoInntektsmelding: '2018-10-01',
    };
    const formChangeCallback = sinon.spy();
    const wrapper = shallowWithIntl(
      <PersonArbeidsforholdPanelImpl
        intl={intlMock}
        readOnly={false}
        hasAksjonspunkter
        hasOpenAksjonspunkter
        arbeidsforhold={[newArbeidsforhold, oldArbeidsforhold]}
        behandlingFormPrefix="panel"
        reduxFormChange={formChangeCallback}
        reduxFormInitialize={sinon.spy()}
        aktivtArbeidsforholdTillatUtenIM
        skalKunneLeggeTilNyeArbeidsforhold={false}
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />,
    );

    const editedArbeidsforhold = {
      ...newArbeidsforhold,
      erNyttArbeidsforhold: true,
      arbeidsforholdHandlingField: arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD,
    };
    wrapper.setState({ selectedArbeidsforhold: editedArbeidsforhold });

    const detailForm = wrapper.find(PersonArbeidsforholdDetailForm);
    detailForm.prop('updateArbeidsforhold')(editedArbeidsforhold);
    const calls = formChangeCallback.getCalls();
    expect(calls).toHaveLength(1);
    const { args } = calls[0];
    expect(args).toHaveLength(3);
    expect(args[0]).toEqual('panel.ArbeidsforholdInfoPanel');
    expect(args[1]).toEqual('arbeidsforhold');

    // FIXME (TOR) fomDato skal ikkje vera undefined her
    expect(args[2]).toEqual([
      {
        ...oldArbeidsforhold,
        erSlettet: false,
      },
      {
        ...editedArbeidsforhold,
        erstatterArbeidsforholdId: undefined,
        erEndret: true,
        fomDato: undefined,
        brukMedJustertPeriode: false,
        fortsettBehandlingUtenInntektsmelding: undefined,
        brukPermisjon: undefined,
        inntektMedTilBeregningsgrunnlag: undefined,
      },
    ]);

    // @ts-ignore
    expect(wrapper.state().selectedArbeidsforhold).toBeUndefined();
  });

  it('skal legge gamle arbeidsforhold med samme orgnr på nytt arbeidsforhold', () => {
    const oldArbeidsforhold = {
      ...arbeidsforhold,
      mottattDatoInntektsmelding: '2018-01-01',
      brukMedJustertPeriode: false,
      fortsettBehandlingUtenInntektsmelding: true,
      brukArbeidsforholdet: true,
    };
    const newArbeidsforhold = {
      id: 2,
      ...arbeidsforhold,
      arbeidsforholdId: '1231-9876',
      mottattDatoInntektsmelding: '2018-10-01',
      brukMedJustertPeriode: false,
      fortsettBehandlingUtenInntektsmelding: true,
      brukArbeidsforholdet: true,
    };

    const initialValues = PersonArbeidsforholdPanel.buildInitialValues(
      [newArbeidsforhold, oldArbeidsforhold],
      arbeidsgiverOpplysningerPerId,
    );

    expect(initialValues).toEqual({
      arbeidsforhold: [
        {
          ...newArbeidsforhold,
          originalFomDato: '2018-01-01',
          replaceOptions: [oldArbeidsforhold],
          arbeidsforholdHandlingField: arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD,
          aktivtArbeidsforholdHandlingField: undefined,
          overstyrtTom: undefined,
          navn: 'Svendsen Eksos',
        },
        {
          ...oldArbeidsforhold,
          originalFomDato: '2018-01-01',
          replaceOptions: [],
          arbeidsforholdHandlingField: arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD,
          aktivtArbeidsforholdHandlingField: undefined,
          overstyrtTom: undefined,
          navn: 'Svendsen Eksos',
        },
      ],
    });
  });

  it('skal oppdatere arbeidsforholdet korrekt med når man skal fjerne arbeidsforholdet', () => {
    const formChangeCallback = sinon.spy();
    const wrapper = shallowWithIntl(
      <PersonArbeidsforholdPanelImpl
        intl={intlMock}
        readOnly={false}
        hasAksjonspunkter
        hasOpenAksjonspunkter
        arbeidsforhold={[arbeidsforhold]}
        behandlingFormPrefix="panel"
        reduxFormChange={formChangeCallback}
        reduxFormInitialize={sinon.spy()}
        aktivtArbeidsforholdTillatUtenIM
        skalKunneLeggeTilNyeArbeidsforhold={false}
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />,
    );

    const editedArbeidsforhold = {
      ...arbeidsforhold,
      arbeidsforholdHandlingField: arbeidsforholdHandling.FJERN_ARBEIDSFORHOLD,
    };

    const detailForm = wrapper.find(PersonArbeidsforholdDetailForm);
    detailForm.prop('updateArbeidsforhold')(editedArbeidsforhold);

    const calls = formChangeCallback.getCalls();
    expect(calls).toHaveLength(1);
    const { args } = calls[0];
    expect(args).toHaveLength(3);
    expect(args[0]).toEqual('panel.ArbeidsforholdInfoPanel');
    expect(args[1]).toEqual('arbeidsforhold');
    expect(args[2]).toEqual([
      {
        ...editedArbeidsforhold,
        erEndret: true,
        brukArbeidsforholdet: false,
        fortsettBehandlingUtenInntektsmelding: false,
        brukMedJustertPeriode: false,
        brukPermisjon: undefined,
        inntektMedTilBeregningsgrunnlag: undefined,
      },
    ]);

    // @ts-ignore
    expect(wrapper.state().selectedArbeidsforhold).toBeUndefined();
  });

  it('skal oppdatere arbeidsforholdet korrekt med når man skal fortsette uten inntektsmelding', () => {
    const formChangeCallback = sinon.spy();
    const wrapper = shallowWithIntl(
      <PersonArbeidsforholdPanelImpl
        intl={intlMock}
        readOnly={false}
        hasAksjonspunkter
        hasOpenAksjonspunkter
        arbeidsforhold={[arbeidsforhold]}
        behandlingFormPrefix="panel"
        reduxFormChange={formChangeCallback}
        reduxFormInitialize={sinon.spy()}
        aktivtArbeidsforholdTillatUtenIM
        skalKunneLeggeTilNyeArbeidsforhold={false}
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />,
    );

    const editedArbeidsforhold = {
      ...arbeidsforhold,
      arbeidsforholdHandlingField: arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD,
      aktivtArbeidsforholdHandlingField: aktivtArbeidsforholdHandling.BENYTT_A_INNTEKT_I_BG,
    };

    const detailForm = wrapper.find(PersonArbeidsforholdDetailForm);
    detailForm.prop('updateArbeidsforhold')(editedArbeidsforhold);

    const calls = formChangeCallback.getCalls();
    expect(calls).toHaveLength(1);
    const { args } = calls[0];
    expect(args).toHaveLength(3);
    expect(args[0]).toEqual('panel.ArbeidsforholdInfoPanel');
    expect(args[1]).toEqual('arbeidsforhold');
    expect(args[2]).toEqual([
      {
        ...editedArbeidsforhold,
        erEndret: true,
        fortsettBehandlingUtenInntektsmelding: true,
        brukMedJustertPeriode: false,
        brukPermisjon: undefined,
        inntektMedTilBeregningsgrunnlag: undefined,
      },
    ]);

    // @ts-ignore
    expect(wrapper.state().selectedArbeidsforhold).toBeUndefined();
  });

  it('skal oppdatere arbeidsforholdet korrekt når nødvendig inntektsmelding ikke mottatt', () => {
    const formChangeCallback = sinon.spy();
    const wrapper = shallowWithIntl(
      <PersonArbeidsforholdPanelImpl
        intl={intlMock}
        readOnly={false}
        hasAksjonspunkter
        hasOpenAksjonspunkter
        arbeidsforhold={[arbeidsforhold]}
        behandlingFormPrefix="panel"
        reduxFormChange={formChangeCallback}
        reduxFormInitialize={sinon.spy()}
        aktivtArbeidsforholdTillatUtenIM
        skalKunneLeggeTilNyeArbeidsforhold={false}
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />,
    );

    const editedArbeidsforhold = {
      ...arbeidsforhold,
      arbeidsforholdHandlingField: arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD,
      aktivtArbeidsforholdHandlingField: aktivtArbeidsforholdHandling.AVSLA_YTELSE,
    };

    const detailForm = wrapper.find(PersonArbeidsforholdDetailForm);
    detailForm.prop('updateArbeidsforhold')(editedArbeidsforhold);

    const calls = formChangeCallback.getCalls();
    expect(calls).toHaveLength(1);
    const { args } = calls[0];
    expect(args).toHaveLength(3);
    expect(args[0]).toEqual('panel.ArbeidsforholdInfoPanel');
    expect(args[1]).toEqual('arbeidsforhold');
    expect(args[2]).toEqual([
      {
        ...editedArbeidsforhold,
        erEndret: true,
        fortsettBehandlingUtenInntektsmelding: false,
        brukMedJustertPeriode: false,
        brukPermisjon: undefined,
        inntektMedTilBeregningsgrunnlag: undefined,
      },
    ]);

    // @ts-ignore
    expect(wrapper.state().selectedArbeidsforhold).toBeUndefined();
  });

  it('skal oppdatere arbeidsforholdet korrekt når overstyrtTom satt av saksbehandler', () => {
    const formChangeCallback = sinon.spy();
    const wrapper = shallowWithIntl(
      <PersonArbeidsforholdPanelImpl
        intl={intlMock}
        readOnly={false}
        hasAksjonspunkter
        hasOpenAksjonspunkter
        arbeidsforhold={[arbeidsforhold]}
        behandlingFormPrefix="panel"
        reduxFormChange={formChangeCallback}
        reduxFormInitialize={sinon.spy()}
        aktivtArbeidsforholdTillatUtenIM
        skalKunneLeggeTilNyeArbeidsforhold={false}
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />,
    );

    const editedArbeidsforhold = {
      ...arbeidsforhold,
      arbeidsforholdHandlingField: ArbeidsforholdHandling.OVERSTYR_TOM,
      aktivtArbeidsforholdHandlingField: undefined,
      overstyrtTom: '2019-03-06',
    };

    const detailForm = wrapper.find(PersonArbeidsforholdDetailForm);
    detailForm.prop('updateArbeidsforhold')(editedArbeidsforhold);

    const calls = formChangeCallback.getCalls();
    expect(calls).toHaveLength(1);
    const { args } = calls[0];
    expect(args).toHaveLength(3);
    expect(args[0]).toEqual('panel.ArbeidsforholdInfoPanel');
    expect(args[1]).toEqual('arbeidsforhold');
    expect(args[2]).toEqual([
      {
        ...editedArbeidsforhold,
        erEndret: true,
        fortsettBehandlingUtenInntektsmelding: true,
        brukMedJustertPeriode: true,
        brukPermisjon: undefined,
        inntektMedTilBeregningsgrunnlag: undefined,
      },
    ]);

    // @ts-ignore
    expect(wrapper.state().selectedArbeidsforhold).toBeUndefined();
  });

  it('skal lage nytt arbeidsforhold object', () => {
    const wrapper = shallowWithIntl(
      <PersonArbeidsforholdPanelImpl
        intl={intlMock}
        readOnly={false}
        hasAksjonspunkter
        hasOpenAksjonspunkter
        arbeidsforhold={[]}
        behandlingFormPrefix="panel"
        reduxFormChange={sinon.spy()}
        reduxFormInitialize={sinon.spy()}
        aktivtArbeidsforholdTillatUtenIM
        skalKunneLeggeTilNyeArbeidsforhold
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />,
    );
    const instance = wrapper.instance();
    // @ts-ignore
    const valgtArbeidsforholdForLagtTil = wrapper.state().selectedArbeidsforhold as Arbeidsforhold;
    expect(valgtArbeidsforholdForLagtTil).toEqual(undefined);

    // @ts-ignore
    instance.leggTilArbeidsforhold();

    // @ts-ignore
    const valgtArbeidsforhold = wrapper.state().selectedArbeidsforhold as Arbeidsforhold;
    expect(valgtArbeidsforhold).not.toEqual(undefined);
    expect(valgtArbeidsforhold.id).not.toEqual(undefined);
    expect(valgtArbeidsforhold.lagtTilAvSaksbehandler).toEqual(true);
    expect(valgtArbeidsforhold.tilVurdering).toEqual(true);
    expect(valgtArbeidsforhold.kilde.navn).toEqual('Saksbehandler');
    expect(valgtArbeidsforhold.brukArbeidsforholdet).toEqual(true);
    // @ts-ignore
    expect(valgtArbeidsforhold.arbeidsforholdHandlingField).toEqual(ArbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD);
    expect(valgtArbeidsforhold.erEndret).toEqual(undefined);
    expect(valgtArbeidsforhold.vurderOmSkalErstattes).toEqual(undefined);
    expect(valgtArbeidsforhold.ikkeRegistrertIAaRegister).toEqual(undefined);
    expect(valgtArbeidsforhold.harErsattetEttEllerFlere).toEqual(undefined);
    expect(valgtArbeidsforhold.erstatterArbeidsforholdId).toEqual(undefined);
    expect(valgtArbeidsforhold.erSlettet).toEqual(undefined);
    expect(valgtArbeidsforhold.erNyttArbeidsforhold).toEqual(undefined);
    expect(valgtArbeidsforhold.fortsettBehandlingUtenInntektsmelding).toEqual(undefined);
    expect(valgtArbeidsforhold.stillingsprosent).toEqual(undefined);
    expect(valgtArbeidsforhold.begrunnelse).toEqual(undefined);
    expect(valgtArbeidsforhold.mottattDatoInntektsmelding).toEqual(undefined);
    expect(valgtArbeidsforhold.fomDato).toEqual(undefined);
    expect(valgtArbeidsforhold.tomDato).toEqual(undefined);
    expect(valgtArbeidsforhold.arbeidsforholdId).toEqual(undefined);
    expect(valgtArbeidsforhold.arbeidsgiverReferanse).toEqual(undefined);
  });

  it('skal vise knapp for å legge til arbeidsforhold', () => {
    const wrapper = shallowWithIntl(
      <PersonArbeidsforholdPanelImpl
        intl={intlMock}
        readOnly={false}
        hasAksjonspunkter
        hasOpenAksjonspunkter
        arbeidsforhold={[]}
        behandlingFormPrefix="panel"
        reduxFormChange={sinon.spy()}
        reduxFormInitialize={sinon.spy()}
        aktivtArbeidsforholdTillatUtenIM
        skalKunneLeggeTilNyeArbeidsforhold
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />,
    );
    const btn = wrapper.find('button');
    expect(btn).toHaveLength(1);
    // @ts-ignore
    expect(btn.props().children.props.id).toEqual('PersonArbeidsforholdTable.LeggTilArbeidsforhold');
    // @ts-ignore
    expect(wrapper.state().selectedArbeidsforhold).toEqual(undefined);
  });

  it('skal ikke vise knapp for å legge til arbeidsforhold', () => {
    const wrapper = shallowWithIntl(
      <PersonArbeidsforholdPanelImpl
        intl={intlMock}
        readOnly
        hasAksjonspunkter
        hasOpenAksjonspunkter
        arbeidsforhold={[]}
        behandlingFormPrefix="panel"
        reduxFormChange={sinon.spy()}
        reduxFormInitialize={sinon.spy()}
        aktivtArbeidsforholdTillatUtenIM
        skalKunneLeggeTilNyeArbeidsforhold
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />,
    );
    const btn = wrapper.find('button');
    expect(btn).toHaveLength(0);
    // @ts-ignore
    expect(wrapper.state().selectedArbeidsforhold).toEqual(undefined);
  });

  it('skal oppdatere arbeidsforholdet korrekt når man skal bruke permisjon', () => {
    const formChangeCallback = sinon.spy();
    const wrapper = shallowWithIntl(
      <PersonArbeidsforholdPanelImpl
        intl={intlMock}
        readOnly={false}
        hasAksjonspunkter
        hasOpenAksjonspunkter
        arbeidsforhold={[arbeidsforhold]}
        behandlingFormPrefix="panel"
        reduxFormChange={formChangeCallback}
        reduxFormInitialize={sinon.spy()}
        aktivtArbeidsforholdTillatUtenIM
        skalKunneLeggeTilNyeArbeidsforhold={false}
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />,
    );

    const editedArbeidsforhold = {
      ...arbeidsforhold,
      arbeidsforholdHandlingField: ArbeidsforholdHandling.SOKER_ER_I_PERMISJON,
      permisjoner: [
        {
          permisjonFom: '2018-10-10',
          permisjonTom: undefined,
          permisjonsprosent: 100,
          permisjonsÅrsak: 'aarsak',
        },
      ],
    };
    const detailForm = wrapper.find(PersonArbeidsforholdDetailForm);
    detailForm.prop('updateArbeidsforhold')(editedArbeidsforhold);
    const calls = formChangeCallback.getCalls();
    expect(calls).toHaveLength(1);
    const { args } = calls[0];
    expect(args).toHaveLength(3);
    expect(args[0]).toEqual('panel.ArbeidsforholdInfoPanel');
    expect(args[1]).toEqual('arbeidsforhold');
    expect(args[2]).toEqual([
      {
        ...editedArbeidsforhold,
        erEndret: true,
        brukArbeidsforholdet: true,
        fortsettBehandlingUtenInntektsmelding: true,
        brukMedJustertPeriode: false,
        brukPermisjon: true,
        inntektMedTilBeregningsgrunnlag: undefined,
      },
    ]);
  });

  it('skal oppdatere arbeidsforholdet korrekt når man ikke skal bruke permisjon', () => {
    const formChangeCallback = sinon.spy();
    const wrapper = shallowWithIntl(
      <PersonArbeidsforholdPanelImpl
        intl={intlMock}
        readOnly={false}
        hasAksjonspunkter
        hasOpenAksjonspunkter
        arbeidsforhold={[arbeidsforhold]}
        behandlingFormPrefix="panel"
        reduxFormChange={formChangeCallback}
        reduxFormInitialize={sinon.spy()}
        aktivtArbeidsforholdTillatUtenIM
        skalKunneLeggeTilNyeArbeidsforhold={false}
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />,
    );

    const editedArbeidsforhold = {
      ...arbeidsforhold,
      arbeidsforholdHandlingField: ArbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD,
      permisjoner: [
        {
          permisjonFom: '2012-01-01',
          permisjonTom: undefined,
          permisjonsprosent: 100,
          permisjonsÅrsak: 'aarsak',
        },
        {
          permisjonFom: '2018-10-10',
          permisjonTom: undefined,
          permisjonsprosent: 100,
          permisjonsÅrsak: 'aarsak',
        },
      ],
    };
    const detailForm = wrapper.find(PersonArbeidsforholdDetailForm);
    detailForm.prop('updateArbeidsforhold')(editedArbeidsforhold);
    const calls = formChangeCallback.getCalls();
    expect(calls).toHaveLength(1);
    const { args } = calls[0];
    expect(args).toHaveLength(3);
    expect(args[0]).toEqual('panel.ArbeidsforholdInfoPanel');
    expect(args[1]).toEqual('arbeidsforhold');
    expect(args[2]).toEqual([
      {
        ...editedArbeidsforhold,
        erEndret: true,
        brukArbeidsforholdet: true,
        fortsettBehandlingUtenInntektsmelding: true,
        brukMedJustertPeriode: false,
        brukPermisjon: false,
        inntektMedTilBeregningsgrunnlag: undefined,
      },
    ]);
  });

  it('skal oppdatere arbeidsforholdet korrekt når man ikke skal ha inntekt med til beregningsgrunnlaget', () => {
    const formChangeCallback = sinon.spy();
    const wrapper = shallowWithIntl(
      <PersonArbeidsforholdPanelImpl
        intl={intlMock}
        readOnly={false}
        hasAksjonspunkter
        hasOpenAksjonspunkter
        arbeidsforhold={[arbeidsforhold]}
        behandlingFormPrefix="panel"
        reduxFormChange={formChangeCallback}
        reduxFormInitialize={sinon.spy()}
        aktivtArbeidsforholdTillatUtenIM
        skalKunneLeggeTilNyeArbeidsforhold={false}
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      />,
    );

    const editedArbeidsforhold = {
      ...arbeidsforhold,
      arbeidsforholdHandlingField: ArbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD,
      aktivtArbeidsforholdHandlingField: aktivtArbeidsforholdHandling.INNTEKT_IKKE_MED_I_BG,
    };
    const detailForm = wrapper.find(PersonArbeidsforholdDetailForm);
    detailForm.prop('updateArbeidsforhold')(editedArbeidsforhold);
    const calls = formChangeCallback.getCalls();
    expect(calls).toHaveLength(1);
    const { args } = calls[0];
    expect(args).toHaveLength(3);
    expect(args[0]).toEqual('panel.ArbeidsforholdInfoPanel');
    expect(args[1]).toEqual('arbeidsforhold');
    expect(args[2]).toEqual([
      {
        ...editedArbeidsforhold,
        erEndret: true,
        brukArbeidsforholdet: true,
        fortsettBehandlingUtenInntektsmelding: true,
        brukMedJustertPeriode: false,
        brukPermisjon: undefined,
        inntektMedTilBeregningsgrunnlag: false,
      },
    ]);
  });

  it('skal ikke utlede handlingstyper når arbeidsforholdet ikke er endret eller ikke til vurdering', () => {
    const oldArbeidsforhold = {
      ...arbeidsforhold,
      tilVurdering: false,
      erEndret: false,
    };
    const newArbeidsforhold = {
      id: 2,
      ...arbeidsforhold,
      tilVurdering: false,
      erEndret: false,
    };
    const initialValues = PersonArbeidsforholdPanel.buildInitialValues(
      [newArbeidsforhold, oldArbeidsforhold],
      arbeidsgiverOpplysningerPerId,
    );
    expect(initialValues).toEqual({
      arbeidsforhold: [
        {
          ...newArbeidsforhold,
          originalFomDato: '2018-01-01',
          replaceOptions: [],
          arbeidsforholdHandlingField: undefined,
          aktivtArbeidsforholdHandlingField: undefined,
          overstyrtTom: undefined,
          navn: 'Svendsen Eksos',
        },
        {
          ...oldArbeidsforhold,
          originalFomDato: '2018-01-01',
          replaceOptions: [],
          arbeidsforholdHandlingField: undefined,
          aktivtArbeidsforholdHandlingField: undefined,
          overstyrtTom: undefined,
          navn: 'Svendsen Eksos',
        },
      ],
    });
  });

  it('skal utlede riktig handlingstyper når overstyrt tom dato er satt', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      brukMedJustertPeriode: true,
    };
    const initialValues = PersonArbeidsforholdPanel.buildInitialValues(
      [newArbeidsforhold],
      arbeidsgiverOpplysningerPerId,
    );
    expect(initialValues).toEqual({
      arbeidsforhold: [
        {
          ...newArbeidsforhold,
          originalFomDato: '2018-01-01',
          replaceOptions: [],
          arbeidsforholdHandlingField: ArbeidsforholdHandling.OVERSTYR_TOM,
          aktivtArbeidsforholdHandlingField: undefined,
          overstyrtTom: '2018-10-10',
          navn: 'Svendsen Eksos',
        },
      ],
    });
  });

  it('skal utlede riktig handlingstyper når arbeidsforholdet skal bruke pemisjon', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      permisjoner: [
        {
          permisjonFom: '2012-01-01',
          permisjonTom: undefined,
          permisjonsprosent: 100,
          permisjonsÅrsak: 'aarsak',
        },
      ],
      brukPermisjon: true,
    };
    const initialValues = PersonArbeidsforholdPanel.buildInitialValues(
      [newArbeidsforhold],
      arbeidsgiverOpplysningerPerId,
    );
    expect(initialValues).toEqual({
      arbeidsforhold: [
        {
          ...newArbeidsforhold,
          originalFomDato: '2018-01-01',
          replaceOptions: [],
          arbeidsforholdHandlingField: ArbeidsforholdHandling.SOKER_ER_I_PERMISJON,
          aktivtArbeidsforholdHandlingField: undefined,
          overstyrtTom: undefined,
          navn: 'Svendsen Eksos',
        },
      ],
    });
  });

  it('skal utlede riktig handlingstyper når arbeidsforholdet skal fjernes', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      brukArbeidsforholdet: false,
    };
    const initialValues = PersonArbeidsforholdPanel.buildInitialValues(
      [newArbeidsforhold],
      arbeidsgiverOpplysningerPerId,
    );
    expect(initialValues).toEqual({
      arbeidsforhold: [
        {
          ...newArbeidsforhold,
          originalFomDato: '2018-01-01',
          replaceOptions: [],
          arbeidsforholdHandlingField: arbeidsforholdHandling.FJERN_ARBEIDSFORHOLD,
          aktivtArbeidsforholdHandlingField: undefined,
          overstyrtTom: undefined,
          navn: 'Svendsen Eksos',
        },
      ],
    });
  });

  it('skal utlede riktig handlingstyper når arbeidsforholdet er aktivt og ytelsen skal avslås', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      brukMedJustertPeriode: false,
      fortsettBehandlingUtenInntektsmelding: false,
    };
    const initialValues = PersonArbeidsforholdPanel.buildInitialValues(
      [newArbeidsforhold],
      arbeidsgiverOpplysningerPerId,
    );
    expect(initialValues).toEqual({
      arbeidsforhold: [
        {
          ...newArbeidsforhold,
          originalFomDato: '2018-01-01',
          replaceOptions: [],
          arbeidsforholdHandlingField: arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD,
          aktivtArbeidsforholdHandlingField: aktivtArbeidsforholdHandling.AVSLA_YTELSE,
          overstyrtTom: undefined,
          navn: 'Svendsen Eksos',
        },
      ],
    });
  });

  it('skal utlede riktig handlingstyper når arbeidsforholdet er aktivt og innktekten ikke skal med til beregningsgrunnlaget', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      brukMedJustertPeriode: false,
      inntektMedTilBeregningsgrunnlag: false,
    };
    const initialValues = PersonArbeidsforholdPanel.buildInitialValues(
      [newArbeidsforhold],
      arbeidsgiverOpplysningerPerId,
    );
    expect(initialValues).toEqual({
      arbeidsforhold: [
        {
          ...newArbeidsforhold,
          originalFomDato: '2018-01-01',
          replaceOptions: [],
          arbeidsforholdHandlingField: arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD,
          aktivtArbeidsforholdHandlingField: aktivtArbeidsforholdHandling.INNTEKT_IKKE_MED_I_BG,
          overstyrtTom: undefined,
          navn: 'Svendsen Eksos',
        },
      ],
    });
  });

  it('skal utlede riktig handlingstyper når arbeidsforholdet er aktivt og behandlingen skal forsette uten inntektsmelding', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      brukMedJustertPeriode: false,
      fortsettBehandlingUtenInntektsmelding: true,
    };
    const initialValues = PersonArbeidsforholdPanel.buildInitialValues(
      [newArbeidsforhold],
      arbeidsgiverOpplysningerPerId,
    );
    expect(initialValues).toEqual({
      arbeidsforhold: [
        {
          ...newArbeidsforhold,
          originalFomDato: '2018-01-01',
          replaceOptions: [],
          arbeidsforholdHandlingField: arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD,
          aktivtArbeidsforholdHandlingField: aktivtArbeidsforholdHandling.BENYTT_A_INNTEKT_I_BG,
          overstyrtTom: undefined,
          navn: 'Svendsen Eksos',
        },
      ],
    });
  });

  it('skal utlede riktig handlingstyper når arbeidsforholdet er aktivt, søker er ikke i permisjon, og behandlingen skal forsette uten inntektsmelding', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      brukPermisjon: false,
      permisjoner: [
        {
          permisjonFom: '2012-01-01',
          permisjonTom: undefined,
          permisjonsprosent: 100,
          permisjonsÅrsak: 'aarsak',
        },
      ],
      fortsettBehandlingUtenInntektsmelding: true,
    };
    const initialValues = PersonArbeidsforholdPanel.buildInitialValues(
      [newArbeidsforhold],
      arbeidsgiverOpplysningerPerId,
    );
    expect(initialValues).toEqual({
      arbeidsforhold: [
        {
          ...newArbeidsforhold,
          originalFomDato: '2018-01-01',
          replaceOptions: [],
          arbeidsforholdHandlingField: arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD,
          aktivtArbeidsforholdHandlingField: aktivtArbeidsforholdHandling.BENYTT_A_INNTEKT_I_BG,
          overstyrtTom: undefined,
          navn: 'Svendsen Eksos',
        },
      ],
    });
  });
});

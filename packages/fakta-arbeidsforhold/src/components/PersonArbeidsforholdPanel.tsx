import React, { Component } from 'react';
import { WrappedComponentProps } from 'react-intl';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import chevronIkonUrl from '@fpsak-frontend/assets/images/pil_ned.svg';
import briefcaseImg from '@fpsak-frontend/assets/images/briefcase.svg';
import { getBehandlingFormPrefix, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { VerticalSpacer, FaktaGruppe, Image, FlexRow, FlexColumn } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Normaltekst } from 'nav-frontend-typografi';
import advarselImageUrl from '@fpsak-frontend/assets/images/advarsel2.svg';
import arbeidsforholdHandlingType from '@fpsak-frontend/kodeverk/src/arbeidsforholdHandlingType';
import { ArbeidsgiverOpplysningerPerId, KodeverkMedNavn } from '@k9-sak-web/types';
import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';
import { FormAction } from 'redux-form/lib/actions';
import Arbeidsgiver from '@k9-sak-web/types/src/arbeidsgiverTsType';
import arbeidsforholdKilder from '../kodeverk/arbeidsforholdKilder';
import PersonArbeidsforholdTable from './arbeidsforholdTabell/PersonArbeidsforholdTable';
import { PERSON_ARBEIDSFORHOLD_DETAIL_FORM } from './arbeidsforholdDetaljer/PersonArbeidsforholdDetailForm';

import styles from './personArbeidsforholdPanel.less';
import CustomArbeidsforhold from '../typer/CustomArbeidsforholdTsType';

// -------------------------------------------------------------------------------------------------------------
// Methods
// -------------------------------------------------------------------------------------------------------------

const cleanUpArbeidsforhold = (newValues, originalValues) => {
  if (!newValues.brukArbeidsforholdet) {
    return {
      ...newValues,
      erNyttArbeidsforhold: undefined,
      erstatterArbeidsforholdId: undefined,
      tomDato: originalValues.tomDato,
    };
  }
  if (newValues.erNyttArbeidsforhold) {
    return {
      ...newValues,
      erstatterArbeidsforholdId: undefined,
    };
  }
  return newValues;
};

const findFomDato = (arbeidsforhold, replacedArbeidsforhold) =>
  arbeidsforhold.erstatterArbeidsforholdId ? replacedArbeidsforhold.fomDato : arbeidsforhold.originalFomDato;

export const harAksjonspunkter = arbeidsforhold => {
  return Array.isArray(arbeidsforhold) && arbeidsforhold.filter(af => af.aksjonspunktÅrsaker.length > 0).length > 0;
};

interface PureOwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  readOnly: boolean;
  hasAksjonspunkter: boolean;
  alleMerknaderFraBeslutter: { [key: string]: { notAccepted?: boolean } };
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

interface MappedOwnProps {
  arbeidsforhold: CustomArbeidsforhold[];
  behandlingFormPrefix: string;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

interface DispatchProps {
  reduxFormChange: (
    form: string,
    field: string,
    value: any,
    touch?: boolean,
    persistentSubmitErrors?: boolean,
  ) => FormAction;
  reduxFormInitialize: (form: string, data: any) => FormAction;
}

interface OwnState {
  selectedArbeidsforhold?: CustomArbeidsforhold;
  selectedArbeidsgiver?: Arbeidsgiver;
}

interface StaticFunctions {
  buildInitialValues?: (
    arbeidsforhold: ArbeidsforholdV2[],
    arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId,
  ) => {
    arbeidsforhold: ArbeidsforholdV2[];
  };
  isReadOnly?: (state: any, behandlingId: number, behandlingVersjon: number) => boolean;
}

type Props = PureOwnProps & MappedOwnProps & DispatchProps & StaticFunctions & WrappedComponentProps;

/**
 * PersonArbeidsforholdPanelImpl:
 * - Håndterer staten for children-components.
 * - Bygger initialValues til children-components ved hjelp av arbeidsforhold PropType. Verdiene
 * som har samme navn i GUI og PropTypen blir fylt inn 'automatisk', mens andre variabler som
 * ikke er med i PropTypen må håndteres f.eks. i UpdateArbeidsforhold metoden.
 */
export class PersonArbeidsforholdPanelImpl extends Component<Props, OwnState> {
  static buildInitialValues = (arbeidsforhold: ArbeidsforholdV2[]) => ({
    arbeidsforhold,
  });

  static isReadOnly = (state: any, behandlingId: number, behandlingVersjon: number): boolean => {
    const arbeidsforhold = behandlingFormValueSelector(
      'ArbeidsforholdInfoPanel',
      behandlingId,
      behandlingVersjon,
    )(state, 'arbeidsforhold');
    return !arbeidsforhold;
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      selectedArbeidsforhold: undefined,
      selectedArbeidsgiver: undefined,
    };
    this.setSelectedArbeidsforhold = this.setSelectedArbeidsforhold.bind(this);
    this.setSelectedArbeidsgiver = this.setSelectedArbeidsgiver.bind(this);
    this.updateArbeidsforhold = this.updateArbeidsforhold.bind(this);
    this.cancelArbeidsforhold = this.cancelArbeidsforhold.bind(this);
    this.initializeActivityForm = this.initializeActivityForm.bind(this);
    this.leggTilArbeidsforhold = this.leggTilArbeidsforhold.bind(this);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    const { arbeidsforhold } = this.props;
    const selected = arbeidsforhold || undefined;
    this.setSelectedArbeidsforhold(undefined, undefined, selected);
  }

  setSelectedArbeidsforhold(p, id, selectedArbeidsforhold) {
    this.setState({ selectedArbeidsforhold });
    this.initializeActivityForm(selectedArbeidsforhold);
  }

  setSelectedArbeidsgiver(selected) {
    const { selectedArbeidsgiver } = this.state;

    if (selectedArbeidsgiver && selectedArbeidsgiver.arbeidsgiverOrgnr === selected.identifikator) {
      this.setState({ selectedArbeidsgiver: undefined });
      return;
    }

    this.setState({ selectedArbeidsgiver: selected });
  }

  setFormField(fieldName, fieldValue) {
    const { behandlingFormPrefix, reduxFormChange: formChange } = this.props;
    formChange(`${behandlingFormPrefix}.${'ArbeidsforholdInfoPanel'}`, fieldName, fieldValue);
  }

  initializeActivityForm(arbeidsforhold) {
    const { selectedArbeidsforhold } = this.state;
    if (selectedArbeidsforhold !== arbeidsforhold) {
      const { behandlingFormPrefix, reduxFormInitialize: formInitialize } = this.props;
      formInitialize(`${behandlingFormPrefix}.${PERSON_ARBEIDSFORHOLD_DETAIL_FORM}`, arbeidsforhold);
    }
  }

  updateArbeidsforhold(values) {
    const { selectedArbeidsforhold } = this.state;
    const { arbeidsforhold } = this.props;

    const handlingType = values.arbeidsforholdHandlingField;
    const lagtTilAvSaksbehandler = handlingType === arbeidsforholdHandlingType.LAGT_TIL_AV_SAKSBEHANDLER;

    if (lagtTilAvSaksbehandler) {
      if (!values.kilde.map(k => k.kode).includes(arbeidsforholdKilder.SAKSBEHANDLER)) {
        values.kilde.push({ kode: arbeidsforholdKilder.SAKSBEHANDLER });
      }
    }

    const arbeidsgiverNavn = values.navn;
    let stillingsprosent = 0;
    const perioder = [
      {
        fom: values.fomDato,
        tom: values.tomDato,
      },
    ];

    let newValues = {
      ...values,
      handlingType,
      stillingsprosent,
    };

    if (lagtTilAvSaksbehandler) {
      stillingsprosent = values.stillingsprosent;
      newValues = {
        ...values,
        handlingType,
        arbeidsgiverNavn,
        stillingsprosent,
        perioder,
      };
    }

    const cleanedValues = cleanUpArbeidsforhold(newValues, selectedArbeidsforhold);

    let other = arbeidsforhold.filter(o => o.id !== cleanedValues.id);
    const oldState = arbeidsforhold.find(a => a.id === cleanedValues.id);
    let { fomDato } = cleanedValues;
    if (
      oldState !== undefined &&
      oldState !== null &&
      cleanedValues.erstatterArbeidsforholdId !== oldState.erstatterArbeidsforholdId
    ) {
      if (oldState.erstatterArbeidsforholdId) {
        other = other.map(o => (o.id === oldState.erstatterArbeidsforholdId ? { ...o, erSlettet: false } : o));
      }
      if (cleanedValues.erstatterArbeidsforholdId) {
        other = other.map(o => (o.id === cleanedValues.erstatterArbeidsforholdId ? { ...o, erSlettet: true } : o));
      }
      fomDato = findFomDato(
        cleanedValues,
        arbeidsforhold.find(a => a.id === cleanedValues.erstatterArbeidsforholdId),
      );
    }

    this.setFormField(
      'arbeidsforhold',
      other.concat({
        ...cleanedValues,
        fomDato,
        erEndret: true,
      }),
    );

    this.setSelectedArbeidsforhold(undefined, undefined, selectedArbeidsforhold);
  }

  cancelArbeidsforhold() {
    this.setState({ selectedArbeidsforhold: undefined });
    this.initializeActivityForm({});
  }

  leggTilArbeidsforhold() {
    const lagtTilArbeidsforhold = {
      id: `${new Date().getTime()}_${Math.floor(Math.random() * 1000000000)}`,
      arbeidsgiverNavn: undefined,
      arbeidsgiver: {
        arbeidsgiverOrgnr: undefined,
        arbeidsgiverAktørId: undefined,
      },
      kilde: [
        {
          kode: arbeidsforholdKilder.SAKSBEHANDLER,
          kodeverk: 'ARBEIDSFORHOLD_KILDE',
        },
      ],
      arbeidsforhold: {
        internArbeidsforholdId: undefined,
        eksternArbeidsforholdId: undefined,
      },
      yrkestittel: undefined,
      begrunnelse: undefined,
      perioder: [
        {
          fom: undefined,
          tom: undefined,
        },
      ],
      handlingType: undefined,
      permisjoner: [
        {
          permisjonFom: undefined,
          permisjonTom: undefined,
        },
      ],
      stillingsprosent: undefined,
      aksjonspunktÅrsaker: [],
      inntektsmeldinger: [],
    };
    this.setState({ selectedArbeidsforhold: lagtTilArbeidsforhold });
    this.initializeActivityForm(lagtTilArbeidsforhold);
  }

  render() {
    const {
      intl,
      arbeidsgiverOpplysningerPerId,
      arbeidsforhold,
      alleMerknaderFraBeslutter,
      alleKodeverk,
      behandlingId,
      behandlingVersjon,
    } = this.props;

    const { selectedArbeidsforhold, selectedArbeidsgiver } = this.state;
    const unikeArbeidsgivere = [...new Set(arbeidsforhold.map(af => af.arbeidsgiver.arbeidsgiverOrgnr))];

    return (
      <>
        <FaktaGruppe merknaderFraBeslutter={alleMerknaderFraBeslutter[aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD]}>
          {unikeArbeidsgivere.map(a => {
            const arbeidsforholdPerArbeidsgiver = (arbeidsforhold || []).filter(
              af => af.arbeidsgiver.arbeidsgiverOrgnr === a,
            );

            const arbeidsgiverNavn =
              arbeidsgiverOpplysningerPerId && arbeidsgiverOpplysningerPerId[a]
                ? arbeidsgiverOpplysningerPerId[a].navn
                : a;
            const navn = `${arbeidsgiverNavn} (${arbeidsforholdPerArbeidsgiver.length} arbeidsforhold)`;
            const erValgt = selectedArbeidsgiver === a;

            return (
              <>
                <FlexRow key={a}>
                  <FlexColumn className={styles.arbeidsgiverColumn}>
                    <div className={styles.overskrift}>
                      <Image src={briefcaseImg} />
                      <Normaltekst>{navn}</Normaltekst>
                    </div>
                  </FlexColumn>
                  <FlexColumn className={styles.aksjonspunktColumn}>
                    {harAksjonspunkter(arbeidsforholdPerArbeidsgiver) && <Image src={advarselImageUrl} alt="" />}
                    <button
                      className={styles.knappContainer}
                      type="button"
                      onClick={() => this.setSelectedArbeidsgiver(a)}
                    >
                      <Normaltekst className={styles.visLukkArbeidsforhold}>
                        {intl.formatMessage(
                          erValgt
                            ? {
                                id: 'PersonArbeidsforholdPanel.LukkArbeidsforhold',
                              }
                            : {
                                id: 'PersonArbeidsforholdPanel.VisArbeidsforhold',
                              },
                        )}
                      </Normaltekst>
                      <Image className={erValgt ? styles.chevronOpp : styles.chevronNed} src={chevronIkonUrl} alt="" />
                    </button>
                  </FlexColumn>
                </FlexRow>
                {erValgt && (
                  <PersonArbeidsforholdTable
                    key={a}
                    selectedId={selectedArbeidsforhold ? selectedArbeidsforhold.id : undefined}
                    alleArbeidsforhold={arbeidsforholdPerArbeidsgiver}
                    alleKodeverk={alleKodeverk}
                    behandlingId={behandlingId}
                    behandlingVersjon={behandlingVersjon}
                    updateArbeidsforhold={this.updateArbeidsforhold}
                  />
                )}
              </>
            );
          })}
        </FaktaGruppe>
        <VerticalSpacer twentyPx />
      </>
    );
  }
}

const FORM_NAVN = 'ArbeidsforholdInfoPanel';

const mapStateToProps = (state: any, ownProps: PureOwnProps): MappedOwnProps => {
  const arbeidsforhold = behandlingFormValueSelector(
    FORM_NAVN,
    ownProps.behandlingId,
    ownProps.behandlingVersjon,
  )(state, 'arbeidsforhold');
  return {
    arbeidsforhold,
    arbeidsgiverOpplysningerPerId: ownProps.arbeidsgiverOpplysningerPerId,
    behandlingFormPrefix: getBehandlingFormPrefix(ownProps.behandlingId, ownProps.behandlingVersjon),
  };
};
const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators(
    {
      reduxFormChange,
      reduxFormInitialize,
    },
    dispatch,
  ),
});
const PersonArbeidsforholdPanel = connect(mapStateToProps, mapDispatchToProps)(PersonArbeidsforholdPanelImpl);

export default PersonArbeidsforholdPanel;

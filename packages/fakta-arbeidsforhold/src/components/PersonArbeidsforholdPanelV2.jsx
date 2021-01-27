import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { injectIntl } from 'react-intl';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import chevronIkonUrl from '@fpsak-frontend/assets/images/pil_ned.svg';
import briefcaseImg from '@fpsak-frontend/assets/images/briefcase.svg';
import { getBehandlingFormPrefix, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { VerticalSpacer, FaktaGruppe, TableColumn, Image, FlexRow } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Normaltekst } from 'nav-frontend-typografi';
import advarselImageUrl from '@fpsak-frontend/assets/images/advarsel2.svg';
import { arbeidsforholdV2PropType } from '@fpsak-frontend/prop-types/src/arbeidsforholdPropType';
import arbeidsforholdHandlingType from '@fpsak-frontend/kodeverk/src/arbeidsforholdHandlingType';
import arbeidsforholdKilder from '../kodeverk/arbeidsforholdKilder';
import PersonArbeidsforholdTableV2 from './arbeidsforholdTabell/PersonArbeidsforholdTableV2';
import { PERSON_ARBEIDSFORHOLD_DETAIL_FORM_V2 } from './arbeidsforholdDetaljer/PersonArbeidsforholdDetailFormV2';

import styles from './personArbeidsforholdPanel.less';

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

/**
 * PersonArbeidsforholdPanelImpl:
 * - Håndterer staten for children-components.
 * - Bygger initialValues til children-components ved hjelp av arbeidsforhold PropType. Verdiene
 * som har samme navn i GUI og PropTypen blir fylt inn 'automatisk', mens andre variabler som
 * ikke er med i PropTypen må håndteres f.eks. i UpdateArbeidsforhold metoden.
 */
export class PersonArbeidsforholdPanelImplV2 extends Component {
  constructor() {
    super();
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

    if (selectedArbeidsgiver && selectedArbeidsgiver.id === selected.id) {
      this.setState({ selectedArbeidsgiver: undefined });
      return;
    }

    this.setState({ selectedArbeidsgiver: selected });
  }

  setFormField(fieldName, fieldValue) {
    const { behandlingFormPrefix, reduxFormChange: formChange } = this.props;
    formChange(`${behandlingFormPrefix}.${'ArbeidsforholdInfoPanelV2'}`, fieldName, fieldValue);
  }

  initializeActivityForm(arbeidsforhold) {
    const { selectedArbeidsforhold } = this.state;
    if (selectedArbeidsforhold !== arbeidsforhold) {
      const { behandlingFormPrefix, reduxFormInitialize: formInitialize } = this.props;
      formInitialize(`${behandlingFormPrefix}.${PERSON_ARBEIDSFORHOLD_DETAIL_FORM_V2}`, arbeidsforhold);
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
                  <TableColumn className={styles.arbeidsgiverColumn}>
                    <div className={styles.overskrift}>
                      <Image src={briefcaseImg} />
                      <Normaltekst>{navn}</Normaltekst>
                    </div>
                  </TableColumn>
                  <TableColumn className={styles.aksjonspunktColumn}>
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
                  </TableColumn>
                </FlexRow>
                {erValgt && (
                  <PersonArbeidsforholdTableV2
                    src={chevronIkonUrl}
                    selectedId={selectedArbeidsforhold ? selectedArbeidsforhold.id : undefined}
                    alleArbeidsforhold={arbeidsforholdPerArbeidsgiver}
                    hasArbeidsforholdAksjonspunkt={harAksjonspunkter}
                    alleKodeverk={alleKodeverk}
                    behandlingId={behandlingId}
                    behandlingVersjon={behandlingVersjon}
                    updateArbeidsforhold={this.updateArbeidsforhold}
                    cancelArbeidsforhold={this.cancelArbeidsforhold}
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

PersonArbeidsforholdPanelImplV2.propTypes = {
  intl: PropTypes.shape().isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  arbeidsforhold: PropTypes.arrayOf(arbeidsforholdV2PropType).isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
};
const FORM_NAVN = 'ArbeidsforholdInfoPanelV2';
const mapStateToProps = (state, ownProps) => {
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
const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      reduxFormChange,
      reduxFormInitialize,
    },
    dispatch,
  ),
});
const PersonArbeidsforholdPanelV2 = connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectIntl(PersonArbeidsforholdPanelImplV2));
PersonArbeidsforholdPanelV2.buildInitialValues = arbeidsforhold => ({
  arbeidsforhold,
});

PersonArbeidsforholdPanelV2.isReadOnly = (state, behandlingId, behandlingVersjon) => {
  const arbeidsforhold = behandlingFormValueSelector(
    'ArbeidsforholdInfoPanelV2',
    behandlingId,
    behandlingVersjon,
  )(state, 'arbeidsforhold');
  return !arbeidsforhold;
};

export default PersonArbeidsforholdPanelV2;

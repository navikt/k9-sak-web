import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { injectIntl } from 'react-intl';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import chevronIkonUrl from '@fpsak-frontend/assets/images/pil_ned.svg';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import briefcaseImg from '@fpsak-frontend/assets/images/briefcase.svg';
import { ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import { getBehandlingFormPrefix, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { VerticalSpacer, FaktaGruppe, TableColumn, Image, FlexRow } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Normaltekst } from 'nav-frontend-typografi';
import advarselImageUrl from '@fpsak-frontend/assets/images/advarsel2.svg';
import { arbeidsforholdV2PropType, arbeidsgiverPropType } from '@fpsak-frontend/prop-types/src/arbeidsforholdPropType';
import arbeidsforholdHandlingType from '@fpsak-frontend/kodeverk/src/arbeidsforholdHandlingType';
import arbeidsforholdKilder from '../kodeverk/arbeidsforholdKilder';
import PersonArbeidsforholdTable from './arbeidsforholdTabell/PersonArbeidsforholdTable';
import { PERSON_ARBEIDSFORHOLD_DETAIL_FORM } from './arbeidsforholdDetaljer/PersonArbeidsforholdDetailForm';

import styles from './personArbeidsforholdPanel.less';
import aktivtArbeidsforholdHandling from '../kodeverk/aktivtArbeidsforholdHandling';
import arbeidsforholdHandling from '../kodeverk/arbeidsforholdHandling';

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

export const sortArbeidsforhold = arbeidsforhold =>
  arbeidsforhold.sort((a1, a2) => {
    const i = a1.navn.localeCompare(a2.navn);
    if (i !== 0) {
      return i;
    }

    if (a1.mottattDatoInntektsmelding && a2.mottattDatoInntektsmelding) {
      return moment(a2.mottattDatoInntektsmelding, ISO_DATE_FORMAT).diff(
        moment(a1.mottattDatoInntektsmelding, ISO_DATE_FORMAT),
      );
    }
    if (a1.mottattDatoInntektsmelding) {
      return -1;
    }
    if (a2.mottattDatoInntektsmelding) {
      return 1;
    }
    return a1.id.localeCompare(a2.id);
  });

export const erDetTillattMedFortsettingAvAktivtArbeidsforholdUtenIM = arbeidsforhold => {
  let isAllowed = true;
  const arbeidsforholdUtenInntektsmeldingTilVurdering = arbeidsforhold.filter(
    a => (a.tilVurdering || a.erEndret) && !a.mottattDatoInntektsmelding,
  );
  arbeidsforholdUtenInntektsmeldingTilVurdering.forEach(a => {
    const arbeidsforholdFraSammeArbeidsgiverMedInntekstmelding = arbeidsforhold.filter(
      b => a.id !== b.id && a.arbeidsgiverIdentifikator === b.arbeidsgiverIdentifikator && b.mottattDatoInntektsmelding,
    );
    if (arbeidsforholdFraSammeArbeidsgiverMedInntekstmelding.length > 0) {
      isAllowed = false;
    }
  });
  return isAllowed;
};

export const harAksjonspunkter = arbeidsforhold => {
  return arbeidsforhold.filter(af => af.aksjonspunktÅrsaker.length > 0).length > 0;
};

/**
 * PersonArbeidsforholdPanelImpl:
 * - Håndterer staten for children-components.
 * - Bygger initialValues til children-components ved hjelp av arbeidsforhold PropType. Verdiene
 * som har samme navn i GUI og PropTypen blir fylt inn 'automatisk', mens andre variabler som
 * ikke er med i PropTypen må håndteres f.eks. i UpdateArbeidsforhold metoden.
 */
export class PersonArbeidsforholdPanelImpl extends Component {
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

    if (selectedArbeidsgiver === undefined) {
      this.setState({ selectedArbeidsgiver: selected });
    }
    if (selectedArbeidsgiver.id === selected.id) {
      this.setState({ selectedArbeidsgiver: undefined });
    }
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

    const brukArbeidsforholdet = values.arbeidsforholdHandlingField === arbeidsforholdHandlingType.BRUK;

    const fortsettBehandlingUtenInntektsmelding =
      values.arbeidsforholdHandlingField === arbeidsforholdHandlingType.BRUK_UTEN_INNTEKTSMELDING;

    const inntektMedTilBeregningsgrunnlag =
      values.aktivtArbeidsforholdHandlingField === arbeidsforholdHandlingType.INNTEKT_IKKE_MED_I_BG ? false : undefined;

    const newValues = {
      ...values,
      brukArbeidsforholdet,
      fortsettBehandlingUtenInntektsmelding,
      inntektMedTilBeregningsgrunnlag,
    };

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

    this.setSelectedArbeidsforhold(undefined, undefined, other);
  }

  cancelArbeidsforhold() {
    this.setState({ selectedArbeidsforhold: undefined });
    this.initializeActivityForm({});
  }

  leggTilArbeidsforhold() {
    const lagtTilArbeidsforhold = {
      id: `${new Date().getTime()}_${Math.floor(Math.random() * 1000000000)}`,
      navn: undefined,
      arbeidsgiverIdentifikator: undefined,
      arbeidsgiverIdentifiktorGUI: undefined,
      arbeidsforholdId: undefined,
      fomDato: undefined,
      tomDato: undefined,
      kilde: {
        kode: arbeidsforholdKilder.SAKSBEHANDLER,
      },
      mottattDatoInntektsmelding: undefined,
      begrunnelse: undefined,
      stillingsprosent: undefined,
      brukArbeidsforholdet: true,
      fortsettBehandlingUtenInntektsmelding: undefined,
      erNyttArbeidsforhold: undefined,
      erSlettet: undefined,
      erstatterArbeidsforholdId: undefined,
      harErsattetEttEllerFlere: undefined,
      ikkeRegistrertIAaRegister: undefined,
      tilVurdering: true,
      vurderOmSkalErstattes: undefined,
      erEndret: undefined,
      overstyrtTom: undefined,
      brukMedJustertPeriode: false,
      lagtTilAvSaksbehandler: true,
      inntektMedTilBeregningsgrunnlag: true,
      arbeidsforholdHandlingField: arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD,
      aktivtArbeidsforholdHandlingField: aktivtArbeidsforholdHandling.BENYTT_A_INNTEKT_I_BG,
    };
    this.setState({ selectedArbeidsforhold: lagtTilArbeidsforhold });
    this.initializeActivityForm(lagtTilArbeidsforhold);
  }

  render() {
    const {
      intl,
      arbeidsgivere,
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
            const arbeidsforholdPerArbeidsgiver = arbeidsforhold.filter(af => af.arbeidsgiver.arbeidsgiverOrgnr === a);

            const navn = `${arbeidsgivere[a].navn} (${arbeidsforholdPerArbeidsgiver.length} arbeidsforhold)`;

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
                          selectedArbeidsgiver === a
                            ? {
                                id: 'PersonArbeidsforholdPanel.LukkArbeidsforhold',
                              }
                            : {
                                id: 'PersonArbeidsforholdPanel.VisArbeidsforhold',
                              },
                        )}
                      </Normaltekst>
                      <Image
                        className={selectedArbeidsgiver === a ? styles.chevronOpp : styles.chevronNed}
                        src={chevronIkonUrl}
                        alt=""
                      />
                    </button>
                  </TableColumn>
                </FlexRow>
                {selectedArbeidsgiver === a && (
                  <PersonArbeidsforholdTable
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

PersonArbeidsforholdPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  arbeidsgivere: PropTypes.arrayOf(arbeidsgiverPropType).isRequired,
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
const FORM_NAVN = 'ArbeidsforholdInfoPanel';
const mapStateToProps = (state, ownProps) => {
  const arbeidsforhold = behandlingFormValueSelector(
    FORM_NAVN,
    ownProps.behandlingId,
    ownProps.behandlingVersjon,
  )(state, 'arbeidsforhold');
  const sorterteArbeidsforhold = sortArbeidsforhold(arbeidsforhold);
  return {
    arbeidsforhold: sorterteArbeidsforhold,
    arbeidsgivere: ownProps.arbeidsgivere,
    behandlingFormPrefix: getBehandlingFormPrefix(ownProps.behandlingId, ownProps.behandlingVersjon),
    aktivtArbeidsforholdTillatUtenIM: erDetTillattMedFortsettingAvAktivtArbeidsforholdUtenIM(sorterteArbeidsforhold),
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
const PersonArbeidsforholdPanel = connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectIntl(PersonArbeidsforholdPanelImpl));
PersonArbeidsforholdPanel.buildInitialValues = arbeidsforhold => ({
  arbeidsforhold,
});
PersonArbeidsforholdPanel.isReadOnly = (state, behandlingId, behandlingVersjon) => {
  const isDetailFormOpen = !!behandlingFormValueSelector(
    PERSON_ARBEIDSFORHOLD_DETAIL_FORM,
    behandlingId,
    behandlingVersjon,
  )(state, 'navn');
  if (isDetailFormOpen) {
    return true;
  }
  const arbeidsforhold = behandlingFormValueSelector(
    'ArbeidsforholdInfoPanel',
    behandlingId,
    behandlingVersjon,
  )(state, 'arbeidsforhold');
  return !arbeidsforhold;
};
export default injectIntl(PersonArbeidsforholdPanel);

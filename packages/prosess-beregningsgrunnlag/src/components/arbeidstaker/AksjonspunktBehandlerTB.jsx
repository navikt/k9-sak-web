import React from 'react';
import PropTypes from 'prop-types';

import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  dateFormat,
  formatCurrencyNoKr,
  parseCurrencyInput,
  removeSpacesFromNumber,
  required,
  getKodeverknavnFn,
} from '@fpsak-frontend/utils';

import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import { connect } from 'react-redux';
import avklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';
import { createSelector } from 'reselect';
import { isAvklaringsbehovOpen } from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovStatus';
import { InputField, behandlingFormValueSelector } from '@fpsak-frontend/form';

import createVisningsnavnForAktivitet from '../../util/createVisningsnavnForAktivitet';
import styles from '../fellesPaneler/aksjonspunktBehandler.less';

import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag.less';

const formPrefix = 'inntektField';

const { FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD } = avklaringsbehovCodes;

const finnAvklaringsbehovForFastsettBgTidsbegrensetAT = avklaringsbehov =>
  avklaringsbehov &&
  avklaringsbehov.find(ab => ab.definisjon === FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD);

const harPeriodeArbeidsforholdAvsluttet = periode =>
  periode.periodeAarsaker !== null &&
  periode.periodeAarsaker.includes(periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET);

// Finner sammenslått periode etter opphør av tidsbegrenset arbeid
const finnPeriodeEtterOpphørAvTidsbegrensetArbeid = allePerioder => {
  let k = 0;
  while (k < allePerioder.length && !harPeriodeArbeidsforholdAvsluttet(allePerioder[k])) {
    k += 1;
  }
  const periodeUtenKortvarigArbeid = { ...allePerioder[k] };
  periodeUtenKortvarigArbeid.beregningsgrunnlagPeriodeTom =
    allePerioder[allePerioder.length - 1].beregningsgrunnlagPeriodeTom;
  return periodeUtenKortvarigArbeid;
};
// Nøkkelen til et inputfield konstrueres utifra navnet på andelen og perioden den er i samt en fast prefix
export const createInputFieldKey = (andel, periode) => {
  if (!andel.arbeidsforhold) {
    return undefined;
  }
  return `${formPrefix}_${andel.arbeidsforhold.arbeidsgiverIdent}_${andel.andelsnr}_${periode.beregningsgrunnlagPeriodeFom}`;
};
// Lager en liste med FormattedMessages som skal brukes som overskrifter i tabellen

const findArbeidstakerAndeler = periode =>
  periode.beregningsgrunnlagPrStatusOgAndel.filter(
    andel => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER && !andel.erTilkommetAndel,
  );

const createArbeidsforholdMapKey = arbeidsforhold =>
  `${arbeidsforhold.arbeidsgiverIdent}${arbeidsforhold && arbeidsforhold.arbeidsforholdId ? arbeidsforhold.arbeidsforholdId : ''
  }`;

// Finner beregnetPrAar for alle andeler, basert på data fra den første perioden
const createBeregnetInntektForAlleAndeler = periode => {
  const mapMedInnteker = {};
  const arbeidstakerAndeler = periode.beregningsgrunnlagPrStatusOgAndel.filter(
    andel => andel.aktivitetStatus === aktivitetStatus.ARBEIDSTAKER && !andel.erTilkommetAndel,
  );
  arbeidstakerAndeler.forEach(andel => {
    mapMedInnteker[createArbeidsforholdMapKey(andel.arbeidsforhold)] = formatCurrencyNoKr(andel.beregnetPrAar);
  });
  return mapMedInnteker;
};

// Dette er objektet hver key i mappen vil ha en liste med
const createMapValueObject = () => ({
  erTidsbegrenset: true,
  isEditable: false,
  tabellInnhold: '',
  inputfieldKey: '',
});

const lagVisningsnavnForAktivitet = (arbeidsforhold, getKodeverknavn, arbeidsgiverOpplysningerPerId) => {
  const arbeidsforholdInfo = arbeidsgiverOpplysningerPerId[arbeidsforhold.arbeidsgiverIdent];
  if (!arbeidsforholdInfo) {
    return arbeidsforhold.arbeidsforholdType ? getKodeverknavn(arbeidsforhold.arbeidsforholdType) : '';
  }
  return createVisningsnavnForAktivitet(arbeidsforholdInfo, arbeidsforhold.eksternArbeidsforholdId);
};

// Initialiserer arbeidsforholdet mappet med data som skal vises uansett hva slags data vi har.
// Dette innebærer at første kolonne i raden skal inneholde andelsnavn og andre kolonne skal inneholde beregnetPrAar.
// Vi antar at alle andeler ligger i alle perioder
const initializeMap = (periode, getKodeverknavn, arbeidsgiverOpplysningerPerId) => {
  const inntektMap = createBeregnetInntektForAlleAndeler(periode);
  const alleAndeler = findArbeidstakerAndeler(periode);
  const mapMedAndeler = {};
  alleAndeler.forEach(andel => {
    // Første kolonne er arbeidsgivernavn og orgnr
    const andelMapNavn = createArbeidsforholdMapKey(andel.arbeidsforhold);
    const mapValueMedAndelNavn = createMapValueObject();
    mapValueMedAndelNavn.tabellInnhold = lagVisningsnavnForAktivitet(
      andel.arbeidsforhold,
      getKodeverknavn,
      arbeidsgiverOpplysningerPerId,
    );
    mapValueMedAndelNavn.erTidsbegrenset =
      andel.erTidsbegrensetArbeidsforhold !== undefined ? andel.erTidsbegrensetArbeidsforhold : false;
    mapMedAndeler[andelMapNavn] = [mapValueMedAndelNavn];

    // Andre kolonne er read-only visning av grunnlag
    const mapValueMedBeregnetForstePeriode = createMapValueObject();
    mapValueMedBeregnetForstePeriode.erTidsbegrenset = false;
    mapValueMedBeregnetForstePeriode.tabellInnhold = inntektMap[andelMapNavn];
    mapMedAndeler[andelMapNavn].push(mapValueMedBeregnetForstePeriode);
  });
  return mapMedAndeler;
};

export const createTableData = createSelector(
  [
    (state, ownProps) => ownProps.allePerioder,
    (state, ownProps) => ownProps.alleKodeverk,
    (state, ownProps) => ownProps.arbeidsgiverOpplysningerPerId,
  ],
  (allePerioder, alleKodeverk, arbeidsgiverOpplysningerPerId) => {
    const relevantPeriode = finnPeriodeEtterOpphørAvTidsbegrensetArbeid(allePerioder);
    const kopiAvPeriode = { ...relevantPeriode };
    const arbeidsforholdPeriodeMap = initializeMap(
      allePerioder[0],
      getKodeverknavnFn(alleKodeverk, kodeverkTyper),
      arbeidsgiverOpplysningerPerId,
    );
    // Oppretter element for redigerbar periode
    const arbeidstakerAndeler = findArbeidstakerAndeler(kopiAvPeriode);
    arbeidstakerAndeler.forEach(andel => {
      const mapKey = createArbeidsforholdMapKey(andel.arbeidsforhold);
      const newMapValue = createMapValueObject();
      newMapValue.tabellInnhold =
        andel.overstyrtPrAar !== undefined && andel.overstyrtPrAar !== null
          ? formatCurrencyNoKr(andel.overstyrtPrAar)
          : '';
      newMapValue.erTidsbegrenset = false;
      newMapValue.isEditable = true;
      newMapValue.inputfieldKey = createInputFieldKey(andel, kopiAvPeriode);
      arbeidsforholdPeriodeMap[mapKey].push(newMapValue);
    });
    return arbeidsforholdPeriodeMap;
  },
);

const createSummaryTableRow = listOfBruttoPrPeriode => (
  <tr id="bruttoPrPeriodeRad" key="bruttoPrPeriodeRad">
    <td key="bruttoTittel" colSpan="2">
      <Normaltekst>
        <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.AksjonspunktBehandlerTB.SumPeriode" />
      </Normaltekst>
    </td>
    {listOfBruttoPrPeriode.map(element => (
      <td key={element.periode} colSpan="2">
        <Normaltekst className={beregningStyles.semiBoldText}>{formatCurrencyNoKr(element.brutto)}</Normaltekst>
      </td>
    ))}
  </tr>
);

const createPerioderRow = relevantePerioder => (
  <tr key="PeriodeHeaderRad">
    <td colSpan="2" />
    {relevantePerioder.map(element => {
      const fraDato = element.periodeFom;
      return (
        <td key={`periodeittel${fraDato}`} colSpan="2">
          <Undertekst>{dateFormat(fraDato)}</Undertekst>
        </td>
      );
    })}
    <td />
  </tr>
);
const createRows = (tableData, readOnly, isAvklaringsbehovClosed, perioder, fieldArrayID) => {
  const rows = [];
  rows.push(createPerioderRow(perioder));
  rows.push(
    <tr key="Tabletop">
      <td key="ombergenetAarBlank" colSpan="2" />
      {perioder.map((element, index) => (
        <React.Fragment key={`PeriodeWrapper${index + 1}`}>
          <td key={`Col_Tittel_${element.periodeFom}`} colSpan="2">
            <Undertekst>
              <FormattedMessage
                id="Beregningsgrunnlag.AarsinntektPanel.AksjonspunktBehandler.OmberegnetAar"
                key={`Tittel_${element.periodeFom}`}
              />
            </Undertekst>
          </td>
        </React.Fragment>
      ))}
    </tr>,
  );

  Object.keys(tableData).forEach(val => {
    const list = tableData[val];
    rows.push(
      <tr key={val}>
        {list.map(element => {
          if (!element.isEditable) {
            return (
              <td key={element.tabellInnhold} colSpan="2">
                <Normaltekst>{element.tabellInnhold}</Normaltekst>
              </td>
            );
          }
          return (
            <React.Fragment key={`ElementWrapper${element.inputfieldKey}`}>
              <td key={`Col-${fieldArrayID}.${element.inputfieldKey}`} colSpan="2">
                <div className={isAvklaringsbehovClosed && readOnly ? styles.adjustedField : undefined}>
                  <InputField
                    name={`${fieldArrayID}.${element.inputfieldKey}`}
                    validate={[required]}
                    readOnly={readOnly}
                    parse={parseCurrencyInput}
                    bredde="S"
                  />
                </div>
              </td>
            </React.Fragment>
          );
        })}
      </tr>,
    );
  });

  rows.push(
    <tr key="sdeparator" className={styles.rowSpacer}>
      <td />
    </tr>,
  );
  rows.push(createSummaryTableRow(perioder));

  return rows;
};

export const AksjonspunktBehandlerTidsbegrensetImpl = ({
  readOnly,
  tableData,
  isAvklaringsbehovClosed,
  bruttoPrPeriodeList,
  fieldArrayID,
}) => (
  <table className={styles.inntektTableTB}>
    <tbody>{createRows(tableData, readOnly, isAvklaringsbehovClosed, bruttoPrPeriodeList, fieldArrayID)}</tbody>
  </table >
);

AksjonspunktBehandlerTidsbegrensetImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  tableData: PropTypes.shape().isRequired,
  isAvklaringsbehovClosed: PropTypes.bool,
  bruttoPrPeriodeList: PropTypes.arrayOf(PropTypes.shape()),
  fieldArrayID: PropTypes.string.isRequired,
};

AksjonspunktBehandlerTidsbegrensetImpl.defaultProps = {
  isAvklaringsbehovClosed: false,
  bruttoPrPeriodeList: undefined,
};

export const getIsAvklaringsbehovClosed = createSelector(
  [(state, ownProps) => ownProps.avklaringsbehov],
  avklaringsbehov => {
    const avklaringsbehovTB = finnAvklaringsbehovForFastsettBgTidsbegrensetAT(avklaringsbehov);
    return avklaringsbehovTB ? !isAvklaringsbehovOpen(avklaringsbehovTB.status) : false;
  },
);

const lagSummeringsdataForFørstePeriode = allePerioder => {
  const forstePeriodeATInntekt = allePerioder[0].beregningsgrunnlagPrStatusOgAndel
    .filter(andel => andel.aktivitetStatus === aktivitetStatus.ARBEIDSTAKER && !andel.erTilkommetAndel)
    .map(andel => andel.beregnetPrAar);
  const forstePeriodeInntekt = forstePeriodeATInntekt.reduce((a, b) => a + b);
  return {
    brutto: forstePeriodeInntekt,
    periodeFom: allePerioder[0].beregningsgrunnlagPeriodeFom,
    periodeTom: allePerioder[0].beregningsgrunnlagPeriodeTom,
  };
};

const mapDataFraStateTilPeriodeliste = (
  state,
  allePerioder,
  behandlingId,
  behandlingVersjon,
  formName,
  fieldArrayID,
) => {
  // Liste som inneholder sum av bg pr periode og fra-til dato. Brukes til å sette opp antall perioder som vises og visning av summeringsrad.
  // Består alltid av to elementer
  const bruttoPrPeriodeList = [];
  const relevantPeriode = finnPeriodeEtterOpphørAvTidsbegrensetArbeid(allePerioder);
  bruttoPrPeriodeList.push(lagSummeringsdataForFørstePeriode(allePerioder));
  const arbeidstakerAndeler = relevantPeriode.beregningsgrunnlagPrStatusOgAndel.filter(
    andel => andel.aktivitetStatus === aktivitetStatus.ARBEIDSTAKER && !andel.erTilkommetAndel,
  );
  const bruttoPrAndelForPeriode = arbeidstakerAndeler.map(andel => {
    const inputFieldKey = createInputFieldKey(andel, relevantPeriode);
    const fastsattInntekt = behandlingFormValueSelector(
      formName,
      behandlingId,
      behandlingVersjon,
    )(state, [`${fieldArrayID}.${inputFieldKey}`]);
    return fastsattInntekt === undefined || fastsattInntekt === '' ? 0 : removeSpacesFromNumber(fastsattInntekt);
  });
  const samletBruttoForPeriode = bruttoPrAndelForPeriode.reduce((a, b) => a + b);
  bruttoPrPeriodeList.push({
    brutto: samletBruttoForPeriode,
    periodeFom: relevantPeriode.beregningsgrunnlagPeriodeFom,
    periodeTom: relevantPeriode.beregningsgrunnlagPeriodeTom,
  });
  return bruttoPrPeriodeList;
};

const mapStateToProps = (state, ownProps) => {
  const { allePerioder, behandlingId, behandlingVersjon, formName, fieldArrayID } = ownProps;
  return {
    tableData: createTableData(state, ownProps),
    isAvklaringsbehovClosed: getIsAvklaringsbehovClosed(state, ownProps),
    bruttoPrPeriodeList: mapDataFraStateTilPeriodeliste(
      state,
      allePerioder,
      behandlingId,
      behandlingVersjon,
      formName,
      fieldArrayID,
    ),
    fieldArrayID,
  };
};

const AksjonspunktBehandlerTidsbegrenset = connect(mapStateToProps)(AksjonspunktBehandlerTidsbegrensetImpl);

AksjonspunktBehandlerTidsbegrenset.buildInitialValues = (allePerioder, avklaringsbehov) => {
  if (finnAvklaringsbehovForFastsettBgTidsbegrensetAT(avklaringsbehov) === undefined) {
    return {};
  }
  const initialValues = {};
  const relevantPeriode = finnPeriodeEtterOpphørAvTidsbegrensetArbeid(allePerioder);
  const arbeidstakerAndeler = relevantPeriode.beregningsgrunnlagPrStatusOgAndel.filter(
    andel => andel.aktivitetStatus === aktivitetStatus.ARBEIDSTAKER && !andel.erTilkommetAndel,
  );
  arbeidstakerAndeler.forEach(andel => {
    initialValues[createInputFieldKey(andel, relevantPeriode)] =
      andel.overstyrtPrAar !== undefined ? formatCurrencyNoKr(andel.overstyrtPrAar) : '';
  });
  return initialValues;
};

const lagListeForArbeidstakerandeler = (values, perioder) => {
  const relevantPeriode = finnPeriodeEtterOpphørAvTidsbegrensetArbeid(perioder);
  const arbeidstakerAndeler = relevantPeriode.beregningsgrunnlagPrStatusOgAndel.filter(
    andel => andel.aktivitetStatus === aktivitetStatus.ARBEIDSTAKER && !andel.erTilkommetAndel,
  );
  const fastsatteTidsbegrensedeAndeler = [];
  arbeidstakerAndeler.forEach(andel => {
    const overstyrtInntekt = removeSpacesFromNumber(values[createInputFieldKey(andel, relevantPeriode)]);
    fastsatteTidsbegrensedeAndeler.push({
      andelsnr: andel.andelsnr,
      bruttoFastsattInntekt: overstyrtInntekt,
    });
  });
  return [
    {
      periodeFom: relevantPeriode.beregningsgrunnlagPeriodeFom,
      periodeTom: relevantPeriode.beregningsgrunnlagPeriodeTom,
      fastsatteTidsbegrensedeAndeler,
    },
  ];
};

AksjonspunktBehandlerTidsbegrenset.transformValues = (values, allePerioder) => ({
  kode: FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
  begrunnelse: values.ATFLVurdering,
  fastsatteTidsbegrensedePerioder: lagListeForArbeidstakerandeler(values, allePerioder),
  // Virker kanskje litt rart at frilans settes her, men dette er egentlig ikkje eit reint arbeidstakeraksjonspunkt
  frilansInntekt: values.inntektFrilanser !== undefined ? removeSpacesFromNumber(values.inntektFrilanser) : null,
});

export default injectIntl(AksjonspunktBehandlerTidsbegrenset);

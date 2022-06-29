import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import { connect } from 'react-redux';
import moment from 'moment';
import { createSelector } from 'reselect';
import aktivitetStatus, { isStatusDagpenger } from '@fpsak-frontend/kodeverk/src/aktivitetStatus';

import { DDMMYYYY_DATE_FORMAT, formatCurrencyNoKr, removeSpacesFromNumber } from '@fpsak-frontend/utils';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';
import dekningsgradKode from '@fpsak-frontend/kodeverk/src/dekningsgrad';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import beregningsgrunnlagVilkarPropType from '../../propTypes/beregningsgrunnlagVilkarPropType';
import { andelErIkkeTilkommetEllerLagtTilAvSBH } from '../arbeidstaker/GrunnlagForAarsinntektPanelAT';
import BeregningsresutatPanel from './BeregningsResultatPanel';

const VIRKEDAGER_PR_AAR = 260;

const periodeHarAarsakSomTilsierVisning = aarsaker => {
  if (aarsaker.length < 1) {
    return true;
  }
  const aarsakerSomTilsierMuligEndringIDagsats = [
    periodeAarsak.NATURALYTELSE_BORTFALT,
    periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET,
    periodeAarsak.NATURALYTELSE_TILKOMMER,
  ];
  return aarsaker.filter(aarsak => aarsakerSomTilsierMuligEndringIDagsats.indexOf(aarsak) !== -1).length > 0;
};
const setTekstStrengKeyPavilkaarUtfallType = (skalFastsetteGrunnlag) => {
  if (skalFastsetteGrunnlag) {
    return 'Fastsatt';
  }
  return 'Omberegnet';
};

const harOppfyltVilkårOgSkjønnsvurdertMinstEnAndel = (vilkarStatus, andeler) => {
  if (!vilkarStatus) return false;
  if (vilkarStatus === vilkarUtfallType.IKKE_OPPFYLT) {
    return false;
  }
  if (vilkarStatus === vilkarUtfallType.IKKE_VURDERT) {
    return false;
  }
  if (vilkarStatus === vilkarUtfallType.OPPFYLT) {
    const harOverstyrt = andeler.some(andel => andel.erOverstyrt === true);
    if (harOverstyrt) {
      return true;
    }
  }
  return false;
};
const hentAndelFraPeriode = (periode, andelType) => {
  if (andelType === aktivitetStatus.ARBEIDSTAKER) {
    return periode.beregningsgrunnlagPrStatusOgAndel
      .filter(andel => andel.aktivitetStatus === aktivitetStatus.ARBEIDSTAKER)
      .filter(andel => andelErIkkeTilkommetEllerLagtTilAvSBH(andel));
  }
  if (isStatusDagpenger(andelType)) {
    return periode.beregningsgrunnlagPrStatusOgAndel
      .find(andel => isStatusDagpenger(andel.aktivitetStatus));
  }
  return periode.beregningsgrunnlagPrStatusOgAndel.find(andel => andel.aktivitetStatus === andelType);
};
const lagPeriodeHeader = (fom, tom) => (
  <FormattedMessage
    id="Beregningsgrunnlag.BeregningTable.Periode"
    key={`fom-tom${fom}${tom}`}
    values={{ fom: moment(fom).format(DDMMYYYY_DATE_FORMAT), tom: tom ? moment(tom).format(DDMMYYYY_DATE_FORMAT) : '' }}
  />
);
const summertVerdiFraListeProp = (andeler, propNavn, altpropNavn) => {
  if (!andeler || andeler.length < 1) {
    return -1;
  }
  let sum = 0;
  andeler.forEach(andel => {
    if (!andel[propNavn] && altpropNavn) {
      sum += andel[altpropNavn] ? andel[altpropNavn] : 0;
    } else {
      sum += andel[propNavn] ? andel[propNavn] : 0;
    }
  });
  return sum;
};


const opprettAndelElement = (periode, andelType, vilkarStatus) => {
  let inntekt;
  const andelElement = {};
  let skalFastsetteGrunnlag = false;
  const andel = hentAndelFraPeriode(periode, andelType);
  if (!andel) {
    return null;
  }
  andelElement.ledetekst = 'Beregningsgrunnlag -';
  andelElement.erOverstyrt = false;
  let strKey = '';
  switch (andelType) {
    case aktivitetStatus.ARBEIDSTAKER:
      skalFastsetteGrunnlag = andel.some(atAndel => atAndel.skalFastsetteGrunnlag === true);
      if (skalFastsetteGrunnlag && vilkarStatus !== vilkarUtfallType.IKKE_VURDERT) {
        // denne testen kan brukes på alle
        const erOverstyrt = andel.some(
          atAndel => atAndel.overstyrtPrAar !== undefined && atAndel.overstyrtPrAar !== null,
        );
        if (erOverstyrt) {
          inntekt = summertVerdiFraListeProp(andel, 'overstyrtPrAar');
          andelElement.erOverstyrt = true;
        } else {
          inntekt = summertVerdiFraListeProp(andel, 'beregnetPrAar');
        }
      } else if (skalFastsetteGrunnlag && vilkarStatus === vilkarUtfallType.IKKE_VURDERT) {
        inntekt = 'fastsett';
      } else {
        inntekt = summertVerdiFraListeProp(andel, 'bruttoPrAar');
      }
      strKey = setTekstStrengKeyPavilkaarUtfallType(skalFastsetteGrunnlag);
      andelElement.ledetekst = <FormattedMessage id={`Beregningsgrunnlag.BeregningTable.${strKey}.${andelType}`} />;
      break;
    case aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE:
      skalFastsetteGrunnlag = andel.skalFastsetteGrunnlag;
      if (skalFastsetteGrunnlag && vilkarStatus !== vilkarUtfallType.IKKE_VURDERT) {
        if (andel.overstyrtPrAar || andel.overstyrtPrAar === 0) {
          inntekt = andel.overstyrtPrAar;
          andelElement.erOverstyrt = true;
        } else {
          inntekt = andel.beregnetPrAar;
        }
      } else if (skalFastsetteGrunnlag && vilkarStatus === vilkarUtfallType.IKKE_VURDERT) {
        inntekt = 'fastsett';
      } else {
        inntekt = andel && (andel.bruttoPrAar || andel.bruttoPrAar === 0) ? andel.bruttoPrAar : undefined;
      }
      // brukes for å sammeligne mot pensjonsgivende inntekt senere
      andelElement.pgiSnitt = andel && (andel.pgiSnitt || andel.pgiSnitt === 0) ? andel.pgiSnitt : undefined;
      strKey = setTekstStrengKeyPavilkaarUtfallType(skalFastsetteGrunnlag);
      andelElement.ledetekst = <FormattedMessage id={`Beregningsgrunnlag.BeregningTable.${strKey}.${andelType}`} />;
      break;
    default:
      if (skalFastsetteGrunnlag && vilkarStatus !== vilkarUtfallType.IKKE_VURDERT) {
        if (andel.overstyrtPrAar || andel.overstyrtPrAar === 0) {
          inntekt = andel.overstyrtPrAar;
          andelElement.erOverstyrt = true;
        } else {
          inntekt = andel.beregnetPrAar;
        }
      } else if (skalFastsetteGrunnlag && vilkarStatus === vilkarUtfallType.IKKE_VURDERT) {
        inntekt = 'fastsett';
      } else {
        inntekt = andel && (andel.bruttoPrAar || andel.bruttoPrAar === 0) ? andel.bruttoPrAar : undefined;
      }
      skalFastsetteGrunnlag = andel.skalFastsetteGrunnlag;
      strKey = setTekstStrengKeyPavilkaarUtfallType(skalFastsetteGrunnlag);
      andelElement.ledetekst = <FormattedMessage id={`Beregningsgrunnlag.BeregningTable.${strKey}.${andel.aktivitetStatus}`} />;
  }
  andelElement.skalFastsetteGrunnlag = skalFastsetteGrunnlag;
  if ((inntekt || inntekt === 0) && inntekt !== -1) {
    andelElement.verdi = inntekt;
  }
  return andelElement;
};
const hentVerdiFraAndel = andel => {
  if (!andel || !andel.verdi) {
    return 0;
  }
  return andel.verdi;
};

const hentPGIFraSNAndel = andel => {
  if (!andel || !andel.pgiSnitt) {
    return 0;
  }
  return andel.pgiSnitt;
};
const settVisningsRaderForATSN = (periode, rowsAndeler, rowsForklaringer, vilkarStatus) => {
  const atElement = opprettAndelElement(periode, aktivitetStatus.ARBEIDSTAKER, vilkarStatus);
  const snElement = opprettAndelElement(periode, aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, vilkarStatus);
  // legger til regler for særtilfeller
  if (hentVerdiFraAndel(snElement) === 0 && hentPGIFraSNAndel(snElement) > 0 && snElement.erOverstyrt !== true) {
    // Dersom verdi for SN er 0, men pgi er større enn 0 betyr det at det er arbeid som har tatt alt
    rowsForklaringer.push(
      <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Omberegnet.ForklaringAToverstigerSN" />,
    );
  } else {
    rowsAndeler.push(snElement);
  }

  if (atElement.erOverstyrt !== true) {
    atElement.ledetekst = <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Omberegnet.AT" />;
  }
  rowsAndeler.push(atElement);
};
const settVisningsRaderForATFLSN = (periode, rowsAndeler, rowsForklaringer, vilkarStatus) => {
  const atElement = opprettAndelElement(periode, aktivitetStatus.ARBEIDSTAKER, vilkarStatus);
  const snElement = opprettAndelElement(periode, aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, vilkarStatus);
  const flElement = opprettAndelElement(periode, aktivitetStatus.FRILANSER, vilkarStatus);
  const erOppfylt = harOppfyltVilkårOgSkjønnsvurdertMinstEnAndel(vilkarStatus, [atElement, flElement, snElement]);
  if (hentVerdiFraAndel(atElement) + hentVerdiFraAndel(flElement) > hentVerdiFraAndel(snElement)) {
    rowsForklaringer.push(
      <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Omberegnet.ForklaringAT_FLoverstigerSN" />,
    );
    rowsAndeler.push(atElement);
    rowsAndeler.push(flElement);
  } else {
    // setter SN ledetekst til Pensjonsgibevnde årsintekt
    if (erOppfylt) {
      // setter SN ledetekst til Fastsatt årsintekt
      snElement.ledetekst = <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Fastsatt.SN" />;
    } else {
      snElement.ledetekst = <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Omberegnet.SN" />;
    }
    rowsAndeler.push(atElement);
    rowsAndeler.push(flElement);
    rowsAndeler.push(snElement);
  }
};
const settVisningsRaderForDPFLSN = (periode, rowsAndeler, rowsForklaringer, vilkarStatus) => {
  const snElement = opprettAndelElement(periode, aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, vilkarStatus);
  const flElement = opprettAndelElement(periode, aktivitetStatus.FRILANSER, vilkarStatus);
  const dpElement = opprettAndelElement(periode, aktivitetStatus.DAGPENGER, vilkarStatus);
  if (hentVerdiFraAndel(dpElement) + hentVerdiFraAndel(flElement) > hentVerdiFraAndel(snElement)) {
    rowsForklaringer.push(
      <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Omberegnet.ForklaringDP_FLoverstigerSN" />,
    );
    rowsAndeler.push(flElement);
    rowsAndeler.push(dpElement);
  } else {
    rowsAndeler.push(flElement);
    rowsAndeler.push(dpElement);
    rowsAndeler.push(snElement);
  }
};
const settVisningsRaderForATDPSN = (periode, rowsAndeler, rowsForklaringer, vilkarStatus) => {
  const atElement = opprettAndelElement(periode, aktivitetStatus.ARBEIDSTAKER, vilkarStatus);
  const snElement = opprettAndelElement(periode, aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, vilkarStatus);
  const dpElement = opprettAndelElement(periode, aktivitetStatus.DAGPENGER, vilkarStatus);

  if (hentVerdiFraAndel(dpElement) + hentVerdiFraAndel(atElement) > hentVerdiFraAndel(snElement)) {
    rowsForklaringer.push(
      <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Omberegnet.ForklaringAT_DPoverstigerSN" />,
    );
    rowsAndeler.push(atElement);
    rowsAndeler.push(dpElement);
  } else {
    rowsAndeler.push(atElement);
    rowsAndeler.push(dpElement);
    rowsAndeler.push(snElement);
  }
};
const settVisningsRaderForDefault = (
  periode,
  rowsAndeler,
  vilkarStatus,
  harBortfallNaturalYtelse,
) => {
  const atElement = opprettAndelElement(periode, aktivitetStatus.ARBEIDSTAKER, vilkarStatus);
  const flElement = opprettAndelElement(periode, aktivitetStatus.FRILANSER, vilkarStatus);
  const snElement = opprettAndelElement(periode, aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, vilkarStatus);
  const aapElement = opprettAndelElement(periode, aktivitetStatus.ARBEIDSAVKLARINGSPENGER, vilkarStatus);
  const dpElement = opprettAndelElement(periode, aktivitetStatus.DAGPENGER, vilkarStatus);
  const baElement = opprettAndelElement(periode, aktivitetStatus.BRUKERS_ANDEL, vilkarStatus);
  const msElement = opprettAndelElement(periode, aktivitetStatus.MILITAER_ELLER_SIVIL, vilkarStatus);
  const kyElement = opprettAndelElement(periode, aktivitetStatus.KUN_YTELSE, vilkarStatus);

  if (baElement && baElement.verdi !== undefined) {
    rowsAndeler.push(baElement);
  }
  if (atElement && atElement.verdi !== undefined) {
    rowsAndeler.push({ ...atElement });
  }
  if (flElement && flElement.verdi !== undefined) {
    rowsAndeler.push(flElement);
  }
  if (snElement && snElement.verdi !== undefined) {
    rowsAndeler.push(snElement);
  }
  if (aapElement && aapElement.verdi !== undefined) {
    rowsAndeler.push(aapElement);
  }
  if (dpElement && dpElement.verdi !== undefined) {
    rowsAndeler.push(dpElement);
  }
  if (msElement && msElement.verdi !== undefined) {
    rowsAndeler.push(msElement);
  }
  if (kyElement && kyElement.verdi !== undefined) {
    rowsAndeler.push(kyElement);
  }

  if (harBortfallNaturalYtelse) {
    const ntElement = {};
    const atAndel = periode.beregningsgrunnlagPrStatusOgAndel.filter(
      andel => andel.aktivitetStatus === aktivitetStatus.ARBEIDSTAKER && andel.bortfaltNaturalytelse,
    );
    ntElement.verdi =
      atAndel && atAndel.length > 0 ? atAndel.reduce((sum, andel) => sum + andel.bortfaltNaturalytelse, 0) : undefined;
    ntElement.skalFastsetteGrunnlag = false;
    ntElement.ledetekst = <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Naturalytelser" />;
    rowsAndeler.push(ntElement);
  }
};
const finnDagsatsGrunnlag = (bruttoRad, avkortetRad, redusertRad) => {
  if (redusertRad.verdi && redusertRad.display !== false) return redusertRad.verdi;
  if (avkortetRad.verdi && avkortetRad.display !== false) return avkortetRad.verdi;
  if (bruttoRad.verdi && bruttoRad.display !== false) return bruttoRad.verdi;
  return null;
};
const sjekkharBortfaltNaturalYtelse = periode => {
  if (!periode) {
    return false;
  }
  return periode.beregningsgrunnlagPrStatusOgAndel.some(
    andel =>
      andel.bortfaltNaturalytelse !== undefined &&
      andel.bortfaltNaturalytelse !== null &&
      andel.bortfaltNaturalytelse !== 0,
  );
};

const finnDagsats = (periode) => {
  if (periode.avkortetPrAar) {
    return Math.round(periode.avkortetPrAar / VIRKEDAGER_PR_AAR);
  }
  return null;
};

const finnAktivitetStatusCombo = (aktivitetStatusList) => {
  const resultList = []
  aktivitetStatusList.sort((a, b) => (a > b ? 1 : -1))
    .forEach((statuskode) => {
      if (!resultList.includes(statuskode)) {
        if (isStatusDagpenger(statuskode)) {
          resultList.push(aktivitetStatus.DAGPENGER);
        } else {
          resultList.push(statuskode);
        }
      }
    }); // sorter alfabetisk
  return resultList.join('_');
}

export const createBeregningTableData = createSelector(
  [
    (state, ownProps) => ownProps.beregningsgrunnlagPerioder,
    (state, ownProps) => ownProps.aktivitetStatusList,
    (state, ownProps) => ownProps.dekningsgrad,
    (state, ownProps) => ownProps.grunnbelop,
    (state, ownProps) => ownProps.vilkaarBG,
  ],
  (allePerioder, aktivitetStatusList, dekningsgrad, grunnbelop, vilkaarBG) => {
    const { vilkarStatus } = vilkaarBG.perioder[0];
    const perioderSomSkalVises = allePerioder.filter(periode =>
      periodeHarAarsakSomTilsierVisning(periode.periodeAarsaker),
    );
    const periodeResultatTabeller = [];
    const seksG = grunnbelop * 6;
    perioderSomSkalVises.forEach(periode => {
      const headers = [];
      const bruttoRad = { ledetekst: <FormattedMessage id="Beregningsgrunnlag.BeregningTable.BruttoTotalt" /> };
      const avkortetRad = { ledetekst: <FormattedMessage id="Beregningsgrunnlag.BeregningTable.Avkortet6g" /> };
      const redusertRad = {
        ledetekst: (
          <FormattedMessage
            id="Beregningsgrunnlag.BeregningTable.RedusertProsent"
            values={{ redusert: dekningsgrad }}
          />
        ),
      };
      const dagsatserRad = {};
      const harBortfallNaturalYtelse = sjekkharBortfaltNaturalYtelse(periode);
      headers.push(lagPeriodeHeader(periode.beregningsgrunnlagPeriodeFom, periode.beregningsgrunnlagPeriodeTom));
      bruttoRad.verdi = formatCurrencyNoKr(periode.bruttoInkludertBortfaltNaturalytelsePrAar);
      avkortetRad.verdi = formatCurrencyNoKr(periode.avkortetPrAar);
      if (dekningsgrad !== dekningsgradKode.HUNDRE) {
        redusertRad.verdi = formatCurrencyNoKr(periode.redusertPrAar);
      }
      dagsatserRad.verdi = formatCurrencyNoKr(finnDagsats(periode));
      const rowsAndeler = [];
      const rowsForklaringer = [];
      const aktivitetStatusKodeKombo = finnAktivitetStatusCombo(aktivitetStatusList);
      switch (aktivitetStatusKodeKombo) {
        case 'AT_SN': {
          settVisningsRaderForATSN(periode, rowsAndeler, rowsForklaringer, vilkarStatus);
          break;
        }
        case 'AT_FL_SN': {
          settVisningsRaderForATFLSN(periode, rowsAndeler, rowsForklaringer, vilkarStatus);
          break;
        }
        case 'DP_FL_SN': {
          settVisningsRaderForDPFLSN(periode, rowsAndeler, rowsForklaringer, vilkarStatus);
          break;
        }
        case 'AT_DP_SN': {
          settVisningsRaderForATDPSN(periode, rowsAndeler, rowsForklaringer, vilkarStatus);
          break;
        }
        default: {
          settVisningsRaderForDefault(
            periode,
            rowsAndeler,
            vilkarStatus,
            harBortfallNaturalYtelse,
          );
        }
      }

      // sjekk om spesialrader skul vises
      // IKKE vis avkortet rad hvis mindre en 6G
      if (removeSpacesFromNumber(bruttoRad.verdi) < seksG) {
        avkortetRad.display = false;
      }
      dagsatserRad.grunnlag = finnDagsatsGrunnlag(bruttoRad, avkortetRad, redusertRad);
      if (rowsAndeler.length < 2) {
        bruttoRad.display = false;
      }
      if (bruttoRad.display !== false && bruttoRad.verdi === redusertRad.verdi) {
        redusertRad.display = false;
      }

      periodeResultatTabeller.push({
        headers,
        rowsAndeler,
        avkortetRad,
        redusertRad,
        bruttoRad,
        dagsatser: dagsatserRad,
        rowsForklaringer,
      });
    });
    return periodeResultatTabeller;
  },
);

/**
 * BeregningsresultatTable2
 *
 * Presentasjonskomponent. Viser faktagruppe med beregningstabellen som viser inntekter brukt i
 * beregningen og hva dagsatsen ble.
 * Dersom vilkåret ble avslått vil grunnen til dette vises istedenfor tabellen
 */
const BeregningsresultatTable = ({ intl, vilkaarBG, periodeResultatTabeller, halvGVerdi, erMidlertidigInaktiv }) => (
  <BeregningsresutatPanel
    intl={intl}
    halvGVerdi={halvGVerdi}
    periodeResultatTabeller={periodeResultatTabeller}
    vilkaarBG={vilkaarBG}
    erMidlertidigInaktiv={erMidlertidigInaktiv}
  />
);

BeregningsresultatTable.propTypes = {
  intl: PropTypes.shape().isRequired,
  halvGVerdi: PropTypes.number.isRequired,
  vilkaarBG: beregningsgrunnlagVilkarPropType.isRequired,
  periodeResultatTabeller: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  erMidlertidigInaktiv: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  periodeResultatTabeller: createBeregningTableData(state, ownProps),
});

export default connect(mapStateToProps)(injectIntl(BeregningsresultatTable));

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { removeSpacesFromNumber } from '@fpsak-frontend/utils';
import aktivitetStatuser from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { BorderBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import FordelBeregningsgrunnlagPeriodePanel from './FordelBeregningsgrunnlagPeriodePanel';
import { skalValidereMotBeregningsgrunnlag } from '../BgFordelingUtils';
import slåSammenPerioder from './SlåSammenPerioder';

import styles from './fordelBeregningsgrunnlagForm.less';

const fordelBGFieldArrayNamePrefix = 'fordelBGPeriode';

export const getFieldNameKey = index => fordelBGFieldArrayNamePrefix + index;


const getFordelPerioder = beregningsgrunnlag => {
  if (
    beregningsgrunnlag &&
    beregningsgrunnlag.faktaOmFordeling &&
    beregningsgrunnlag.faktaOmFordeling.fordelBeregningsgrunnlag
  ) {
    return beregningsgrunnlag.faktaOmFordeling.fordelBeregningsgrunnlag.fordelBeregningsgrunnlagPerioder || [];
  }
  return [];
};

/**
 * FordelBeregningsgrunnlagForm
 *
 * Container komponent.. Behandling av aksjonspunktet for fasetting av nytt/endret beregningsgrunnlag.
 */

export class FordelBeregningsgrunnlagForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openPanels: getFordelPerioder(props.beregningsgrunnlag).map(periode => periode.fom),
    };
    this.showPanel = this.showPanel.bind(this);
  }

  showPanel(fom) {
    const { openPanels } = this.state;
    if (openPanels.includes(fom)) {
      this.setState({ openPanels: openPanels.filter(panel => panel !== fom) });
    } else {
      openPanels.push(fom);
      this.setState({ openPanels });
    }
  }

  render() {
    const {
      readOnly,
      isAvklaringsbehovClosed,
      beregningsgrunnlag,
      alleKodeverk,
      arbeidsgiverOpplysningerPerId,
      behandlingType,
      grunnlagFieldId,
    } = this.props;
    const { openPanels } = this.state;
    return (
      <BorderBox className={styles.lessPadding}>
        {slåSammenPerioder(getFordelPerioder(beregningsgrunnlag), beregningsgrunnlag.beregningsgrunnlagPeriode).map(
          (periode, index) => (
            <React.Fragment key={grunnlagFieldId + fordelBGFieldArrayNamePrefix + periode.fom}>
              <VerticalSpacer eightPx />
              <FordelBeregningsgrunnlagPeriodePanel
                readOnly={readOnly}
                fordelBGFieldArrayName={`${grunnlagFieldId}.${getFieldNameKey(index)}`}
                fom={periode.fom}
                tom={periode.tom}
                open={openPanels ? openPanels.filter(panel => panel === periode.fom).length > 0 : false}
                harPeriodeAarsakGraderingEllerRefusjon={periode.harPeriodeAarsakGraderingEllerRefusjon}
                isAvklaringsbehovClosed={isAvklaringsbehovClosed}
                showPanel={this.showPanel}
                beregningsgrunnlag={beregningsgrunnlag}
                alleKodeverk={alleKodeverk}
                arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
                behandlingType={behandlingType}
                grunnlagFieldId={grunnlagFieldId}
              />
              <VerticalSpacer eightPx />
            </React.Fragment>
          ),
        )}
      </BorderBox>
    );
  }
}

FordelBeregningsgrunnlagForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAvklaringsbehovClosed: PropTypes.bool.isRequired,
  beregningsgrunnlag: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  behandlingType: kodeverkObjektPropType.isRequired,
  grunnlagFieldId: PropTypes.string.isRequired,
};

export const finnSumIPeriode = (bgPerioder, fom) => {
  const periode = bgPerioder.find(p => p.beregningsgrunnlagPeriodeFom === fom);
  return periode.bruttoPrAar;
};

FordelBeregningsgrunnlagForm.validate = (
  values,
  beregningsgrunnlag,
  getKodeverknavn,
  arbeidsgiverOpplysningerPerId,
) => {
  const errors = {};
  const fordelBGPerioder = getFordelPerioder(beregningsgrunnlag);
  if (fordelBGPerioder && fordelBGPerioder.length > 0 && values) {
    const skalValidereMotBeregningsgrunnlagPrAar = andel =>
      skalValidereMotBeregningsgrunnlag(beregningsgrunnlag)(andel);
    const perioderSlattSammen = slåSammenPerioder(fordelBGPerioder, beregningsgrunnlag.beregningsgrunnlagPeriode);
    const grunnbeløp = Number(beregningsgrunnlag.halvG) * 2;
    for (let i = 0; i < perioderSlattSammen.length; i += 1) {
      if (perioderSlattSammen[i].skalRedigereInntekt) {
        const sumIPeriode = finnSumIPeriode(beregningsgrunnlag.beregningsgrunnlagPeriode, perioderSlattSammen[i].fom);
        const periode = values[getFieldNameKey(i)];
        const periodeDato = { fom: perioderSlattSammen[i], tom: perioderSlattSammen[i] };
        errors[getFieldNameKey(i)] = FordelBeregningsgrunnlagPeriodePanel.validate(
          periode,
          sumIPeriode,
          skalValidereMotBeregningsgrunnlagPrAar,
          getKodeverknavn,
          arbeidsgiverOpplysningerPerId,
          grunnbeløp,
          periodeDato,
        );
      } else {
        errors[getFieldNameKey(i)] = null;
      }
    }
  }
  return errors;
};

const finnRiktigBgPeriode = (periode, bgPerioder) =>
  bgPerioder.find(p => p.beregningsgrunnlagPeriodeFom === periode.fom);

FordelBeregningsgrunnlagForm.buildInitialValues = (bg, getKodeverknavn, arbeidsgiverOpplysningerPerId) => {
  const initialValues = {};
  const fordelBGPerioder = getFordelPerioder(bg);
  if (!fordelBGPerioder) {
    return initialValues;
  }
  const harKunYtelse = bg.aktivitetStatus.some(status => status === aktivitetStatuser.KUN_YTELSE);
  const bgPerioder = bg.beregningsgrunnlagPeriode;
  slåSammenPerioder(fordelBGPerioder, bgPerioder).forEach((periode, index) => {
    const bgPeriode = finnRiktigBgPeriode(periode, bgPerioder);
    initialValues[getFieldNameKey(index)] = FordelBeregningsgrunnlagPeriodePanel.buildInitialValues(
      periode,
      bgPeriode,
      bg.skjaeringstidspunktBeregning,
      harKunYtelse,
      getKodeverknavn,
      arbeidsgiverOpplysningerPerId,
    );
  });
  return initialValues;
};

const getAndelsnr = aktivitet => {
  if (aktivitet.nyAndel === true) {
    return aktivitet.andel;
  }
  return aktivitet.andelsnr;
};

export const mapTilFastsatteVerdier = aktivitet => ({
  fastsattÅrsbeløp: removeSpacesFromNumber(aktivitet.fastsattBelop),
  inntektskategori: aktivitet.inntektskategori,
});

export const mapAndel = aktivitet => ({
  andel: aktivitet.andel,
  andelsnr: getAndelsnr(aktivitet),
  aktivitetStatus: aktivitet.aktivitetStatus,
  arbeidsgiverId: aktivitet.arbeidsgiverIdent !== '' ? aktivitet.arbeidsgiverIdent : null,
  arbeidsforholdId: aktivitet.arbeidsforholdId !== '' ? aktivitet.arbeidsforholdId : null,
  nyAndel: aktivitet.nyAndel,
  lagtTilAvSaksbehandler: aktivitet.lagtTilAvSaksbehandler,
  arbeidsforholdType: aktivitet.arbeidsforholdType,
  beregningsperiodeTom: aktivitet.beregningsperiodeTom,
  beregningsperiodeFom: aktivitet.beregningsperiodeFom,
  forrigeArbeidsinntektPrÅr: aktivitet.forrigeArbeidsinntektPrAar,
  forrigeRefusjonPrÅr: aktivitet.forrigeRefusjonPrAar,
  forrigeInntektskategori: aktivitet.forrigeInntektskategori,
  fastsatteVerdier: mapTilFastsatteVerdier(aktivitet),
});

const inkludererPeriode = periode => p =>
  moment(p.fom).isSameOrAfter(moment(periode.fom)) &&
  (periode.tom === null || moment(p.tom).isSameOrBefore(moment(periode.tom)));

export const lagPerioderForSubmit = (values, index, kombinertPeriode, fordelBGPerioder) =>
  fordelBGPerioder.filter(inkludererPeriode(kombinertPeriode)).map(p => ({
    andeler: values[getFieldNameKey(index)].map(mapAndel),
    fom: p.fom,
    tom: p.tom,
  }));

export const transformPerioder = (values, bg) => {
  const bgPerioder = bg.beregningsgrunnlagPeriode;
  const fordelBGPerioder = getFordelPerioder(bg);
  const fordelBeregningsgrunnlagPerioder = [];
  const kombinertePerioder = slåSammenPerioder(fordelBGPerioder, bgPerioder);
  for (let index = 0; index < kombinertePerioder.length; index += 1) {
    const { harPeriodeAarsakGraderingEllerRefusjon } = kombinertePerioder[index];
    if (harPeriodeAarsakGraderingEllerRefusjon) {
      lagPerioderForSubmit(values, index, kombinertePerioder[index], fordelBGPerioder).forEach(p =>
        fordelBeregningsgrunnlagPerioder.push(p),
      );
    }
  }
  return fordelBeregningsgrunnlagPerioder;
};

FordelBeregningsgrunnlagForm.transformValues = (values, bg) => ({
  endretBeregningsgrunnlagPerioder: transformPerioder(values, bg),
});

export default FordelBeregningsgrunnlagForm;

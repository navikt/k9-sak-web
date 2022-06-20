import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import avklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import FordelingForm from './FordelingForm';
import VurderEndringRefusjonForm from './refusjon/VurderEndringRefusjonForm';
import beregningsgrunnlagPropType from '../propTypes/beregningsgrunnlagPropType';
import beregningAvklaringsbehovPropType from '../propTypes/beregningAvklaringsbehovPropType';
import vilkårPeriodePropType from '../propTypes/vilkårPeriodePropType';

const { FORDEL_BEREGNINGSGRUNNLAG, VURDER_REFUSJON_BERGRUNN } = avklaringsbehovCodes;

const harFordelInfo = bg => (bg && bg.faktaOmFordeling ? !!bg.faktaOmFordeling.fordelBeregningsgrunnlag : false);

const harRefusjonInfo = bg => !!(bg && bg.refusjonTilVurdering);

const getFordelAvklaringsbehov = avklaringsbehov =>
  avklaringsbehov ? avklaringsbehov.find(ab => ab.definisjon === FORDEL_BEREGNINGSGRUNNLAG) : undefined;

const getRefusjonAvklaringsbehov = avklaringsbehov =>
  avklaringsbehov ? avklaringsbehov.find(ab => ab.definisjon === VURDER_REFUSJON_BERGRUNN) : undefined;

/**
 * FordelBeregningsgrunnlagPanel
 *
 * Har ansvar for å sette opp Redux Formen for "avklar fakta om fordeling" panel.
 */
export class FordelBeregningsgrunnlagPanel extends Component {
  constructor() {
    super();
    this.state = {
      submitEnabled: false,
    };
  }

  componentDidMount() {
    const { submitEnabled } = this.state;
    if (!submitEnabled) {
      this.setState({
        submitEnabled: true,
      });
    }
  }

  render() {
    const {
      props: {
        readOnly,
        avklaringsbehov,
        submitCallback,
        beregningsgrunnlag,
        behandlingId,
        behandlingVersjon,
        alleKodeverk,
        arbeidsgiverOpplysningerPerId,
        alleMerknaderFraBeslutter,
        behandlingType,
        submittable,
        kreverManuellBehandling,
        aktivtBeregningsgrunnlagIndex,
        alleBeregningsgrunnlag,
        vilkårsperioder,
      },
      state: { submitEnabled },
    } = this;

    const fordelAP = getFordelAvklaringsbehov(avklaringsbehov);
    const refusjonAP = getRefusjonAvklaringsbehov(avklaringsbehov);
    const skalViseFordeling = fordelAP && harFordelInfo(beregningsgrunnlag);
    const skalViseRefusjon = refusjonAP && harRefusjonInfo(beregningsgrunnlag);
    return (
      <>
        {skalViseRefusjon && (
          <VurderEndringRefusjonForm
            submitEnabled={submitEnabled}
            submittable={submittable}
            readOnly={readOnly}
            submitCallback={submitCallback}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            alleKodeverk={alleKodeverk}
            arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
            alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
            behandlingType={behandlingType}
            avklaringsbehov={avklaringsbehov}
            kreverManuellBehandling={kreverManuellBehandling}
            aktivtBeregningsgrunnlagIndex={aktivtBeregningsgrunnlagIndex}
            alleBeregningsgrunnlag={alleBeregningsgrunnlag}
            vilkårsperioder={vilkårsperioder}
          />
        )}
        {skalViseFordeling && (
          <FordelingForm
            submitEnabled={submitEnabled}
            submittable={submittable}
            readOnly={readOnly}
            submitCallback={submitCallback}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            alleKodeverk={alleKodeverk}
            arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
            alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
            beregningsgrunnlag={beregningsgrunnlag}
            behandlingType={behandlingType}
            avklaringsbehov={avklaringsbehov}
            kreverManuellBehandling={kreverManuellBehandling}
            aktivtBeregningsgrunnlagIndex={aktivtBeregningsgrunnlagIndex}
            alleBeregningsgrunnlag={alleBeregningsgrunnlag}
            vilkårsperioder={vilkårsperioder}
          />
        )}
      </>
    );
  }
}

FordelBeregningsgrunnlagPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  avklaringsbehov: PropTypes.arrayOf(beregningAvklaringsbehovPropType.isRequired).isRequired,
  submitCallback: PropTypes.func.isRequired,
  submittable: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  beregningsgrunnlag: beregningsgrunnlagPropType.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  behandlingType: kodeverkObjektPropType.isRequired,
  kreverManuellBehandling: PropTypes.bool.isRequired,
  aktivtBeregningsgrunnlagIndex: PropTypes.number.isRequired,
  alleBeregningsgrunnlag: PropTypes.arrayOf(beregningsgrunnlagPropType).isRequired,
  vilkårsperioder: PropTypes.arrayOf(vilkårPeriodePropType).isRequired,
};

export default FordelBeregningsgrunnlagPanel;

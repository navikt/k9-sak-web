import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { behandlingFormValueSelector } from '@fpsak-frontend/form';
import avklaringsbehovCodes, { harAvklaringsbehov } from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import { isAvklaringsbehovOpen } from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovStatus';

import VurderVarigEndretEllerNyoppstartetSN from './VurderVarigEndretEllerNyoppstartetSN';
import FastsettSN from './FastsettSN';
import beregningAvklaringsbehovPropType from '../../propTypes/beregningAvklaringsbehovPropType';

const FORM_NAME = 'BeregningForm';
const {
  FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
} = avklaringsbehovCodes;

const finnSnAvklaringsbehov = avklaringsbehov =>
  avklaringsbehov &&
  avklaringsbehov.find(
    ab =>
      ab.definisjon === VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE ||
      ab.definisjon === FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  );

/**
 * VurderOgFastsettSNImpl
 *
 * Containerkomponent. Setter opp riktige forms basert på hvilket aksjonspunkt vi har og hva som er valgt i radioknapper
 */
export const VurderOgFastsettSNImpl = ({
  readOnly,
  erVarigEndretNaering,
  isAvklaringsbehovClosed,
  erNyArbLivet,
  erNyoppstartet,
  erVarigEndring,
  avklaringsbehov,
  endretTekst,
  fieldArrayID,
}) => {
  if (erNyArbLivet) {
    return (
      <FastsettSN
        readOnly={readOnly}
        isAvklaringsbehovClosed={isAvklaringsbehovClosed}
        avklaringsbehov={avklaringsbehov}
        erNyArbLivet={erNyArbLivet}
        fieldArrayID={fieldArrayID}
      />
    );
  }
  return (
    <>
      <VurderVarigEndretEllerNyoppstartetSN
        readOnly={readOnly}
        isAvklaringsbehovClosed={isAvklaringsbehovClosed}
        erVarigEndring={erVarigEndring}
        erNyoppstartet={erNyoppstartet}
        erVarigEndretNaering={erVarigEndretNaering}
        avklaringsbehov={avklaringsbehov}
        endretTekst={endretTekst}
        fieldArrayID={fieldArrayID}
      />
      {erVarigEndretNaering && (
        <FastsettSN
          readOnly={readOnly}
          isAvklaringsbehovClosed={isAvklaringsbehovClosed}
          avklaringsbehov={avklaringsbehov}
          erNyArbLivet={erNyArbLivet}
          endretTekst={endretTekst}
          fieldArrayID={fieldArrayID}
        />
      )}
    </>
  );
};

VurderOgFastsettSNImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  erVarigEndretNaering: PropTypes.bool,
  isAvklaringsbehovClosed: PropTypes.bool.isRequired,
  erNyArbLivet: PropTypes.bool.isRequired,
  erVarigEndring: PropTypes.bool.isRequired,
  erNyoppstartet: PropTypes.bool.isRequired,
  endretTekst: PropTypes.node,
  avklaringsbehov: PropTypes.arrayOf(beregningAvklaringsbehovPropType).isRequired,
  fieldArrayID: PropTypes.string.isRequired,
};

VurderOgFastsettSNImpl.defaultProps = {
  erVarigEndretNaering: undefined,
};

const mapStateToPropsFactory = (initialState, ownPropsStatic) => {
  const avklaringsbehovSN = finnSnAvklaringsbehov(ownPropsStatic.avklaringsbehov);
  return (state, ownProps) => ({
    erVarigEndretNaering: behandlingFormValueSelector(
      FORM_NAME,
      ownProps.behandlingId,
      ownProps.behandlingVersjon,
    )(state, `${ownProps.fieldArrayID}.erVarigEndretNaering`),
    isAvklaringsbehovClosed: !isAvklaringsbehovOpen(avklaringsbehovSN.status),
    fieldArrayID: ownProps.fieldArrayID,
  });
};

const VurderOgFastsettSN = connect(mapStateToPropsFactory)(VurderOgFastsettSNImpl);

VurderOgFastsettSN.buildInitialValues = (relevanteAndeler, avklaringsbehov) => {
  if (harAvklaringsbehov(FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, avklaringsbehov)) {
    return FastsettSN.buildInitialValuesNyIArbeidslivet(relevanteAndeler, avklaringsbehov);
  }

  if (harAvklaringsbehov(VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE, avklaringsbehov)) {
    return {
      ...VurderVarigEndretEllerNyoppstartetSN.buildInitialValues(relevanteAndeler, avklaringsbehov),
    };
  }

  return undefined;
};

VurderOgFastsettSN.transformValues = (values, gjeldendeAksjonspunkter) => {
  if (harAvklaringsbehov(FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, gjeldendeAksjonspunkter)) {
    return FastsettSN.transformValuesNyIArbeidslivet(values);
  }
  return VurderVarigEndretEllerNyoppstartetSN.transformValues(values);
};

export default VurderOgFastsettSN;

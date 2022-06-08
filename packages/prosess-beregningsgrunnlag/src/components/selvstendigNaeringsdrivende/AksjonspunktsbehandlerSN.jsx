import React from 'react';
import PropTypes from 'prop-types';
import avklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import beregningAvklaringsbehovPropType from '../../propTypes/beregningAvklaringsbehovPropType';
import VurderOgFastsettSN2 from './VurderOgFastsettSN';

const {
  FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
} = avklaringsbehovCodes;

const skalFastsetteSN = avklaringsbehov =>
  avklaringsbehov &&
  avklaringsbehov.some(
    ab =>
      ab.definisjon.kode === VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE ||
      ab.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  );

const AksjonspunktBehandlerSN = ({
  readOnly,
  avklaringsbehov,
  behandlingId,
  behandlingVersjon,
  erNyArbLivet,
  erVarigEndring,
  erNyoppstartet,
  endretTekst,
  fieldArrayID,
}) => (
  // eslint-disable-next-line react/jsx-no-useless-fragment
  <>
    {skalFastsetteSN(avklaringsbehov) && (
      <VurderOgFastsettSN2
        avklaringsbehov={avklaringsbehov}
        readOnly={readOnly}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        erNyArbLivet={erNyArbLivet}
        erVarigEndring={erVarigEndring}
        erNyoppstartet={erNyoppstartet}
        endretTekst={endretTekst}
        fieldArrayID={fieldArrayID}
      />
    )}
  </>
);

AksjonspunktBehandlerSN.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  avklaringsbehov: PropTypes.arrayOf(beregningAvklaringsbehovPropType).isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  erNyArbLivet: PropTypes.bool,
  erVarigEndring: PropTypes.bool,
  erNyoppstartet: PropTypes.bool,
  endretTekst: PropTypes.node,
  fieldArrayID: PropTypes.string,
};
AksjonspunktBehandlerSN.defaultProps = {
  erNyArbLivet: false,
  erVarigEndring: false,
  erNyoppstartet: false,
};

export default AksjonspunktBehandlerSN;

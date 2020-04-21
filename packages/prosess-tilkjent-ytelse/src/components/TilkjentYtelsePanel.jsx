import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import Tilbaketrekkpanel from './tilbaketrekk/Tilbaketrekkpanel';
import tilkjentYtelseBeregningresultatPropType from '../propTypes/tilkjentYtelseBeregningresultatPropType';
import TilkjentYtelse from './TilkjentYtelse';

const perioderMedClassName = [];

const formatPerioder = perioder => {
  perioderMedClassName.length = 0;
  perioder.forEach((item, index) => {
    if (item.andeler[0] && item.dagsats) {
      perioderMedClassName.push(item);
      perioderMedClassName[perioderMedClassName.length - 1].id = index;
    }
  });
  return perioderMedClassName;
};

const groups = [
  { id: 1, content: '' },
  { id: 2, content: '' },
];

export const TilkjentYtelsePanelImpl = ({
  beregningsresultatMedUttaksplan,
  soknadDato,
  vurderTilbaketrekkAP,
  readOnly,
  submitCallback,
  readOnlySubmitButton,
  alleKodeverk,
  behandlingId,
  behandlingVersjon,
}) => (
  <>
    <Undertittel>
      <FormattedMessage id="TilkjentYtelse.Title" />
    </Undertittel>
    {beregningsresultatMedUttaksplan && (
      <TilkjentYtelse
        items={formatPerioder(beregningsresultatMedUttaksplan.perioder)}
        groups={groups}
        soknadDate={soknadDato}
        alleKodeverk={alleKodeverk}
      />
    )}
    {vurderTilbaketrekkAP && (
      <Tilbaketrekkpanel
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        readOnly={readOnly}
        vurderTilbaketrekkAP={vurderTilbaketrekkAP}
        submitCallback={submitCallback}
        readOnlySubmitButton={readOnlySubmitButton}
        beregningsresultat={beregningsresultatMedUttaksplan}
      />
    )}
  </>
);

TilkjentYtelsePanelImpl.propTypes = {
  beregningsresultatMedUttaksplan: tilkjentYtelseBeregningresultatPropType,
  soknadDato: PropTypes.string.isRequired,
  vurderTilbaketrekkAP: PropTypes.shape(),
  readOnly: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
};

TilkjentYtelsePanelImpl.defaultProps = {
  beregningsresultatMedUttaksplan: undefined,
  vurderTilbaketrekkAP: undefined,
};

const finnTilbaketrekkAksjonspunkt = createSelector(
  [(state, ownProps) => ownProps.aksjonspunkter],
  alleAksjonspunkter => {
    if (alleAksjonspunkter) {
      return alleAksjonspunkter.find(
        ap => ap.definisjon && ap.definisjon.kode === aksjonspunktCodes.VURDER_TILBAKETREKK,
      );
    }
    return undefined;
  },
);

const mapStateToProps = (state, ownProps) => {
  const { soknad } = ownProps;
  return {
    soknadDato: soknad.mottattDato,
    beregningsresultatMedUttaksplan: ownProps.beregningresultat,
    vurderTilbaketrekkAP: finnTilbaketrekkAksjonspunkt(state, ownProps),
  };
};

export default connect(mapStateToProps)(injectIntl(TilkjentYtelsePanelImpl));

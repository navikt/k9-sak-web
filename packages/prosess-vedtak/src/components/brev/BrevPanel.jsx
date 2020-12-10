import React from 'react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import styles from './BrevPanel.less';
import InformasjonsbehovAutomatiskVedtaksbrev from './InformasjonsbehovAutomatiskVedtaksbrev';
import FritekstBrevPanel from '../FritekstBrevPanel';
import { VedtakPreviewLink } from '../PreviewLink';

const kanResultatForhåndsvises = behandlingResultat => {
  if (!behandlingResultat) {
    return true;
  }
  const { type } = behandlingResultat;
  if (!type) {
    return true;
  }
  return type.kode !== 'ENDRING_I_FORDELING_AV_YTELSEN' && type.kode !== 'INGEN_ENDRING';
};

export const BrevPanel = props => {
  const {
    intl,
    readOnly,
    sprakkode,
    beregningErManueltFastsatt,
    tilgjengeligeVedtaksbrev,
    skalBrukeOverstyrendeFritekstBrev,
    begrunnelse,
    previewCallback,
    redusertUtbetalingÅrsaker,
    brødtekst,
    overskrift,
    behandlingResultat,
  } = props;

  const getPreviewAutomatiskBrevCallback = fritekst => e => {
    previewCallback({
      dokumentdata: { fritekst: fritekst || ' ', redusertUtbetalingÅrsaker },
      dokumentMal: dokumentMalType.UTLED,
    });
    e.preventDefault();
  };

  const getManuellBrevCallback = () => e => {
    previewCallback({
      dokumentdata: { fritekstbrev: { brødtekst: brødtekst || ' ', overskrift: overskrift || ' ' } },
      dokumentMal: dokumentMalType.FRITKS,
    });
    e.preventDefault();
  };

  const harTilgjengeligeVedtaksbrev = !Array.isArray(tilgjengeligeVedtaksbrev) || !!tilgjengeligeVedtaksbrev.length;
  const kanHaAutomatiskVedtaksbrev =
    harTilgjengeligeVedtaksbrev && tilgjengeligeVedtaksbrev.some(vb => vb === 'AUTOMATISK');
  const kanHaFritekstbrev = harTilgjengeligeVedtaksbrev && tilgjengeligeVedtaksbrev.some(vb => vb === 'FRITEKST');

  const fritekstbrev = kanHaFritekstbrev && (
    <>
      <FritekstBrevPanel
        readOnly={readOnly}
        sprakkode={sprakkode}
        previewBrev={getPreviewAutomatiskBrevCallback(begrunnelse)}
        harAutomatiskVedtaksbrev={kanHaAutomatiskVedtaksbrev}
      />
      <VedtakPreviewLink previewCallback={getManuellBrevCallback()} />
    </>
  );

  const automatiskbrev = kanHaAutomatiskVedtaksbrev && (
    <>
      <InformasjonsbehovAutomatiskVedtaksbrev
        intl={intl}
        readOnly={readOnly}
        sprakkode={sprakkode}
        beregningErManueltFastsatt={beregningErManueltFastsatt}
        begrunnelse={begrunnelse}
      />
      {kanResultatForhåndsvises(behandlingResultat) && (
        <VedtakPreviewLink previewCallback={getPreviewAutomatiskBrevCallback(begrunnelse)} />
      )}
    </>
  );

  const brevpanel = skalBrukeOverstyrendeFritekstBrev ? fritekstbrev : automatiskbrev;

  return (
    <div>
      {harTilgjengeligeVedtaksbrev ? (
        brevpanel
      ) : (
        <AlertStripeInfo className={styles.infoIkkeVedtaksbrev}>
          {intl.formatMessage({ id: 'VedtakForm.IkkeVedtaksbrev' })}
        </AlertStripeInfo>
      )}
    </div>
  );
};

BrevPanel.propTypes = {
  intl: PropTypes.shape().isRequired,
  sprakkode: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  begrunnelse: PropTypes.string,
  tilgjengeligeVedtaksbrev: PropTypes.arrayOf(PropTypes.string),
  skalBrukeOverstyrendeFritekstBrev: PropTypes.bool.isRequired,
  beregningErManueltFastsatt: PropTypes.bool,
  previewCallback: PropTypes.func.isRequired,
  redusertUtbetalingÅrsaker: PropTypes.arrayOf(PropTypes.string),
  brødtekst: PropTypes.string,
  overskrift: PropTypes.string,
  behandlingResultat: PropTypes.shape(),
};

BrevPanel.defaultProps = {
  tilgjengeligeVedtaksbrev: undefined,
  begrunnelse: null,
  brødtekst: null,
  overskrift: null,
};

export default injectIntl(BrevPanel);

import React from 'react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import {
  finnesTilgjengeligeVedtaksbrev,
  kanHaAutomatiskVedtaksbrev,
  kanHaFritekstbrev,
} from '@fpsak-frontend/utils/src/formidlingUtils';
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

const getManuellBrevCallback = ({ brødtekst, overskrift, formProps, previewCallback }) => e => {
  if (formProps.valid || formProps.pristine) {
    previewCallback({
      dokumentdata: { fritekstbrev: { brødtekst: brødtekst || ' ', overskrift: overskrift || ' ' } },
      dokumentMal: dokumentMalType.FRITKS,
    });
  } else {
    formProps.submit();
  }
  e.preventDefault();
};

const automatiskVedtaksbrevParams = ({ fritekst, redusertUtbetalingÅrsaker }) => {
  return {
    dokumentdata: { fritekst: fritekst || ' ', redusertUtbetalingÅrsaker },
    dokumentMal: dokumentMalType.UTLED,
  };
};

const getPreviewAutomatiskBrevCallbackUtenValidering = ({
  fritekst,
  redusertUtbetalingÅrsaker,
  previewCallback,
}) => e => {
  previewCallback(automatiskVedtaksbrevParams({ fritekst, redusertUtbetalingÅrsaker }));
  e.preventDefault();
};

const getPreviewAutomatiskBrevCallback = ({ fritekst, redusertUtbetalingÅrsaker, formProps, previewCallback }) => e => {
  if (formProps.valid || formProps.pristine) {
    previewCallback(automatiskVedtaksbrevParams({ fritekst, redusertUtbetalingÅrsaker }));
  } else {
    formProps.submit();
  }
  e.preventDefault();
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
    formProps,
  } = props;

  const automatiskBrevCallback = getPreviewAutomatiskBrevCallback({
    fritekst: begrunnelse,
    redusertUtbetalingÅrsaker,
    formProps,
    previewCallback,
  });
  const automatiskBrevUtenValideringCallback = getPreviewAutomatiskBrevCallbackUtenValidering({
    fritekst: begrunnelse,
    redusertUtbetalingÅrsaker,
    previewCallback,
  });

  const manuellBrevCallback = getManuellBrevCallback({
    brødtekst,
    overskrift,
    formProps,
    previewCallback,
  });

  const harAutomatiskVedtaksbrev = kanHaAutomatiskVedtaksbrev(tilgjengeligeVedtaksbrev);
  const harFritekstbrev = kanHaFritekstbrev(tilgjengeligeVedtaksbrev);

  const fritekstbrev = harFritekstbrev && (
    <>
      <FritekstBrevPanel
        readOnly={readOnly}
        sprakkode={sprakkode}
        previewBrev={automatiskBrevUtenValideringCallback}
        harAutomatiskVedtaksbrev={harAutomatiskVedtaksbrev}
      />
      <VedtakPreviewLink previewCallback={manuellBrevCallback} />
    </>
  );

  const automatiskbrev = harAutomatiskVedtaksbrev && (
    <>
      <InformasjonsbehovAutomatiskVedtaksbrev
        intl={intl}
        readOnly={readOnly}
        sprakkode={sprakkode}
        beregningErManueltFastsatt={beregningErManueltFastsatt}
        begrunnelse={begrunnelse}
      />
      {kanResultatForhåndsvises(behandlingResultat) && <VedtakPreviewLink previewCallback={automatiskBrevCallback} />}
    </>
  );

  const brevpanel = skalBrukeOverstyrendeFritekstBrev ? fritekstbrev : automatiskbrev;

  return (
    <div>
      {finnesTilgjengeligeVedtaksbrev(tilgjengeligeVedtaksbrev) ? (
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
  formProps: PropTypes.shape().isRequired,
};

BrevPanel.defaultProps = {
  tilgjengeligeVedtaksbrev: undefined,
  begrunnelse: null,
  brødtekst: null,
  overskrift: null,
};

export default injectIntl(BrevPanel);

import classNames from 'classnames';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';

import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import styles from './vedtakKlageSubmitPanel.css';

const medholdIKlage = klageVurderingResultat =>
  klageVurderingResultat && klageVurderingResultat.klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE;

export const isMedholdIKlage = (klageVurderingResultatNFP, klageVurderingResultatNK) =>
  medholdIKlage(klageVurderingResultatNFP) || medholdIKlage(klageVurderingResultatNK);

const getPreviewCallback = (formProps, previewVedtakCallback) => e => {
  if (formProps.valid || formProps.pristine) {
    previewVedtakCallback({ dokumentMal: dokumentMalType.UTLED });
  } else {
    formProps.submit();
  }
  e.preventDefault();
};

export const VedtakKlageSubmitPanelImpl = ({ intl, behandlingPaaVent, previewVedtakCallback, formProps, readOnly }) => {
  const previewBrev = getPreviewCallback(formProps, previewVedtakCallback);

  return (
    <Row>
      <Column xs="6">
        {!readOnly && (
          <Hovedknapp
            mini
            className={styles.mainButton}
            onClick={formProps.handleSubmit}
            disabled={behandlingPaaVent || formProps.submitting}
            spinner={formProps.submitting}
          >
            {intl.formatMessage({ id: 'VedtakKlageForm.TilGodkjenning' })}
          </Hovedknapp>
        )}
        <a
          href=""
          onClick={previewBrev}
          onKeyDown={e => (e.keyCode === 13 ? previewBrev(e) : null)}
          className={classNames('lenke lenke--frittstaende')}
        >
          <FormattedMessage id="VedtakKlageForm.ForhandvisBrev" />
        </a>
      </Column>
    </Row>
  );
};

VedtakKlageSubmitPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  previewVedtakCallback: PropTypes.func.isRequired,
  behandlingPaaVent: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  formProps: PropTypes.shape().isRequired,
};

export default injectIntl(VedtakKlageSubmitPanelImpl);

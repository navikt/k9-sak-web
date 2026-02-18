import { Button, HGrid, Link } from '@navikt/ds-react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';

import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import styles from './vedtakKlageSubmitPanel.module.css';

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

export const VedtakKlageSubmitPanelImpl = ({ intl, behandlingPåVent, previewVedtakCallback, formProps, readOnly }) => {
  const previewBrev = getPreviewCallback(formProps, previewVedtakCallback);

  return (
    <HGrid gap="space-4" columns={{ xs: '6fr 6fr' }}>
      <div>
        {!readOnly && (
          <Button
            variant="primary"
            size="small"
            className={styles.mainButton}
            onClick={formProps.handleSubmit}
            disabled={behandlingPåVent || formProps.submitting}
            loading={formProps.submitting}
          >
            {intl.formatMessage({ id: 'VedtakKlageForm.TilGodkjenning' })}
          </Button>
        )}
        <Link
          href=""
          onClick={previewBrev}
          onKeyDown={e => (e.keyCode === 13 ? previewBrev(e) : null)}
          className={classNames('lenke lenke--frittstaende')}
          data-testid="previewLink"
        >
          <FormattedMessage id="VedtakKlageForm.ForhandvisBrev" />
        </Link>
      </div>
    </HGrid>
  );
};

VedtakKlageSubmitPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  previewVedtakCallback: PropTypes.func.isRequired,
  behandlingPåVent: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  formProps: PropTypes.shape().isRequired,
};

export default injectIntl(VedtakKlageSubmitPanelImpl);

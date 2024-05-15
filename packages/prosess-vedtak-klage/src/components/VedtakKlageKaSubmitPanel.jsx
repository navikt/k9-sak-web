import { Button, HGrid } from '@navikt/ds-react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';

import styles from './vedtakKlageSubmitPanel.module.css';

const medholdIKlage = klageVurderingResultat =>
  klageVurderingResultat && klageVurderingResultat.klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE;

export const isMedholdIKlage = (klageVurderingResultatNFP, klageVurderingResultatNK) =>
  medholdIKlage(klageVurderingResultatNFP) || medholdIKlage(klageVurderingResultatNK);

const getBrevKode = (klageVurdering, klageVurdertAvKa) => {
  switch (klageVurdering) {
    case klageVurderingType.STADFESTE_YTELSESVEDTAK:
      return klageVurdertAvKa
        ? dokumentMalType.KLAGE_YTELSESVEDTAK_STADFESTET_DOK
        : dokumentMalType.KLAGE_OVERSENDT_KLAGEINSTANS_DOK;
    case klageVurderingType.OPPHEVE_YTELSESVEDTAK:
      return dokumentMalType.KLAGE_YTELSESVEDTAK_OPPHEVET_DOK;
    case klageVurderingType.HJEMSENDE_UTEN_Å_OPPHEVE:
      return dokumentMalType.KLAGE_YTELSESVEDTAK_OPPHEVET_DOK;
    case klageVurderingType.MEDHOLD_I_KLAGE:
      return dokumentMalType.VEDTAK_MEDHOLD;
    case klageVurderingType.AVVIS_KLAGE:
      return dokumentMalType.KLAGE_AVVIST_DOK;
    default:
      return null;
  }
};

const getPreviewCallback = (formProps, begrunnelse, previewVedtakCallback, klageResultat) => e => {
  const klageVurdertAvNK = klageResultat.klageVurdertAv === 'KA';
  const data = {
    dokumentdata: begrunnelse && { fritekst: begrunnelse },
    dokumentMal: getBrevKode(klageResultat.klageVurdering, klageVurdertAvNK),
  };
  if (formProps.valid || formProps.pristine) {
    previewVedtakCallback(data);
  } else {
    formProps.submit();
  }
  e.preventDefault();
};

export const VedtakKlageKaSubmitPanelImpl = ({
  intl,
  behandlingPaaVent,
  previewVedtakCallback,
  begrunnelse,
  klageResultat,
  formProps,
  readOnly,
}) => {
  const previewBrev = getPreviewCallback(formProps, begrunnelse, previewVedtakCallback, klageResultat);

  return (
    <HGrid gap="1" columns={{ xs: '8fr 4fr' }}>
      <div>
        {!readOnly && (
          <Button
            variant="primary"
            size="small"
            className={styles.mainButton}
            onClick={formProps.handleSubmit}
            disabled={behandlingPaaVent || formProps.submitting || klageResultat.godkjentAvMedunderskriver}
            loading={formProps.submitting}
          >
            {intl.formatMessage({ id: 'VedtakKlageForm.TilGodkjenningKa' })}
          </Button>
        )}
        {!readOnly && (
          <Button
            variant="primary"
            size="small"
            className={styles.mainButton}
            onClick={formProps.handleSubmit}
            disabled={behandlingPaaVent || formProps.submitting || !klageResultat.godkjentAvMedunderskriver}
            loading={formProps.submitting}
          >
            {intl.formatMessage({ id: 'VedtakKlageForm.FerdigstillKlageKa' })}
          </Button>
        )}
        <a
          href=""
          onClick={previewBrev}
          onKeyDown={e => (e.keyCode === 13 ? previewBrev(e) : null)}
          className={classNames('lenke lenke--frittstaende')}
        >
          <FormattedMessage id="VedtakKlageForm.ForhandvisBrev" />
        </a>
      </div>
    </HGrid>
  );
};

VedtakKlageKaSubmitPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  previewVedtakCallback: PropTypes.func.isRequired,
  behandlingPaaVent: PropTypes.bool.isRequired,
  begrunnelse: PropTypes.string,
  klageResultat: PropTypes.shape(),
  readOnly: PropTypes.bool.isRequired,
  formProps: PropTypes.shape().isRequired,
};

VedtakKlageKaSubmitPanelImpl.defaultProps = {
  begrunnelse: undefined,
  klageResultat: undefined,
};

export default injectIntl(VedtakKlageKaSubmitPanelImpl);

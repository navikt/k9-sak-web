import React, { useEffect, useState } from 'react';

import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { FormattedMessage, useIntl } from 'react-intl';

import { Column, Row } from 'nav-frontend-grid';
import { Button } from '@navikt/ds-react';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  kanHaManueltFritekstbrev,
  TilgjengeligeVedtaksbrev,
  TilgjengeligeVedtaksbrevMedMaler,
} from '@fpsak-frontend/utils/src/formidlingUtils';

import AlertStripe from 'nav-frontend-alertstriper';
import styles from './vedtakForm.less';
import { validerManueltRedigertBrev } from './FritekstRedigering/RedigeringUtils';

interface Props {
  behandlingStatusKode: string;
  readOnly: boolean;
  behandlingPaaVent: boolean;
  isSubmitting: boolean;
  aksjonspunkter: Aksjonspunkt[];
  redigertHtml: string;
  tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev & TilgjengeligeVedtaksbrevMedMaler;
  handleSubmit: (e) => void;
}

const kanSendesTilGodkjenning = behandlingStatusKode =>
  behandlingStatusKode === behandlingStatusCode.BEHANDLING_UTREDES;

const VedtakSubmit = ({
  behandlingStatusKode,
  readOnly,
  behandlingPaaVent,
  isSubmitting,
  aksjonspunkter,
  redigertHtml,
  tilgjengeligeVedtaksbrev,
  handleSubmit,
}: Props): JSX.Element => {
  const intl = useIntl();

  const manueltBrevValidert =
    validerManueltRedigertBrev(redigertHtml) || !kanHaManueltFritekstbrev(tilgjengeligeVedtaksbrev);

  const submitKnapp = (
    <Button
      variant="primary"
      className={styles.mainButton}
      disabled={behandlingPaaVent || isSubmitting || !manueltBrevValidert}
      loading={isSubmitting}
      onClick={handleSubmit}
      size="small"
      type="button"
    >
      {intl.formatMessage({
        id:
          aksjonspunkter && aksjonspunkter.some(ap => ap.erAktivt === true && ap.toTrinnsBehandling === true)
            ? 'VedtakForm.SendTilBeslutter'
            : 'VedtakForm.FattVedtak',
      })}
    </Button>
  );

  if (!kanSendesTilGodkjenning(behandlingStatusKode)) {
    return null;
  }
  return (
    <Row>
      <Column xs="12">
        {!readOnly && (
          <>
            <VerticalSpacer sixteenPx />
            {!manueltBrevValidert && (
              <>
                <AlertStripe type="feil">
                  <FormattedMessage id="RedigeringAvFritekstBrev.ManueltBrevIkkeEndret" />
                </AlertStripe>
                <VerticalSpacer sixteenPx />
              </>
            )}
            {submitKnapp}
            <VerticalSpacer sixteenPx />
          </>
        )}
      </Column>
    </Row>
  );
};

export default VedtakSubmit;

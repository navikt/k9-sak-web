import React from 'react';

import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { useIntl } from 'react-intl';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { Button, ErrorMessage } from '@navikt/ds-react';
import { Column, Row } from 'nav-frontend-grid';

import styles from './vedtakForm.less';

interface Props {
  behandlingStatusKode: string;
  readOnly: boolean;
  behandlingPaaVent: boolean;
  isSubmitting: boolean;
  aksjonspunkter: Aksjonspunkt[];
  handleSubmit: (e) => void;
  errorOnSubmit: string;
}

const kanSendesTilGodkjenning = (behandlingStatusKode: string) =>
  behandlingStatusKode === behandlingStatusCode.BEHANDLING_UTREDES;

const VedtakSubmit = ({
  behandlingStatusKode,
  readOnly,
  behandlingPaaVent,
  isSubmitting,
  aksjonspunkter,
  handleSubmit,
  errorOnSubmit,
}: Props): JSX.Element => {
  const intl = useIntl();

  const skalSubmitVæreDeaktivert = behandlingPaaVent || isSubmitting;

  const submitKnapp = (
    <Button
      variant="primary"
      className={styles.mainButton}
      disabled={skalSubmitVæreDeaktivert}
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
            {submitKnapp}
            <VerticalSpacer sixteenPx />
            {errorOnSubmit && <ErrorMessage size="small">{errorOnSubmit}</ErrorMessage>}
          </>
        )}
      </Column>
    </Row>
  );
};

export default VedtakSubmit;

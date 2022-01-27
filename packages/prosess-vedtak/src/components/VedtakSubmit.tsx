import React from 'react';

import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { useIntl } from 'react-intl';

import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Aksjonspunkt } from '@k9-sak-web/types';

import styles from './vedtakForm.less';

interface Props {
  behandlingStatusKode: string;
  readOnly: boolean;
  behandlingPaaVent: boolean;
  isSubmitting: boolean;
  aksjonspunkter: Aksjonspunkt[];
}

const kanSendesTilGodkjenning = behandlingStatusKode =>
  behandlingStatusKode === behandlingStatusCode.BEHANDLING_UTREDES;

export default function VedtakSubmit({
  behandlingStatusKode,
  readOnly,
  behandlingPaaVent,
  isSubmitting,
  aksjonspunkter,
}: Props): JSX.Element {
  const intl = useIntl();

  if (!kanSendesTilGodkjenning(behandlingStatusKode)) {
    return null;
  }
  return (
    <Row>
      <Column xs="12">
        {!readOnly && (
          <Hovedknapp
            mini
            className={styles.mainButton}
            disabled={behandlingPaaVent || isSubmitting}
            spinner={isSubmitting}
          >
            {intl.formatMessage({
              id:
                aksjonspunkter && aksjonspunkter.some(ap => ap.erAktivt === true && ap.toTrinnsBehandling === true)
                  ? 'VedtakForm.TilGodkjenning'
                  : 'VedtakForm.FattVedtak',
            })}
          </Hovedknapp>
        )}
      </Column>
    </Row>
  );
}

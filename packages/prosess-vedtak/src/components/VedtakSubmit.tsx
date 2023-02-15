import React from 'react';

import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { useIntl } from 'react-intl';

import { Column, Row } from 'nav-frontend-grid';
import { Alert, BodyLong, Button } from '@navikt/ds-react';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import styles from './vedtakForm.less';
import { SjekkTilbakekrevingType } from './VedtakForm';

interface Props {
  behandlingStatusKode: string;
  readOnly: boolean;
  behandlingPaaVent: boolean;
  isSubmitting: boolean;
  aksjonspunkter: Aksjonspunkt[];
  sjekkTilbakekreving: SjekkTilbakekrevingType;
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
  sjekkTilbakekreving,
  handleSubmit,
}: Props): JSX.Element => {
  const intl = useIntl();

  const skalSubmitVæreDeaktivert =
    behandlingPaaVent ||
    isSubmitting ||
    (sjekkTilbakekreving.visAksjonspunkt &&
      sjekkTilbakekreving.harVurdertÅSjekkeTilbakekreving &&
      sjekkTilbakekreving.skalBehandleTilbakekrevingFørst) ||
    (sjekkTilbakekreving.visAksjonspunkt && !sjekkTilbakekreving.harVurdertÅSjekkeTilbakekreving);

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
        {sjekkTilbakekreving.skalBehandleTilbakekrevingFørst && (
          <>
            <VerticalSpacer twentyPx />
            <Alert className={styles.aksjonspunktAlert} variant="error" size="small">
              <BodyLong>{intl.formatMessage({ id: 'VedtakForm.BehandleTilbakekrevingFørst' })}</BodyLong>
            </Alert>
          </>
        )}

        {!readOnly && (
          <>
            <VerticalSpacer sixteenPx />
            {submitKnapp}
            <VerticalSpacer sixteenPx />
          </>
        )}
      </Column>
    </Row>
  );
};

export default VedtakSubmit;

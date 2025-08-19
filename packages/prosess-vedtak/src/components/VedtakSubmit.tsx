import { type JSX } from 'react';

import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { useIntl } from 'react-intl';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Button, ErrorMessage } from '@navikt/ds-react';

import { k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto } from '@navikt/k9-sak-typescript-client';
import styles from './vedtakForm.module.css';

interface Props {
  behandlingStatusKode: string;
  readOnly: boolean;
  behandlingPåVent: boolean;
  isSubmitting: boolean;
  aksjonspunkter: AksjonspunktDto[];
  handleSubmit: (e) => void;
  errorOnSubmit: string;
}

const kanSendesTilGodkjenning = (behandlingStatusKode: string) =>
  behandlingStatusKode === behandlingStatusCode.BEHANDLING_UTREDES;

const VedtakSubmit = ({
  behandlingStatusKode,
  readOnly,
  behandlingPåVent,
  isSubmitting,
  aksjonspunkter,
  handleSubmit,
  errorOnSubmit,
}: Props): JSX.Element => {
  const intl = useIntl();

  const skalSubmitVæreDeaktivert = behandlingPåVent || isSubmitting;

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
    !readOnly && (
      <>
        <VerticalSpacer sixteenPx />
        {submitKnapp}
        <VerticalSpacer sixteenPx />
        {errorOnSubmit && <ErrorMessage size="small">{errorOnSubmit}</ErrorMessage>}
      </>
    )
  );
};

export default VedtakSubmit;

import React from 'react';

import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { useIntl } from 'react-intl';

import { Column, Row } from 'nav-frontend-grid';
import { Button } from '@navikt/ds-react';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { DokumentDataType, LagreDokumentdataType } from '@k9-sak-web/types/src/dokumentdata';
import MellomLagreBrev from './brev/MellomLagreBrev';

import styles from './vedtakForm.less';

interface Props {
  behandlingStatusKode: string;
  readOnly: boolean;
  behandlingPaaVent: boolean;
  isSubmitting: boolean;
  aksjonspunkter: Aksjonspunkt[];
  handleSubmit: (e) => void;
  brødtekst: string;
  overskrift: string;
  inkluderKalender: boolean;
  dokumentdata: DokumentDataType;
  lagreDokumentdata: LagreDokumentdataType;
}

const kanSendesTilGodkjenning = behandlingStatusKode =>
  behandlingStatusKode === behandlingStatusCode.BEHANDLING_UTREDES;

export default function VedtakSubmit({
  behandlingStatusKode,
  readOnly,
  behandlingPaaVent,
  isSubmitting,
  aksjonspunkter,
  handleSubmit,
  lagreDokumentdata,
  dokumentdata,
  overskrift,
  brødtekst,
  inkluderKalender,
}: Props): JSX.Element {
  const intl = useIntl();

  const submitKnapp = (
    <Button
      variant="primary"
      className={styles.mainButton}
      disabled={behandlingPaaVent || isSubmitting}
      loading={isSubmitting}
      onClick={handleSubmit}
    >
      {intl.formatMessage({
        id:
          aksjonspunkter && aksjonspunkter.some(ap => ap.erAktivt === true && ap.toTrinnsBehandling === true)
            ? 'VedtakForm.TilGodkjenning'
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
          <MellomLagreBrev
            lagreDokumentdata={lagreDokumentdata}
            dokumentdata={dokumentdata}
            overskrift={overskrift}
            inkluderKalender={inkluderKalender}
            brødtekst={brødtekst}
            submitKnapp={submitKnapp}
          />
        )}
      </Column>
    </Row>
  );
}

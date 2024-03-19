import { Column, Row } from 'nav-frontend-grid';

import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { Image } from '@fpsak-frontend/shared-components';
import { Kodeverk } from '@k9-sak-web/types';
import { BodyShort, Button, Modal } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import styles from './iverksetterVedtakStatusModal.module.css';

interface OwnProps {
  lukkModal: () => void;
  visModal: boolean;
  behandlingsresultat?: {
    type: Kodeverk;
  };
}

/**
 * IverksetterVedtakStatusModal
 *
 * Presentasjonskomponent. Denne modalen vises etter en vilkarsvurdering der behandlingsstatusen
 * er satt til Iverksetter vedtak. Ved å trykke på knapp blir den NAV-ansatte tatt tilbake til sokesiden.
 */
const IverksetterVedtakStatusModal = ({
  intl,
  lukkModal,
  visModal,
  behandlingsresultat,
}: OwnProps & WrappedComponentProps) => {
  const erVedtakAvslatt = behandlingsresultat && behandlingsresultat.type.kode === behandlingResultatType.AVSLATT;
  const imageAltText = intl.formatMessage({
    id: erVedtakAvslatt ? 'IverksetterVedtakStatusModal.Avslatt' : 'IverksetterVedtakStatusModal.Innvilget',
  });

  return (
    <Modal className={styles.modal} open={visModal} aria-label={imageAltText} onClose={lukkModal}>
      <Modal.Body>
        <Row className="">
          <Column xs="1">
            <Image className={styles.image} alt={imageAltText} src={innvilgetImageUrl} />
            <div className={styles.divider} />
          </Column>
          <Column xs="9">
            <BodyShort size="small">
              <FormattedMessage
                id={
                  erVedtakAvslatt
                    ? 'IverksetterVedtakStatusModal.VedtakAvslatt'
                    : 'IverksetterVedtakStatusModal.VedtakInnvilet'
                }
              />
            </BodyShort>
            <BodyShort size="small">
              <FormattedMessage id="IverksetterVedtakStatusModal.GoToSearchPage" />
            </BodyShort>
          </Column>
          <Column xs="2">
            <Button variant="primary" size="small" className={styles.button} onClick={lukkModal} autoFocus>
              {intl.formatMessage({ id: 'IverksetterVedtakStatusModal.Ok' })}
            </Button>
          </Column>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default injectIntl(IverksetterVedtakStatusModal);

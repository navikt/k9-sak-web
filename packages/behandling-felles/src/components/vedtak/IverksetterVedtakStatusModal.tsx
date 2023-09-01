import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';

import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { Image } from '@fpsak-frontend/shared-components';
import { Kodeverk } from '@k9-sak-web/types';

import styles from './iverksetterVedtakStatusModal.css';

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
    <Modal
      className={styles.modal}
      isOpen={visModal}
      closeButton={false}
      contentLabel={imageAltText}
      onRequestClose={lukkModal}
      shouldCloseOnOverlayClick={false}
    >
      <Row className="">
        <Column xs="1">
          <Image className={styles.image} alt={imageAltText} src={innvilgetImageUrl} />
          <div className={styles.divider} />
        </Column>
        <Column xs="9">
          <Normaltekst>
            <FormattedMessage
              id={
                erVedtakAvslatt
                  ? 'IverksetterVedtakStatusModal.VedtakAvslatt'
                  : 'IverksetterVedtakStatusModal.VedtakInnvilet'
              }
            />
          </Normaltekst>
          <Normaltekst>
            <FormattedMessage id="IverksetterVedtakStatusModal.GoToSearchPage" />
          </Normaltekst>
        </Column>
        <Column xs="2">
          <Hovedknapp mini className={styles.button} onClick={lukkModal} autoFocus>
            {intl.formatMessage({ id: 'IverksetterVedtakStatusModal.Ok' })}
          </Hovedknapp>
        </Column>
      </Row>
    </Modal>
  );
};

export default injectIntl(IverksetterVedtakStatusModal);

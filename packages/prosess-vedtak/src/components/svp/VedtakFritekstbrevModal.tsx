import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { useState } from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

import infoImageUrl from '@fpsak-frontend/assets/images/behandle.svg';
import { isAvslag, isOpphor } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import Image from '@fpsak-frontend/shared-components/src/Image';

import styles from './vedtakFritekstbrevModal.less';

const isFritekstbrevRequired = (readOnly, behandlingsresultat, erSVP) => {
  if (readOnly || !erSVP) {
    return false;
  }
  const erAvslag = behandlingsresultat && isAvslag(behandlingsresultat.type.kode);
  const erOpphor = behandlingsresultat && isOpphor(behandlingsresultat.type.kode);
  return erAvslag || erOpphor;
};

/**
 * VedtakFritekstbrevModal
 *
 * Presentasjonskomponent. Denne modalen vises i vedtaksbildet når det er en åpen SVP behandling hvor
 * behandlingsresultatet er avslag eller opphør, samt hvis det er en revurdering med behandlingsresultat
 * som er ulikt opphør.
 *
 * Modalen skal endres/slettes etter hvert som støtte for brev blir implementert. Modalen blir kun brukt
 * som veiledning for å redusere ekstraarbeidet som oppstår i sammenheng med brev som ikke er implementert.
 *
 * Se https://jira.adeo.no/browse/TFP-738 for mer informasjon.
 *
 */

interface VedtakFritekstbrevModalProps {
  intl: IntlShape;
  readOnly: boolean;
  behandlingsresultat: Record<string, any>;
  erSVP: boolean;
}

export const VedtakFritekstbrevModal = ({
  intl,
  readOnly,
  behandlingsresultat,
  erSVP,
}: VedtakFritekstbrevModalProps) => {
  const fritektsbrevRequired = isFritekstbrevRequired(readOnly, behandlingsresultat, erSVP);
  const [showModal, settShowModal] = useState(fritektsbrevRequired);
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {fritektsbrevRequired && (
        <Modal
          className={styles.modal}
          isOpen={showModal}
          closeButton={false}
          contentLabel="VedtakForm.SvpFritektsBrevModal.ModalDescription"
          onRequestClose={event => {
            if (event) event.preventDefault();
            settShowModal(false);
          }}
          shouldCloseOnOverlayClick={false}
          ariaHideApp={false}
        >
          <Row>
            <Column xs="1">
              <Image
                className={styles.image}
                src={infoImageUrl}
                alt={intl.formatMessage({ id: 'VedtakForm.SvpFritektsBrevModal.IngenAutomatiskVedtaksbrevImage' })}
              />
              <div className={styles.divider} />
            </Column>
            <Column xs="9">
              <Normaltekst>
                <FormattedMessage id="VedtakForm.SvpFritektsBrevModal.IngenAutomatiskVedtaksbrev" />
              </Normaltekst>
            </Column>
            <Column xs="2">
              <Hovedknapp
                mini
                className={styles.button}
                onClick={event => {
                  event.preventDefault();
                  settShowModal(false);
                }}
                autoFocus
              >
                <FormattedMessage id="VedtakForm.SvpFritektsBrevModal.Ok" />
              </Hovedknapp>
            </Column>
          </Row>
        </Modal>
      )}
    </>
  );
};

export default injectIntl(VedtakFritekstbrevModal);

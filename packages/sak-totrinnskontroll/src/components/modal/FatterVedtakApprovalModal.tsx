import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { Image } from '@fpsak-frontend/shared-components';
import { Behandlingsresultat, Kodeverk } from '@fpsak-frontend/types';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { useMemo } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import styles from './fatterVedtakApprovalModal.less';

/**
 * FatterVedtakApprovalModal
 *
 * Presentasjonskomponent. Denne modalen vises en lightbox etter at en beslutter har godkjent alle aksjonspunkter
 * med totrinnskontroll. Ved å trykke på knapp blir beslutter tatt tilbake til sokesiden.
 */

const isStatusFatterVedtak = (behandlingStatusKode: string) => behandlingStatusKode === behandlingStatus.FATTER_VEDTAK;

const isBehandlingsresultatOpphor = (behandlingsresultat: Behandlingsresultat) =>
  behandlingsresultat && behandlingsresultat.type.kode === behandlingResultatType.OPPHOR;

const getAltImgTextCode = (ytelseType: Kodeverk) =>
  ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD
    ? 'FatterVedtakApprovalModal.InnvilgetES'
    : 'FatterVedtakApprovalModal.InnvilgetFP';

const getInfoTextCode = (
  behandlingtypeKode: string,
  behandlingsresultat: Behandlingsresultat,
  harSammeResultatSomOriginalBehandling: boolean,
  ytelseType: Kodeverk,
  erKlageWithKA: boolean,
  isOpphor: boolean,
) => {
  if (behandlingtypeKode === BehandlingType.TILBAKEKREVING) {
    return 'FatterVedtakApprovalModal.Tilbakekreving';
  }
  if (behandlingtypeKode === BehandlingType.KLAGE) {
    if (erKlageWithKA) {
      return 'FatterVedtakApprovalModal.ModalDescriptionKlageKA';
    }
    return 'FatterVedtakApprovalModal.ModalDescriptionKlage';
  }
  if (harSammeResultatSomOriginalBehandling) {
    return 'FatterVedtakApprovalModal.UendretUtfall';
  }
  if (behandlingsresultat.type.kode === behandlingResultatType.AVSLATT) {
    if (ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD) {
      return 'FatterVedtakApprovalModal.IkkeInnvilgetES';
    }
    if (ytelseType.kode === fagsakYtelseType.SVANGERSKAPSPENGER) {
      return 'FatterVedtakApprovalModal.IkkeInnvilgetSVP';
    }
    return 'FatterVedtakApprovalModal.IkkeInnvilgetFP';
  }
  if (isOpphor) {
    return 'FatterVedtakApprovalModal.OpphortForeldrepenger';
  }
  if (ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD) {
    return 'FatterVedtakApprovalModal.InnvilgetEngangsstonad';
  }
  if (ytelseType.kode === fagsakYtelseType.SVANGERSKAPSPENGER) {
    return 'FatterVedtakApprovalModal.InnvilgetSvangerskapspenger';
  }
  return 'FatterVedtakApprovalModal.InnvilgetForeldrepenger';
};

const getModalDescriptionTextCode = (
  isOpphor: boolean,
  ytelseType: Kodeverk,
  erKlageWithKA: boolean,
  behandlingTypeKode: string,
) => {
  if (behandlingTypeKode === BehandlingType.KLAGE) {
    if (erKlageWithKA) {
      return 'FatterVedtakApprovalModal.ModalDescriptionKlageKA';
    }
    return 'FatterVedtakApprovalModal.ModalDescriptionKlage';
  }
  if (isOpphor) {
    return 'FatterVedtakApprovalModal.ModalDescriptionOpphort';
  }
  if (ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD) {
    return 'FatterVedtakApprovalModal.ModalDescriptionESApproval';
  }
  if (ytelseType.kode === fagsakYtelseType.SVANGERSKAPSPENGER) {
    return 'FatterVedtakApprovalModal.ModalDescriptionSVPApproval';
  }
  return 'FatterVedtakApprovalModal.ModalDescriptionFPApproval';
};

interface FatterVedtakApprovalModalProps {
  allAksjonspunktApproved: boolean;
  behandlingsresultat: Behandlingsresultat;
  behandlingStatusKode: string;
  behandlingTypeKode: string;
  closeEvent: () => void;
  erGodkjenningFerdig: boolean;
  erKlageWithKA: boolean;
  fagsakYtelse: Kodeverk;
  harSammeResultatSomOriginalBehandling?: boolean;
  showModal?: boolean;
}

const getData = (
  allAksjonspunktApproved: boolean,
  behandlingsresultat: Behandlingsresultat,
  behandlingStatusKode: string,
  behandlingTypeKode: string,
  erGodkjenningFerdig: boolean,
  erKlageWithKA: boolean,
  fagsakYtelse: Kodeverk,
  harSammeResultatSomOriginalBehandling: boolean,
) => {
  if (!allAksjonspunktApproved) {
    return {
      infoTextCode: 'FatterVedtakApprovalModal.VedtakReturneresTilSaksbehandler',
      altImgTextCode: isStatusFatterVedtak(behandlingStatusKode) ? getAltImgTextCode(fagsakYtelse) : '',
      modalDescriptionTextCode: isStatusFatterVedtak(behandlingStatusKode)
        ? getModalDescriptionTextCode(
            isBehandlingsresultatOpphor(behandlingsresultat),
            fagsakYtelse,
            erKlageWithKA,
            behandlingTypeKode,
          )
        : 'FatterVedtakApprovalModal.ModalDescription',
      resolveProsessAksjonspunkterSuccess: erGodkjenningFerdig,
    };
  }
  return {
    infoTextCode: isStatusFatterVedtak(behandlingStatusKode)
      ? getInfoTextCode(
          behandlingTypeKode,
          behandlingsresultat,
          harSammeResultatSomOriginalBehandling,
          fagsakYtelseType,
          erKlageWithKA,
          isBehandlingsresultatOpphor(behandlingsresultat),
        )
      : '',
    altImgTextCode: isStatusFatterVedtak(behandlingStatusKode) ? getAltImgTextCode(fagsakYtelse) : '',
    modalDescriptionTextCode: isStatusFatterVedtak(behandlingStatusKode)
      ? getModalDescriptionTextCode(
          isBehandlingsresultatOpphor(behandlingsresultat),
          fagsakYtelse,
          erKlageWithKA,
          behandlingTypeKode,
        )
      : 'FatterVedtakApprovalModal.ModalDescription',
    resolveProsessAksjonspunkterSuccess: erGodkjenningFerdig,
  };
};

const FatterVedtakApprovalModal = ({
  allAksjonspunktApproved,
  behandlingsresultat,
  behandlingStatusKode,
  behandlingTypeKode,
  closeEvent,
  erGodkjenningFerdig,
  erKlageWithKA,
  fagsakYtelse,
  harSammeResultatSomOriginalBehandling,
  intl,
  showModal,
}: FatterVedtakApprovalModalProps & WrappedComponentProps) => {
  const data = useMemo(
    () =>
      getData(
        allAksjonspunktApproved,
        behandlingsresultat,
        behandlingStatusKode,
        behandlingTypeKode,
        erGodkjenningFerdig,
        erKlageWithKA,
        fagsakYtelse,
        harSammeResultatSomOriginalBehandling,
      ),
    [
      allAksjonspunktApproved,
      behandlingStatusKode,
      behandlingTypeKode,
      behandlingsresultat,
      erGodkjenningFerdig,
      erKlageWithKA,
      fagsakYtelse,
      harSammeResultatSomOriginalBehandling,
    ],
  );

  let localShowModal = false;

  if (showModal !== undefined) {
    localShowModal = showModal;
  } else if (!localShowModal) {
    localShowModal = !!data.resolveProsessAksjonspunkterSuccess;
  }

  return (
    <Modal
      className={styles.modal}
      isOpen={localShowModal}
      closeButton={false}
      contentLabel={intl.formatMessage({ id: data.modalDescriptionTextCode })}
      onRequestClose={closeEvent}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
      style={{ overlay: { zIndex: 3000 } }}
    >
      <Row>
        <Column xs="1">
          <Image
            className={styles.image}
            alt={intl.formatMessage({ id: data.altImgTextCode })}
            src={innvilgetImageUrl}
          />
          <div className={styles.divider} />
        </Column>
        <Column xs="9">
          <Normaltekst>
            <FormattedMessage id={data.infoTextCode} />
          </Normaltekst>
          <Normaltekst>
            <FormattedMessage id="FatterVedtakApprovalModal.GoToSearchPage" />
          </Normaltekst>
        </Column>
        <Column xs="2">
          <Hovedknapp mini className={styles.button} onClick={closeEvent} autoFocus>
            {intl.formatMessage({ id: 'FatterVedtakApprovalModal.Ok' })}
          </Hovedknapp>
        </Column>
      </Row>
    </Modal>
  );
};

export default injectIntl(FatterVedtakApprovalModal);

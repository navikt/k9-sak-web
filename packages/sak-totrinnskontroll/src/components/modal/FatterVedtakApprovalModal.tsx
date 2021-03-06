import React, { FunctionComponent } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';

import { Image } from '@fpsak-frontend/shared-components';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { Behandling, Kodeverk } from '@k9-sak-web/types';

import erFagytelseTypeUtvidetRett from '@k9-sak-web/behandling-utvidet-rett/src/utils/erFagytelseTypeUtvidetRett';
import styles from './fatterVedtakApprovalModal.less';

const getInfoTextCode = (
  behandlingtypeKode: string,
  behandlingsresultat: Behandling['behandlingsresultat'],
  harSammeResultatSomOriginalBehandling: boolean,
  ytelseType: Kodeverk,
  erKlageWithKA: boolean,
  isOpphor: boolean,
) => {
  // HVIS TILBAKEKREVING
  if (behandlingtypeKode === BehandlingType.TILBAKEKREVING) {
    return 'FatterVedtakApprovalModal.Tilbakekreving';
  }
  if (behandlingtypeKode === BehandlingType.TILBAKEKREVING_REVURDERING) {
    return 'FatterVedtakApprovalModal.TilbakekrevingRevurdering';
  }
  // HVIS KLAGE
  if (behandlingtypeKode === BehandlingType.KLAGE) {
    if (erKlageWithKA) {
      return 'FatterVedtakApprovalModal.ModalDescriptionKlageKA';
    }
    return 'FatterVedtakApprovalModal.ModalDescriptionKlage';
  }
  // HVIS INGEN ENDRING
  if (harSammeResultatSomOriginalBehandling) {
    return 'FatterVedtakApprovalModal.UendretUtfall';
  }
  // HVIS AVSLÅTT
  if (behandlingsresultat?.type.kode === behandlingResultatType.AVSLATT) {
    if (ytelseType.kode === FagsakYtelseType.PLEIEPENGER) {
      return 'FatterVedtakApprovalModal.IkkeInnvilgetPleiepenger';
    }
    if (ytelseType.kode === FagsakYtelseType.FRISINN) {
      return 'FatterVedtakApprovalModal.IkkeInnvilgetFRISINN';
    }
    if (erFagytelseTypeUtvidetRett(ytelseType.kode)) {
      return 'FatterVedtakApprovalModal.IkkeInnvilgetUtvidetRett';
    }
    return 'FatterVedtakApprovalModal.IkkeInnvilgetOmsorgspenger';
  }
  // HVIS OPPHØRT
  if (isOpphor) {
    if (ytelseType.kode === FagsakYtelseType.PLEIEPENGER) {
      return 'FatterVedtakApprovalModal.OpphortPleiepenger';
    }
    if (ytelseType.kode === FagsakYtelseType.FRISINN) {
      return 'FatterVedtakApprovalModal.OpphortFRISINN';
    }
    if (erFagytelseTypeUtvidetRett(ytelseType.kode)) {
      return 'FatterVedtakApprovalModal.OpphortUtvidetRett';
    }
    return 'FatterVedtakApprovalModal.OpphortOmsorgpenger';
  }

  // HVIS INNVILGET
  if (ytelseType.kode === FagsakYtelseType.FRISINN) {
    return 'FatterVedtakApprovalModal.InnvilgetFRISINN';
  }
  if (ytelseType.kode === FagsakYtelseType.PLEIEPENGER) {
    return 'FatterVedtakApprovalModal.InnvilgetPleiepenger';
  }
  if (erFagytelseTypeUtvidetRett(ytelseType.kode)) {
    return 'FatterVedtakApprovalModal.InnvilgetUtvidetRett';
  }
  return 'FatterVedtakApprovalModal.InnvilgetOmsorgspenger';
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
  if (ytelseType.kode === FagsakYtelseType.FRISINN) {
    return 'FatterVedtakApprovalModal.ModalDescriptionFRISINNApproval';
  }
  if (ytelseType.kode === FagsakYtelseType.PLEIEPENGER) {
    return 'FatterVedtakApprovalModal.ModalDescriptionPleiePengerApproval';
  }
  if (erFagytelseTypeUtvidetRett(ytelseType.kode)) {
    return 'FatterVedtakApprovalModal.ModalDescriptionUtvidetRettApproval';
  }
  return 'FatterVedtakApprovalModal.ModalDescriptionOMSApproval';
};

const isStatusFatterVedtak = (behandlingStatusKode: string) => behandlingStatusKode === behandlingStatus.FATTER_VEDTAK;

const utledInfoTextCode = (
  allAksjonspunktApproved: boolean,
  behandlingStatusKode: string,
  behandlingTypeKode: string,
  behandlingsresultat: Behandling['behandlingsresultat'],
  harSammeResultatSomOriginalBehandling: boolean,
  fagsakYtelseType: Kodeverk,
  erKlageWithKA: boolean,
  isBehandlingsresultatOpphor: boolean,
) => {
  if (allAksjonspunktApproved) {
    return isStatusFatterVedtak(behandlingStatusKode)
      ? getInfoTextCode(
          behandlingTypeKode,
          behandlingsresultat,
          harSammeResultatSomOriginalBehandling,
          fagsakYtelseType,
          erKlageWithKA,
          isBehandlingsresultatOpphor,
        )
      : '';
  }
  return 'FatterVedtakApprovalModal.VedtakReturneresTilSaksbehandler';
};

const getAltImgTextCode = (ytelseType: Kodeverk) => {
  switch (ytelseType.kode) {
    case FagsakYtelseType.FRISINN:
      return 'FatterVedtakApprovalModal.InnvilgetFRISINN';
    case FagsakYtelseType.PLEIEPENGER:
      return 'FatterVedtakApprovalModal.InnvilgetPleiepenger';
    default:
      return 'FatterVedtakApprovalModal.InnvilgetOmsorgspenger';
  }
};

const utledAltImgTextCode = (behandlingStatusKode: string, fagsakYtelseType: Kodeverk) =>
  isStatusFatterVedtak(behandlingStatusKode) ? getAltImgTextCode(fagsakYtelseType) : '';

const utledModalDescriptionTextCode = (
  behandlingStatusKode: string,
  fagsakYtelseType: Kodeverk,
  erKlageWithKA: boolean,
  behandlingTypeKode: string,
  isBehandlingsresultatOpphor: boolean,
) =>
  isStatusFatterVedtak(behandlingStatusKode)
    ? getModalDescriptionTextCode(isBehandlingsresultatOpphor, fagsakYtelseType, erKlageWithKA, behandlingTypeKode)
    : 'FatterVedtakApprovalModal.ModalDescription';

interface OwnProps {
  closeEvent: () => void;
  allAksjonspunktApproved: boolean;
  fagsakYtelseType: Kodeverk;
  erKlageWithKA?: boolean;
  behandlingsresultat?: Behandling['behandlingsresultat'];
  behandlingId: number;
  behandlingStatusKode: string;
  behandlingTypeKode: string;
  harSammeResultatSomOriginalBehandling?: boolean;
}

/**
 * FatterVedtakApprovalModal
 *
 * Presentasjonskomponent. Denne modalen vises en lightbox etter at en beslutter har godkjent alle aksjonspunkter
 * med totrinnskontroll. Ved å trykke på knapp blir beslutter tatt tilbake til sokesiden.
 */
const FatterVedtakApprovalModal: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  closeEvent,
  allAksjonspunktApproved,
  behandlingStatusKode,
  behandlingTypeKode,
  behandlingsresultat,
  harSammeResultatSomOriginalBehandling,
  fagsakYtelseType,
  erKlageWithKA,
}) => {
  const isBehandlingsresultatOpphor =
    behandlingsresultat && behandlingsresultat.type.kode === behandlingResultatType.OPPHOR;
  const infoTextCode = utledInfoTextCode(
    allAksjonspunktApproved,
    behandlingStatusKode,
    behandlingTypeKode,
    behandlingsresultat,
    harSammeResultatSomOriginalBehandling,
    fagsakYtelseType,
    erKlageWithKA,
    isBehandlingsresultatOpphor,
  );

  const altImgTextCode = utledAltImgTextCode(behandlingStatusKode, fagsakYtelseType);

  const modalDescriptionTextCode = utledModalDescriptionTextCode(
    behandlingStatusKode,
    fagsakYtelseType,
    erKlageWithKA,
    behandlingTypeKode,
    isBehandlingsresultatOpphor,
  );

  return (
    <Modal
      className={styles.modal}
      isOpen
      closeButton={false}
      contentLabel={intl.formatMessage({ id: modalDescriptionTextCode })}
      onRequestClose={closeEvent}
      shouldCloseOnOverlayClick={false}
    >
      <Row>
        <Column xs="1">
          <Image className={styles.image} alt={intl.formatMessage({ id: altImgTextCode })} src={innvilgetImageUrl} />
          <div className={styles.divider} />
        </Column>
        <Column xs="9">
          <Normaltekst>
            <FormattedMessage id={infoTextCode} />
          </Normaltekst>
          <Normaltekst>
            <FormattedMessage id="FatterVedtakApprovalModal.GoToSearchPage" />
          </Normaltekst>
        </Column>
        <Column xs="2">
          <Hovedknapp mini className={styles.button} onClick={closeEvent} autoFocus>
            <FormattedMessage id="FatterVedtakApprovalModal.Ok" />
          </Hovedknapp>
        </Column>
      </Row>
    </Modal>
  );
};

export default injectIntl(FatterVedtakApprovalModal);

import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { Image } from '@fpsak-frontend/shared-components';
import { erFagytelseTypeUtvidetRett } from '@k9-sak-web/behandling-utvidet-rett/src/utils/utvidetRettHjelpfunksjoner';
import { Behandling, Kodeverk } from '@k9-sak-web/types';
import { BodyShort, Button, HGrid, Modal } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import styles from './fatterVedtakApprovalModal.module.css';

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
    if (ytelseType.kode === FagsakYtelseType.PLEIEPENGER_SLUTTFASE) {
      return 'FatterVedtakApprovalModal.IkkeInnvilgetLivetsSluttfase';
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
    if (ytelseType.kode === FagsakYtelseType.PLEIEPENGER_SLUTTFASE) {
      return 'FatterVedtakApprovalModal.OpphortLivetsSluttfase';
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
  if (ytelseType.kode === FagsakYtelseType.PLEIEPENGER_SLUTTFASE) {
    return 'FatterVedtakApprovalModal.InnvilgetLivetsSluttfase';
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
  if (ytelseType.kode === FagsakYtelseType.PLEIEPENGER_SLUTTFASE) {
    return 'FatterVedtakApprovalModal.ModalDescriptionLivetsSluttfase';
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
    case FagsakYtelseType.PLEIEPENGER_SLUTTFASE:
      return 'FatterVedtakApprovalModal.InnvilgetLivetsSluttfase';
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
const FatterVedtakApprovalModal = ({
  intl,
  closeEvent,
  allAksjonspunktApproved,
  behandlingStatusKode,
  behandlingTypeKode,
  behandlingsresultat,
  harSammeResultatSomOriginalBehandling,
  fagsakYtelseType,
  erKlageWithKA,
}: OwnProps & WrappedComponentProps) => {
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
      open
      aria-label={intl.formatMessage({ id: modalDescriptionTextCode })}
      onClose={closeEvent}
      width="small"
    >
      <Modal.Body>
        <HGrid gap="1" columns={{ xs: '1fr 9fr 2fr' }}>
          <div className="relative">
            <Image
              className={styles.image}
              alt={altImgTextCode ? intl.formatMessage({ id: altImgTextCode }) : ''}
              src={innvilgetImageUrl}
            />
            <div className={styles.divider} />
          </div>
          <div>
            <BodyShort size="small">
              <FormattedMessage id={infoTextCode} />
            </BodyShort>
            <BodyShort size="small">
              <FormattedMessage id="FatterVedtakApprovalModal.GoToSearchPage" />
            </BodyShort>
          </div>
          <div>
            <Button variant="primary" size="small" className={styles.button} onClick={closeEvent} autoFocus>
              <FormattedMessage id="FatterVedtakApprovalModal.Ok" />
            </Button>
          </div>
        </HGrid>
      </Modal.Body>
    </Modal>
  );
};

export default injectIntl(FatterVedtakApprovalModal);

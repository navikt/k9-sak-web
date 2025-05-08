import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { fagsakYtelsesType, FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Image } from '@fpsak-frontend/shared-components';
import { erFagytelseTypeUtvidetRett } from '@k9-sak-web/behandling-utvidet-rett/src/utils/utvidetRettHjelpfunksjoner';
import { Behandling } from '@k9-sak-web/types';
import { BodyShort, Button, HGrid, Modal } from '@navikt/ds-react';
import styles from './fatterVedtakApprovalModal.module.css';

const getInfoTextCode = (
  behandlingtypeKode: string,
  behandlingsresultat: Behandling['behandlingsresultat'],
  harSammeResultatSomOriginalBehandling: boolean,
  ytelseType: FagsakYtelsesType,
  erKlageWithKA: boolean,
  isOpphor: boolean,
) => {
  // HVIS TILBAKEKREVING
  if (behandlingtypeKode === BehandlingType.TILBAKEKREVING) {
    return 'Tilbakekreving er vedtatt og iverksatt';
  }
  if (behandlingtypeKode === BehandlingType.TILBAKEKREVING_REVURDERING) {
    return 'Tilbakekreving revurdering er vedtatt og iverksatt';
  }
  // HVIS KLAGE
  if (behandlingtypeKode === BehandlingType.KLAGE) {
    if (erKlageWithKA) {
      return 'Klagen returneres til saksbehandler for iverksettelse.';
    }
    return 'Resultatet av klagebehandlingen blir iverksatt.';
  }
  // HVIS INGEN ENDRING
  if (harSammeResultatSomOriginalBehandling) {
    return 'Resultat: Ingen endring, behandlingen avsluttes';
  }
  // HVIS AVSLÅTT
  if (behandlingsresultat?.type.kode === behandlingResultatType.AVSLATT) {
    if (ytelseType === fagsakYtelsesType.PLEIEPENGER_SYKT_BARN) {
      return 'Pleiepenger er avslått';
    }
    if (ytelseType === fagsakYtelsesType.FRISINN) {
      return 'FRISINN er avslått';
    }
    if (erFagytelseTypeUtvidetRett(ytelseType)) {
      return 'Ekstra omsorgsdager er avslått';
    }
    if (ytelseType === fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE) {
      return 'Pleiepenger i livets sluttfase er avslått';
    }
    return 'Omsorgspenger er avslått';
  }
  // HVIS OPPHØRT
  if (isOpphor) {
    if (ytelseType === fagsakYtelsesType.PLEIEPENGER_SYKT_BARN) {
      return 'Pleiepenger er opphørt.';
    }
    if (ytelseType === fagsakYtelsesType.FRISINN) {
      return 'FRISINN er opphørt.';
    }
    if (erFagytelseTypeUtvidetRett(ytelseType)) {
      return 'Ekstra omsorgsdager er opphørt.';
    }
    if (ytelseType === fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE) {
      return 'Pleiepenger i livet sluttfase er opphørt.';
    }
    return 'Omsorgspenger er opphørt.';
  }

  // HVIS INNVILGET
  if (ytelseType === fagsakYtelsesType.FRISINN) {
    return 'Engangsstønad er innvilget og vedtaket blir iverksatt';
  }
  if (ytelseType === fagsakYtelsesType.PLEIEPENGER_SYKT_BARN) {
    return 'Pleiepenger er innvilget og vedtaket blir iverksatt';
  }
  if (erFagytelseTypeUtvidetRett(ytelseType)) {
    return 'Ekstra omsorgsdager er innvilget og vedtaket blir iverksatt';
  }
  if (ytelseType === fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE) {
    return 'Pleiepenger i livets sluttfase er innvilget og vedtaket blir iverksatt';
  }
  return 'Omsorgspenger er innvilget og vedtaket blir iverksatt';
};

const getModalDescriptionTextCode = (
  isOpphor: boolean,
  ytelseType: FagsakYtelsesType,
  erKlageWithKA: boolean,
  behandlingTypeKode: string,
) => {
  if (behandlingTypeKode === BehandlingType.KLAGE) {
    if (erKlageWithKA) {
      return 'Klagen returneres til saksbehandler for iverksettelse.';
    }
    return 'Resultatet av klagebehandlingen blir iverksatt.';
  }
  if (isOpphor) {
    return 'Pleiepenger er opphørt. Du kommer nå til forsiden.';
  }
  if (ytelseType === fagsakYtelsesType.FRISINN) {
    return 'FRISINN er innvilget og vedtaket blir iverksatt. Du kommer nå til forsiden.';
  }
  if (ytelseType === fagsakYtelsesType.PLEIEPENGER_SYKT_BARN) {
    return 'Pleiepenger er innvilget og vedtaket blir iverksatt. Du kommer nå til forsiden.';
  }
  if (erFagytelseTypeUtvidetRett(ytelseType)) {
    return 'Ekstra omsorgsdager er innvilget og vedtaket blir iverksatt. Du kommer nå til forsiden.';
  }
  if (ytelseType === fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE) {
    return 'Pleiepenger i livets sluttfase er innvilget og vedtaket blir iverksatt. Du kommer nå til forsiden.';
  }
  return 'Omsorgspenger er innvilget og vedtaket blir iverksatt. Du kommer nå til forsiden.';
};

const isStatusFatterVedtak = (behandlingStatusKode: string) => behandlingStatusKode === behandlingStatus.FATTER_VEDTAK;

const utledInfoTextCode = (
  allAksjonspunktApproved: boolean,
  behandlingStatusKode: string,
  behandlingTypeKode: string,
  behandlingsresultat: Behandling['behandlingsresultat'],
  harSammeResultatSomOriginalBehandling: boolean,
  fagsakYtelseType: FagsakYtelsesType,
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
  return 'Vedtak returneres til saksbehandler for ny vurdering.';
};

const getAltImgTextCode = (ytelseType: FagsakYtelsesType) => {
  switch (ytelseType) {
    case fagsakYtelsesType.FRISINN:
      return 'Engangsstønad er innvilget og vedtaket blir iverksatt.';
    case fagsakYtelsesType.PLEIEPENGER_SYKT_BARN:
      return 'Pleiepenger er innvilget og vedtaket blir iverksatt.';
    case fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE:
      return 'Pleiepenger i livets sluttfase er innvilget og vedtaket blir iverksatt.';
    default:
      return 'Omsorgspenger er innvilget og vedtaket blir iverksatt.';
  }
};

const utledAltImgTextCode = (behandlingStatusKode: string, fagsakYtelseType: FagsakYtelsesType) =>
  isStatusFatterVedtak(behandlingStatusKode) ? getAltImgTextCode(fagsakYtelseType) : '';

const utledModalDescriptionTextCode = (
  behandlingStatusKode: string,
  fagsakYtelseType: FagsakYtelsesType,
  erKlageWithKA: boolean,
  behandlingTypeKode: string,
  isBehandlingsresultatOpphor: boolean,
) =>
  isStatusFatterVedtak(behandlingStatusKode)
    ? getModalDescriptionTextCode(isBehandlingsresultatOpphor, fagsakYtelseType, erKlageWithKA, behandlingTypeKode)
    : 'Forslag til vedtak er sendt til beslutter. Du kommer nå til forsiden.';

interface OwnProps {
  closeEvent: () => void;
  allAksjonspunktApproved: boolean;
  fagsakYtelseType: FagsakYtelsesType;
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
  closeEvent,
  allAksjonspunktApproved,
  behandlingStatusKode,
  behandlingTypeKode,
  behandlingsresultat,
  harSammeResultatSomOriginalBehandling,
  fagsakYtelseType,
  erKlageWithKA,
}: OwnProps) => {
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

  const altImgText = utledAltImgTextCode(behandlingStatusKode, fagsakYtelseType);

  const modalDescriptionText = utledModalDescriptionTextCode(
    behandlingStatusKode,
    fagsakYtelseType,
    erKlageWithKA,
    behandlingTypeKode,
    isBehandlingsresultatOpphor,
  );

  return (
    <Modal className={styles.modal} open aria-label={modalDescriptionText} onClose={closeEvent}>
      <Modal.Body>
        <HGrid gap="1" columns={{ xs: '1fr 10fr 1fr' }}>
          <div className="relative">
            <Image className={styles.image} alt={altImgText ?? ''} src={innvilgetImageUrl} />
            <div className={styles.divider} />
          </div>
          <div>
            <BodyShort size="small" data-testid="fatter-vedtak-text">
              {infoTextCode}
            </BodyShort>
            <BodyShort size="small">Du kommer nå til forsiden.</BodyShort>
          </div>
          <div>
            <Button variant="primary" size="small" className={styles.button} onClick={closeEvent} autoFocus>
              OK
            </Button>
          </div>
        </HGrid>
      </Modal.Body>
    </Modal>
  );
};

export default FatterVedtakApprovalModal;

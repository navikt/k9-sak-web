import { behandlingType as behandlingTypeKlage } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';
import { fagsakYtelsesType, type FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { erFagytelseTypeUtvidetRett } from '@k9-sak-web/gui/utils/utvidetRettHjelpfunksjoner.js';
import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HGrid, Modal } from '@navikt/ds-react';
import {
  k9_kodeverk_behandling_BehandlingResultatType as BehandlingsresultatType,
  k9_kodeverk_behandling_BehandlingStatus as BehandlingDtoStatus,
} from '@navikt/k9-sak-typescript-client';
import { type Behandling } from '../../types/Behandling';
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
  if (behandlingtypeKode === behandlingTypeKlage.TILBAKEKREVING) {
    return 'Tilbakekreving er vedtatt og iverksatt';
  }
  if (behandlingtypeKode === behandlingTypeKlage.REVURDERING_TILBAKEKREVING) {
    return 'Tilbakekreving revurdering er vedtatt og iverksatt';
  }
  // HVIS KLAGE
  if (behandlingtypeKode === behandlingTypeKlage.KLAGE) {
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
  if (behandlingsresultat?.type === BehandlingsresultatType.AVSLÅTT) {
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
    if (ytelseType === fagsakYtelsesType.OPPLÆRINGSPENGER) {
      return 'Opplæringspenger er avslått.';
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
    if (ytelseType === fagsakYtelsesType.OPPLÆRINGSPENGER) {
      return 'Opplæringspenger er opphørt.';
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
  if (ytelseType === fagsakYtelsesType.OPPLÆRINGSPENGER) {
    return 'Opplæringspenger er innvilget og vedtaket blir iverksatt.';
  }
  return 'Omsorgspenger er innvilget og vedtaket blir iverksatt';
};

const getModalDescriptionTextCode = (
  isOpphor: boolean,
  ytelseType: FagsakYtelsesType,
  erKlageWithKA: boolean,
  behandlingTypeKode: string,
) => {
  if (behandlingTypeKode === behandlingTypeKlage.KLAGE) {
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
  if (ytelseType === fagsakYtelsesType.OPPLÆRINGSPENGER) {
    return 'Opplæringspenger er innvilget og vedtaket blir iverksatt. Du kommer nå til forsiden.';
  }
  return 'Omsorgspenger er innvilget og vedtaket blir iverksatt. Du kommer nå til forsiden.';
};

const isStatusFatterVedtak = (behandlingStatusKode: string) =>
  behandlingStatusKode === BehandlingDtoStatus.FATTER_VEDTAK;

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
    behandlingsresultat && behandlingsresultat.type === BehandlingsresultatType.OPPHØR;
  const infoTextCode = utledInfoTextCode(
    allAksjonspunktApproved,
    behandlingStatusKode,
    behandlingTypeKode,
    behandlingsresultat,
    !!harSammeResultatSomOriginalBehandling,
    fagsakYtelseType,
    !!erKlageWithKA,
    !!isBehandlingsresultatOpphor,
  );

  const altImgText = utledAltImgTextCode(behandlingStatusKode, fagsakYtelseType);

  const modalDescriptionText = utledModalDescriptionTextCode(
    behandlingStatusKode,
    fagsakYtelseType,
    !!erKlageWithKA,
    behandlingTypeKode,
    !!isBehandlingsresultatOpphor,
  );

  return (
    <Modal className={styles.modal} open aria-label={modalDescriptionText} onClose={closeEvent}>
      <Modal.Body>
        <HGrid gap="1" columns={{ xs: '1fr 10fr 1fr' }}>
          <div className="relative">
            <CheckmarkCircleFillIcon
              title={altImgText}
              fontSize={30}
              style={{ color: 'var(--a-surface-success)', marginTop: '6px' }}
            />
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

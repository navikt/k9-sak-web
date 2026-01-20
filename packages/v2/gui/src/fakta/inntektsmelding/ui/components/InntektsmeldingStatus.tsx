import {
  CheckmarkCircleFillIcon,
  ExclamationmarkTriangleFillIcon,
  InformationSquareFillIcon,
} from '@navikt/aksel-icons';
import { Status } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/Status.js';

const statusTekster = {
  [Status.IKKE_PÅKREVD]: 'Ikke påkrevd',
  [Status.MANGLER]: 'Mangler',
  [Status.MOTTATT_IKKE_ANSATT]: 'Mottatt, men ikke ansatt',
  [Status.MOTTATT_UKJENT_ARBEIDSFORHOLDSID]: 'Mottatt, men inneholder ukjent arbeidsforhold-ID',
  [Status.FORTSETT_UTEN]: 'Fortsett uten',
  [Status.MOTTATT]: 'Mottatt',
};

const InntektsmeldingStatus = ({ status }: { status: Status }) => {
  const erMottatt = status === Status.MOTTATT;
  const erMangler = status === Status.MANGLER;
  const erIkkePåkrevd = status === Status.IKKE_PÅKREVD;

  if (erMangler) {
    return (
      <>
        <ExclamationmarkTriangleFillIcon fontSize="1.5rem" style={{ color: 'var(--ax-text-warning-decoration)' }} />
        <span className="ml-2">{statusTekster[status] ?? status}</span>
      </>
    );
  }

  if (erIkkePåkrevd) {
    return (
      <>
        <InformationSquareFillIcon fontSize={24} style={{ color: 'var(--ax-color-blue-500)' }} />
        <span className="ml-2">{statusTekster[status] ?? status}</span>
      </>
    );
  }

  return (
    <>
      <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--ax-bg-success-strong)' }} />
      <span className="ml-2">{erMottatt ? 'Mottatt' : (statusTekster[status] ?? status)}</span>
    </>
  );
};

export default InntektsmeldingStatus;

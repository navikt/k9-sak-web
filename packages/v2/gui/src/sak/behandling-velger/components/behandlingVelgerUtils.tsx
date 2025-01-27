import { BehandlingDtoBehandlingResultatType, type Periode } from '@k9-sak-web/backend/k9sak/generated';
import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import React from 'react';
import DateLabel from '../../../shared/dateLabel/DateLabel';
import type { Behandling } from '../types/Behandling';

export const getFormattedSøknadserioder = (søknadsperioder: Periode[]) =>
  søknadsperioder?.map((periode, index) => {
    if (periode.fom === periode.tom) {
      return (
        <React.Fragment key={periode.fom}>
          {index > 0 && ', '}
          <DateLabel dateString={periode.fom} />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment key={`${periode.fom}_${periode.tom}`}>
        {index > 0 && ', '}
        <DateLabel dateString={periode.fom} />
        {` - `}
        <DateLabel dateString={periode.tom} />
      </React.Fragment>
    );
  });

export const getStatusIcon = (behandlingsresultatTypeKode?: string, className?: string, erFerdigstilt?: boolean) => {
  if (behandlingsresultatTypeKode === BehandlingDtoBehandlingResultatType.IKKE_FASTSATT || !erFerdigstilt) {
    return (
      <ExclamationmarkTriangleFillIcon
        fontSize="1.25rem"
        className={className}
        style={{ color: 'var(--ac-alert-icon-warning-color,var(--a-icon-warning))' }}
        title="Under behandling"
      />
    );
  }

  if (behandlingsresultatTypeKode === BehandlingDtoBehandlingResultatType.INNVILGET) {
    return <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--a-surface-success)' }} />;
  }

  if (behandlingsresultatTypeKode === BehandlingDtoBehandlingResultatType.AVSLÅTT) {
    return <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--a-surface-danger)' }} />;
  }

  return null;
};

export const getStatusText = (
  behandlingsresultatTypeKode?: string,
  behandlingsresultatTypeNavn?: string,
  erFerdigstilt?: boolean,
) => {
  if (!erFerdigstilt) {
    return 'Ikke fastsatt';
  }
  if (behandlingsresultatTypeKode) {
    return behandlingsresultatTypeNavn;
  }

  return '-';
};

export const sortBehandlinger = (behandlinger: Behandling[]): Behandling[] =>
  [...behandlinger].sort((b1, b2) => {
    if (b1.avsluttet && !b2.avsluttet) {
      return 1;
    }
    if (!b1.avsluttet && b2.avsluttet) {
      return -1;
    }
    if (b1.avsluttet && b2.avsluttet) {
      return new Date(b2.avsluttet).getTime() - new Date(b1.avsluttet).getTime();
    }
    return new Date(b2.opprettet).getTime() - new Date(b1.opprettet).getTime();
  });

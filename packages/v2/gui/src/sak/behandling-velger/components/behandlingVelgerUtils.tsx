import { BehandlingDtoBehandlingResultatType } from '@k9-sak-web/backend/k9sak/generated';
import { BehandlingDtoSakstype, BehandlingDtoType } from '@k9-sak-web/backend/ungsak/generated';
import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import React from 'react';
import DateLabel from '../../../shared/dateLabel/DateLabel';
import type { Behandling } from '../types/Behandling';
import type { K9UngPeriode } from '../types/PerioderMedBehandlingsId';

const isValidPeriode = (periode: K9UngPeriode): periode is K9UngPeriode & { fom: string; tom: string } =>
  periode.fom !== null && periode.tom !== null;

export const getFormattedSøknadserioder = (søknadsperioder: K9UngPeriode[], visKunStartdato?: boolean) =>
  søknadsperioder?.filter(isValidPeriode).map((periode, index) => {
    if (visKunStartdato) {
      return <DateLabel dateString={periode.fom} key={periode.fom} />;
    }
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
  behandlinger.toSorted((b1, b2) => {
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

export const erUngdomsytelse = (sakstype: string) => sakstype === BehandlingDtoSakstype.UNGDOMSYTELSE;

export const erFørstegangsbehandlingIUngdomsytelsen = (sakstype: string, behandlingType: string) =>
  erUngdomsytelse(sakstype) && behandlingType === BehandlingDtoType.FØRSTEGANGSSØKNAD;

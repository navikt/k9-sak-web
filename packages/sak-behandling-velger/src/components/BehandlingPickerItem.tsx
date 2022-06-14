import React, { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import { Location } from 'history';

import { BehandlingAppKontekst, Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import BehandlingPickerItemContentOld from './BehandlingPickerItemContentOld';
import KodeverkType from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import styles from './behandlingPickerItem.less';

const getContentProps = (
  behandling: BehandlingAppKontekst,
  getKodeverkFn: (kode: string, kodeverk: KodeverkType, behandlingType?: string) => KodeverkMedNavn,
) => {
  return ({
    behandlingId: behandling.id,
    behandlingTypeNavn: getKodeverkFn(behandling.type, KodeverkType.BEHANDLING_TYPE)?.navn,
    behandlingTypeKode: behandling.type,
    førsteÅrsak: behandling.førsteÅrsak,
    behandlendeEnhetId: behandling.behandlendeEnhetId,
    behandlendeEnhetNavn: behandling.behandlendeEnhetNavn,
    opprettetDato: behandling.opprettet,
    avsluttetDato: behandling.avsluttet,
    behandlingsstatus: getKodeverkFn(behandling.status, KodeverkType.BEHANDLING_STATUS, BehandlingType.FORSTEGANGSSOKNAD)?.navn || '',
    erGjeldendeVedtak: behandling.gjeldendeVedtak,
    behandlingsresultatTypeNavn: behandling.behandlingsresultat
      ? getKodeverkFn(behandling.behandlingsresultat.type.kode, KodeverkType.BEHANDLING_RESULTAT_TYPE, behandling.type)?.navn
      : undefined,
    behandlingsresultatTypeKode: behandling.behandlingsresultat ? behandling.behandlingsresultat.type.kode : undefined,
  });
}

const renderItemContent = (
  behandling: BehandlingAppKontekst,
  getKodeverkFn: (kode: string, kodeverk: KodeverkType, behandlingType?: string) => KodeverkMedNavn,
  withChevronDown = false,
  withChevronUp = false,
): ReactElement => (
  <BehandlingPickerItemContentOld
    withChevronDown={withChevronDown}
    withChevronUp={withChevronUp}
    {...getContentProps(behandling, getKodeverkFn)}
  />
);

const renderToggleShowAllButton = (
  toggleShowAll: () => void,
  behandling: BehandlingAppKontekst,
  showAll: boolean,
  getKodeverkFn: (kode: string, kodeverk: KodeverkType, behandlingType?: string) => KodeverkMedNavn,
): ReactElement => (
  <button type="button" className={styles.toggleShowAllButton} onClick={toggleShowAll}>
    {renderItemContent(behandling, getKodeverkFn, !showAll, showAll)}
  </button>
);

const renderLinkToBehandling = (
  getBehandlingLocation: (behandlingId: number) => Location,
  behandling: BehandlingAppKontekst,
  isActive: boolean,
  toggleShowAll: () => void,
  showAll: boolean,
  getKodeverkFn: (kode: string, kodeverk: KodeverkType, behandlingType?: string) => KodeverkMedNavn,
): ReactElement => (
  <NavLink className={styles.linkToBehandling} to={getBehandlingLocation(behandling.id)} onClick={toggleShowAll}>
    {renderItemContent(behandling, getKodeverkFn, false, showAll && isActive)}
  </NavLink>
);

interface OwnProps {
  onlyOneBehandling: boolean;
  behandling: BehandlingAppKontekst;
  getBehandlingLocation: (behandlingId: number) => Location;
  isActive: boolean;
  showAll: boolean;
  toggleShowAll: () => void;
  getKodeverkFn: (kode: string, kodeverk: KodeverkType, behandlingType?: string) => KodeverkMedNavn;
}

const BehandlingPickerItem = ({
  onlyOneBehandling,
  behandling,
  getBehandlingLocation,
  isActive,
  showAll,
  toggleShowAll,
  getKodeverkFn,
}: OwnProps) => {
  if (onlyOneBehandling && isActive) {
    return renderItemContent(behandling, getKodeverkFn);
  }
  if (onlyOneBehandling || showAll) {
    return renderLinkToBehandling(getBehandlingLocation, behandling, isActive, toggleShowAll, showAll, getKodeverkFn);
  }
  if (isActive) {
    return renderToggleShowAllButton(toggleShowAll, behandling, showAll, getKodeverkFn);
  }
  return null;
};

export default BehandlingPickerItem;

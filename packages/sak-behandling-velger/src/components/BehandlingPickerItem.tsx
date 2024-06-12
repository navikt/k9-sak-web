import { Location } from 'history';
import React, { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';

import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
import { BehandlingAppKontekst } from '@k9-sak-web/types';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';

import BehandlingPickerItemContentOld from './BehandlingPickerItemContentOld';

import styles from './behandlingPickerItem.module.css';

const getContentProps = (behandling: BehandlingAppKontekst) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();
  return {
    behandlingId: behandling.id,
    behandlingTypeNavn: kodeverkNavnFraKode(behandling.type, KodeverkType.BEHANDLING_TYPE),
    behandlingTypeKode: behandling.type,
    førsteÅrsak: behandling.førsteÅrsak,
    behandlendeEnhetId: behandling.behandlendeEnhetId,
    behandlendeEnhetNavn: behandling.behandlendeEnhetNavn,
    opprettetDato: behandling.opprettet,
    avsluttetDato: behandling.avsluttet,
    behandlingsstatus: kodeverkNavnFraKode(behandling.status, KodeverkType.BEHANDLING_STATUS),
    erGjeldendeVedtak: behandling.gjeldendeVedtak,
    behandlingsresultatTypeNavn: behandling.behandlingsresultat
      ? kodeverkNavnFraKode(behandling.behandlingsresultat.type, KodeverkType.BEHANDLING_RESULTAT_TYPE)
      : undefined,
    behandlingsresultatTypeKode: behandling.behandlingsresultat ? behandling.behandlingsresultat.type : undefined,
  };
};

const renderItemContent = (
  behandling: BehandlingAppKontekst,
  withChevronDown = false,
  withChevronUp = false,
): ReactElement => (
  <BehandlingPickerItemContentOld
    withChevronDown={withChevronDown}
    withChevronUp={withChevronUp}
    {...getContentProps(behandling)}
  />
);

const renderToggleShowAllButton = (
  toggleShowAll: () => void,
  behandling: BehandlingAppKontekst,
  showAll: boolean,
): ReactElement => (
  <button
    aria-label={showAll ? 'Skjul andre behandlinger' : 'Vis alle behandlinger'}
    type="button"
    className={styles.toggleShowAllButton}
    onClick={toggleShowAll}
  >
    {renderItemContent(behandling, !showAll, showAll)}
  </button>
);

const renderLinkToBehandling = (
  getBehandlingLocation: (behandlingId: number) => Location,
  behandling: BehandlingAppKontekst,
  isActive: boolean,
  toggleShowAll: () => void,
  showAll: boolean,
): ReactElement => (
  <NavLink className={styles.linkToBehandling} to={getBehandlingLocation(behandling.id)} onClick={toggleShowAll}>
    {renderItemContent(behandling, false, showAll && isActive)}
  </NavLink>
);

interface OwnProps {
  onlyOneBehandling: boolean;
  behandling: BehandlingAppKontekst;
  getBehandlingLocation: (behandlingId: number) => Location;
  isActive: boolean;
  showAll: boolean;
  toggleShowAll: () => void;
}

const BehandlingPickerItem = ({
  onlyOneBehandling,
  behandling,
  getBehandlingLocation,
  isActive,
  showAll,
  toggleShowAll,
}: OwnProps) => {
  if (onlyOneBehandling && isActive) {
    return renderItemContent(behandling);
  }
  if (onlyOneBehandling || showAll) {
    return renderLinkToBehandling(getBehandlingLocation, behandling, isActive, toggleShowAll, showAll);
  }
  if (isActive) {
    return renderToggleShowAllButton(toggleShowAll, behandling, showAll);
  }
  return null;
};

export default BehandlingPickerItem;

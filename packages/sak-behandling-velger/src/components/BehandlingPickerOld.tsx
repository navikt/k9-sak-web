import { BehandlingAppKontekst, Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import { Location } from 'history';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import BehandlingPickerItem from './BehandlingPickerItem';
import styles from './behandlingPickerOld.module.css';
import { sortBehandlinger } from './behandlingVelgerUtils';

const renderListItems = (
  behandlinger: BehandlingAppKontekst[],
  getBehandlingLocation: (behandlingId: number) => Location,
  showAll: boolean,
  toggleShowAll: () => void,
  behandlingId?: number,
): ReactElement[] =>
  sortBehandlinger(behandlinger)
    .filter(behandling => showAll || behandling.id === behandlingId)
    .map(behandling => (
      <li key={behandling.id}>
        <BehandlingPickerItem
          onlyOneBehandling={behandlinger.length === 1}
          behandling={behandling}
          getBehandlingLocation={getBehandlingLocation}
          isActive={behandling.id === behandlingId}
          showAll={showAll}
          toggleShowAll={toggleShowAll}
        />
      </li>
    ));

interface OwnProps {
  behandlinger: BehandlingAppKontekst[];
  getBehandlingLocation: (behandlingId: number) => Location;
  noExistingBehandlinger: boolean;
  behandlingId?: number;
  showAll: boolean;
  toggleShowAll: () => void;
}

/**
 * BehandlingPicker
 *
 * Viser behandlinger knyttet til fagsak,
 */
const BehandlingPicker = ({
  noExistingBehandlinger,
  behandlinger,
  getBehandlingLocation,
  behandlingId,
  showAll,
  toggleShowAll,
}: OwnProps) => (
  <ul className={styles.behandlingList}>
    {noExistingBehandlinger && (
      <Normaltekst>
        <FormattedMessage id="BehandlingList.ZeroBehandlinger" />
      </Normaltekst>
    )}
    {!noExistingBehandlinger &&
      renderListItems(behandlinger, getBehandlingLocation, showAll, toggleShowAll, behandlingId)}
  </ul>
);

export default BehandlingPicker;

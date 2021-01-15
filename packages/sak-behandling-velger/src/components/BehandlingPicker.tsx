import React, { FunctionComponent, ReactElement } from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Location } from 'history';
import { Normaltekst } from 'nav-frontend-typografi';

import { BehandlingAppKontekst, KodeverkMedNavn, Kodeverk } from '@k9-sak-web/types';

import BehandlingPickerItem from './BehandlingPickerItem';

import styles from './behandlingPicker.less';

export const sortBehandlinger = (behandlinger: BehandlingAppKontekst[]): BehandlingAppKontekst[] =>
  behandlinger.sort((b1, b2) => {
    if (b1.avsluttet && !b2.avsluttet) {
      return 1;
    }
    if (!b1.avsluttet && b2.avsluttet) {
      return -1;
    }
    if (b1.avsluttet && b2.avsluttet) {
      return moment(b2.avsluttet).diff(moment(b1.avsluttet));
    }
    return moment(b2.opprettet).diff(moment(b1.opprettet));
  });

const renderListItems = (
  behandlinger: BehandlingAppKontekst[],
  getBehandlingLocation: (behandlingId: number) => Location,
  showAll: boolean,
  toggleShowAll: () => void,
  getKodeverkFn: (kodeverk: Kodeverk, behandlingType?: Kodeverk) => KodeverkMedNavn,
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
          getKodeverkFn={getKodeverkFn}
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
  getKodeverkFn: (kodeverk: Kodeverk, behandlingType?: Kodeverk) => KodeverkMedNavn;
}

/**
 * BehandlingPicker
 *
 * Viser behandlinger knyttet til fagsak,
 */
const BehandlingPicker: FunctionComponent<OwnProps> = ({
  noExistingBehandlinger,
  behandlinger,
  getBehandlingLocation,
  behandlingId,
  showAll,
  toggleShowAll,
  getKodeverkFn,
}) => (
  <ul className={styles.behandlingList}>
    {noExistingBehandlinger && (
      <Normaltekst>
        <FormattedMessage id="BehandlingList.ZeroBehandlinger" />
      </Normaltekst>
    )}
    {!noExistingBehandlinger &&
      renderListItems(behandlinger, getBehandlingLocation, showAll, toggleShowAll, getKodeverkFn, behandlingId)}
  </ul>
);

export default BehandlingPicker;

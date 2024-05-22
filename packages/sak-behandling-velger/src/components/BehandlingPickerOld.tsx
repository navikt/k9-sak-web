import { BehandlingAppKontekst, Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import { BodyShort } from '@navikt/ds-react';
import { Location } from 'history';
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
 * Dette er den gamle behandlingsvelgeren. Brukes fremdeles for Frisinn og Omsorgspenger
 */
const BehandlingPicker = ({
  noExistingBehandlinger,
  behandlinger,
  getBehandlingLocation,
  behandlingId,
  showAll,
  toggleShowAll,
  getKodeverkFn,
}: OwnProps) => (
  <ul className={styles.behandlingList}>
    {noExistingBehandlinger && (
      <BodyShort size="small">
        <FormattedMessage id="BehandlingList.ZeroBehandlinger" />
      </BodyShort>
    )}
    {!noExistingBehandlinger &&
      renderListItems(behandlinger, getBehandlingLocation, showAll, toggleShowAll, getKodeverkFn, behandlingId)}
  </ul>
);

export default BehandlingPicker;

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { BehandlingAppKontekst, Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import { Tilbakeknapp } from 'nav-frontend-ikonknapper';
import { Location } from 'history';
import moment from 'moment';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React, { ReactElement, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import styles from './behandlingPicker.less';
import BehandlingPickerItemContent from './BehandlingPickerItemContent';
import BehandlingSelected from './BehandlingSelected';

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
  getKodeverkFn: (kodeverk: Kodeverk, behandlingType?: Kodeverk) => KodeverkMedNavn,
  setValgtBehandling,
): ReactElement[] =>
  sortBehandlinger(behandlinger).map(behandling => (
    <li key={behandling.id}>
      <NavLink
        onClick={() => setValgtBehandling(behandling.id)}
        className={styles.linkToBehandling}
        to={getBehandlingLocation(behandling.id)}
      >
        <BehandlingPickerItemContent
          opprettetDato={behandling.opprettet}
          avsluttetDato={behandling.avsluttet}
          behandlingsstatus={
            getKodeverkFn(behandling.status, { kode: behandlingType.FORSTEGANGSSOKNAD, kodeverk: '' }).navn
          }
          behandlingsresultatTypeNavn={
            behandling.behandlingsresultat
              ? getKodeverkFn(behandling.behandlingsresultat.type, behandling.type).navn
              : undefined
          }
          behandlingsresultatTypeKode={
            behandling.behandlingsresultat ? behandling.behandlingsresultat.type.kode : undefined
          }
        />
      </NavLink>
    </li>
  ));

interface OwnProps {
  behandlinger: BehandlingAppKontekst[];
  getBehandlingLocation: (behandlingId: number) => Location;
  noExistingBehandlinger: boolean;
  getKodeverkFn: (kodeverk: Kodeverk, behandlingType?: Kodeverk) => KodeverkMedNavn;
}

/**
 * BehandlingPicker
 *
 * Viser behandlinger knyttet til fagsak,
 */
const BehandlingPicker = ({ noExistingBehandlinger, behandlinger, getBehandlingLocation, getKodeverkFn }: OwnProps) => {
  const [valgtBehandlingId, setValgtBehandlingId] = useState(
    behandlinger.find(behandling => !behandling.behandlingsresultat)?.id,
  );
  const valgtBehandling = valgtBehandlingId
    ? behandlinger.find(behandling => behandling.id === valgtBehandlingId)
    : null;
  return (
    <div className={styles.behandlingPicker}>
      {valgtBehandlingId && (
        <Tilbakeknapp className={styles.backButton} onClick={() => setValgtBehandlingId(undefined)}>
          Se alle behandlinger
        </Tilbakeknapp>
      )}

      {!valgtBehandlingId && (
        <>
          <Undertittel>{`Velg behandling (${behandlinger.length})`}</Undertittel>
          <ul className={styles.behandlingList}>
            {noExistingBehandlinger && (
              <Normaltekst>
                <FormattedMessage id="BehandlingList.ZeroBehandlinger" />
              </Normaltekst>
            )}
            {!noExistingBehandlinger &&
              renderListItems(behandlinger, getBehandlingLocation, getKodeverkFn, setValgtBehandlingId)}
          </ul>
        </>
      )}
      {valgtBehandling && (
        <>
          <Undertittel>Om behandling</Undertittel>
          <BehandlingSelected
            opprettetDato={valgtBehandling.opprettet}
            avsluttetDato={valgtBehandling.avsluttet}
            behandlingsstatus={
              getKodeverkFn(valgtBehandling.status, { kode: behandlingType.FORSTEGANGSSOKNAD, kodeverk: '' }).navn
            }
            behandlingsresultatTypeNavn={
              valgtBehandling.behandlingsresultat
                ? getKodeverkFn(valgtBehandling.behandlingsresultat.type, valgtBehandling.type).navn
                : undefined
            }
            behandlingsresultatTypeKode={
              valgtBehandling.behandlingsresultat ? valgtBehandling.behandlingsresultat.type.kode : undefined
            }
            behandlingÅrsak={
              valgtBehandling.førsteÅrsak
                ? getKodeverkFn(valgtBehandling.førsteÅrsak.behandlingArsakType, valgtBehandling.type).navn
                : undefined
            }
            behandlingTypeKode={valgtBehandling.type.kode}
            førsteÅrsak={valgtBehandling.førsteÅrsak}
          />
        </>
      )}
    </div>
  );
};
export default BehandlingPicker;

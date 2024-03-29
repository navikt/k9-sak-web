import React from 'react';

import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { Table, TableColumn, TableRow } from '@fpsak-frontend/shared-components';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import { Fagsak, KodeverkMedNavn } from '@k9-sak-web/types';

import styles from './fagsakList.module.css';

const headerTextCodes = ['FagsakList.Saksnummer', 'FagsakList.Sakstype', 'FagsakList.Status'];
const lagFagsakSortObj = (fagsak: Fagsak) => ({
  avsluttet: fagsak.status.kode === fagsakStatus.AVSLUTTET,
  endret: fagsak.endret ? fagsak.endret : fagsak.opprettet,
});

export const sortFagsaker = (fagsaker: Fagsak[]) =>
  [...fagsaker].sort((fagsak1, fagsak2) => {
    const a = lagFagsakSortObj(fagsak1);
    const b = lagFagsakSortObj(fagsak2);
    if (a.avsluttet && !b.avsluttet) {
      return 1;
    }
    if (!a.avsluttet && b.avsluttet) {
      return -1;
    }
    if (a.endret > b.endret) {
      return -1;
    }
    if (a.endret < b.endret) {
      return 1;
    }
    return 0;
  });

interface OwnProps {
  fagsaker: Fagsak[];
  selectFagsakCallback: (e: React.SyntheticEvent, saksnummer: string) => void;
  alleKodeverk: { [key: string]: [KodeverkMedNavn] };
}

/**
 * FagsakList
 *
 * Presentasjonskomponent. Formaterer fagsak-søkeresultatet for visning i tabell. Sortering av fagsakene blir håndtert her.
 */
const FagsakList = ({ fagsaker, selectFagsakCallback, alleKodeverk }: OwnProps) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);

  return (
    <Table headerTextCodes={headerTextCodes} classNameTable={styles.table}>
      {sortFagsaker(fagsaker).map(fagsak => (
        <TableRow
          key={fagsak.saksnummer}
          id={fagsak.saksnummer}
          model={document}
          onMouseDown={selectFagsakCallback}
          onKeyDown={selectFagsakCallback}
        >
          <TableColumn>{fagsak.saksnummer}</TableColumn>
          <TableColumn>{getKodeverknavn(fagsak.sakstype)}</TableColumn>
          <TableColumn>{getKodeverknavn(fagsak.status)}</TableColumn>
        </TableRow>
      ))}
    </Table>
  );
};

export default FagsakList;

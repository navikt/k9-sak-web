import { BehandlingAksjonspunktDtoFagsakStatus as fagsakStatus } from '@k9-sak-web/backend/k9sak/generated';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types.js';
import { Table } from '@navikt/ds-react';
import React from 'react';
import type { Fagsak } from '../types/Fagsak';
import styles from './fagsakList.module.css';

const headerTextCodes = ['Saksnummer', 'Sakstype', 'Status'];
const lagFagsakSortObj = (fagsak: Fagsak) => ({
  avsluttet: fagsak.status === fagsakStatus.AVSLUTTET,
  endret: fagsak.endret ? fagsak.endret : fagsak.opprettet,
});

export const sortFagsaker = (fagsaker: Fagsak[]) =>
  fagsaker.toSorted((fagsak1, fagsak2) => {
    const a = lagFagsakSortObj(fagsak1);
    const b = lagFagsakSortObj(fagsak2);
    if (a.avsluttet && !b.avsluttet) {
      return 1;
    }
    if (!a.avsluttet && b.avsluttet) {
      return -1;
    }
    if (a.endret && b.endret) {
      if (a.endret > b.endret) {
        return -1;
      }
      if (a.endret < b.endret) {
        return 1;
      }
    }
    return 0;
  });

interface OwnProps {
  fagsaker: Fagsak[];
  selectFagsakCallback: (e: React.SyntheticEvent, saksnummer: string) => void;
}

/**
 * FagsakList
 *
 * Presentasjonskomponent. Formaterer fagsak-søkeresultatet for visning i tabell. Sortering av fagsakene blir håndtert her.
 */
const FagsakList = ({ fagsaker, selectFagsakCallback }: OwnProps) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();

  return (
    <Table className={styles.table}>
      <Table.Header>
        <Table.Row shadeOnHover={false}>
          {headerTextCodes.map(text => (
            <Table.HeaderCell scope="col" key={text}>
              {text}
            </Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sortFagsaker(fagsaker).map(fagsak => (
          <Table.Row
            key={fagsak.saksnummer}
            id={fagsak.saksnummer}
            onClick={event => selectFagsakCallback(event, fagsak.saksnummer)}
            shadeOnHover={false}
          >
            <Table.DataCell>{fagsak.saksnummer}</Table.DataCell>
            <Table.DataCell>{kodeverkNavnFraKode(fagsak.sakstype, KodeverkType.FAGSAK_YTELSE)}</Table.DataCell>
            <Table.DataCell>
              {fagsak.status && kodeverkNavnFraKode(fagsak.status, KodeverkType.FAGSAK_STATUS)}
            </Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default FagsakList;

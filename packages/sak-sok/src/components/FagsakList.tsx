import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import { Fagsak, KodeverkMedNavn } from '@k9-sak-web/types';
import { Table } from '@navikt/ds-react';
import React from 'react';

import { useIntl } from 'react-intl';
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
  const intl = useIntl();
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);

  return (
    <Table className={styles.table}>
      <Table.Header>
        <Table.Row shadeOnHover={false}>
          {headerTextCodes.map(text => (
            <Table.HeaderCell scope="col" key={text}>
              {intl.formatMessage({ id: text })}
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
            <Table.DataCell>{getKodeverknavn(fagsak.sakstype)}</Table.DataCell>
            <Table.DataCell>{getKodeverknavn(fagsak.status)}</Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default FagsakList;

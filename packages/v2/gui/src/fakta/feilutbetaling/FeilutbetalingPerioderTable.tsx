import { Table } from '@navikt/ds-react';
import type {
  FeilutbetalingPeriodeViewModel,
  FeilutbetalingÅrsakerPerYtelseViewModel,
} from './api/FeilutbetalingFaktaViewModel.js';
import FeilutbetalingPerioderRow from './FeilutbetalingPerioderRow.js';

interface FeilutbetalingPerioderTableProps {
  perioder: FeilutbetalingPeriodeViewModel[];
  årsaker: NonNullable<FeilutbetalingÅrsakerPerYtelseViewModel['hendelseTyper']>;
  readOnly: boolean;
  behandlePerioderSamlet: boolean;
  hentHendelseTypeNavn: (kode?: string) => string;
  hentHendelseUnderTypeNavn: (kode?: string) => string;
}

const FeilutbetalingPerioderTable = ({
  perioder,
  årsaker,
  readOnly,
  behandlePerioderSamlet,
  hentHendelseTypeNavn,
  hentHendelseUnderTypeNavn,
}: FeilutbetalingPerioderTableProps) => {
  const sortertePerioder = [...perioder].sort((a, b) => (a.fom ?? '').localeCompare(b.fom ?? ''));

  return (
    <Table size="small">
      <Table.Header>
        <Table.Row shadeOnHover={false}>
          <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
          <Table.HeaderCell scope="col">Hendelse</Table.HeaderCell>
          <Table.HeaderCell scope="col">Feilutbetalt beløp</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sortertePerioder.length === 0 ? (
          <Table.Row>
            <Table.DataCell colSpan={3}>Ingen perioder med feilutbetaling</Table.DataCell>
          </Table.Row>
        ) : (
          sortertePerioder.map((periode, index) => (
            <FeilutbetalingPerioderRow
              key={`${periode.fom}-${periode.tom}`}
              periode={periode}
              index={index}
              årsaker={årsaker}
              readOnly={readOnly}
              behandlePerioderSamlet={behandlePerioderSamlet}
              hentHendelseTypeNavn={hentHendelseTypeNavn}
              hentHendelseUnderTypeNavn={hentHendelseUnderTypeNavn}
            />
          ))
        )}
      </Table.Body>
    </Table>
  );
};

export default FeilutbetalingPerioderTable;

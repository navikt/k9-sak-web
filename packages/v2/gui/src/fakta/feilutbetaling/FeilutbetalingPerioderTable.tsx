import type { LogiskPeriodeMedFaktaDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/feilutbetaling/BehandlingFeilutbetalingFaktaDto.js';
import type { HendelseTypeMedUndertyperDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/feilutbetaling/HendelseTyperDto.js';
import { Table } from '@navikt/ds-react';
import FeilutbetalingPerioderRow from './FeilutbetalingPerioderRow.js';

interface FeilutbetalingPerioderTableProps {
  perioder: LogiskPeriodeMedFaktaDto[];
  årsaker: HendelseTypeMedUndertyperDto[];
  readOnly: boolean;
  behandlePerioderSamlet: boolean;
}

const FeilutbetalingPerioderTable = ({
  perioder,
  årsaker,
  readOnly,
  behandlePerioderSamlet,
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
        {sortertePerioder.map((periode, index) => (
          <FeilutbetalingPerioderRow
            key={`${periode.fom}-${periode.tom}`}
            periode={periode}
            index={index}
            årsaker={årsaker}
            readOnly={readOnly}
            behandlePerioderSamlet={behandlePerioderSamlet}
          />
        ))}
      </Table.Body>
    </Table>
  );
};

export default FeilutbetalingPerioderTable;

import { Table } from '@navikt/ds-react';
import moment from 'moment';
import { useIntl } from 'react-intl';
import { FeilutbetalingAarsak } from './feilutbetalingAarsak';
import { BehandlingFaktaPeriode } from './feilutbetalingFakta';
import FeilutbetalingPerioderForm from './FeilutbetalingPerioderForm';
import styles from './feilutbetalingPerioderTable.module.css';

const headerTextCodes = [
  'FeilutbetalingInfoPanel.Period',
  'FeilutbetalingInfoPanel.Hendelse',
  'FeilutbetalingInfoPanel.Beløp',
];

interface FeilutbetalingPerioderTableProps {
  perioder: BehandlingFaktaPeriode[];
  behandlingId: number;
  behandlingVersjon: number;
  formName: string;
  readOnly: boolean;
  onChangeÅrsak: (event: React.ChangeEvent<HTMLSelectElement>, elementId: number, årsak: string) => void;
  onChangeUnderÅrsak: (event: React.ChangeEvent<HTMLSelectElement>, elementId: number, årsak: string) => void;
  årsaker: FeilutbetalingAarsak['hendelseTyper'];
}

const FeilutbetalingPerioderTable = ({
  perioder,
  formName,
  årsaker,
  readOnly,
  onChangeÅrsak,
  onChangeUnderÅrsak,
  behandlingId,
  behandlingVersjon,
}: FeilutbetalingPerioderTableProps) => {
  const intl = useIntl();
  return (
    <div className={styles.feilutbetalingTable}>
      <Table>
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
          {perioder
            .sort((a, b) => moment(a.fom).diff(moment(b.fom)))
            .map((periode, index) => (
              <FeilutbetalingPerioderForm
                behandlingId={behandlingId}
                behandlingVersjon={behandlingVersjon}
                periode={periode}
                elementId={index}
                formName={formName}
                årsaker={årsaker}
                readOnly={readOnly}
                onChangeÅrsak={onChangeÅrsak}
                onChangeUnderÅrsak={onChangeUnderÅrsak}
                key={`formIndex${index + 1}`}
              />
            ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default FeilutbetalingPerioderTable;

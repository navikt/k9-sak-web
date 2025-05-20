import { BodyShort, Table } from '@navikt/ds-react';

interface DataCellWithValueProps {
  value: any;
  formatter?: (value: any) => string | React.ReactNode;
  emptyValue?: React.ReactNode;
  suffix?: string;
  className?: string;
}

export const DataCellWithValue = ({
  value,
  formatter = val => val,
  emptyValue = '-',
  suffix = '',
  className,
}: DataCellWithValueProps) => (
  <Table.DataCell className={className}>
    <BodyShort size="small">{value ? `${formatter(value)}${suffix}` : emptyValue}</BodyShort>
  </Table.DataCell>
);

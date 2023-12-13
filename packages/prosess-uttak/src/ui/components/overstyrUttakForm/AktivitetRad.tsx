import React from 'react';

import { Table, Button } from '@navikt/ds-react';
import { Edit, Delete } from '@navikt/ds-icons';

import dayjs from 'dayjs';

import styles from './aktivitetRad.css';
import BegrunnelseBoks from './components/BegrunnelseBoks';
import { OverstyringUttak } from '../../../types';

interface ownProps {
  index: number;
  overstyring: OverstyringUttak;
  handleRediger: (index: number) => void;
  visOverstyringSkjema: boolean;
  handleSlett: (id: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const AktivitetRad: React.FC<ownProps> = ({
  overstyring,
  index,
  handleRediger,
  visOverstyringSkjema,
  handleSlett,
  loading,
}) => {
  const { id, periode, søkersUttaksgrad, begrunnelse } = overstyring;
  const { fom, tom } = periode;

  return (
    <Table.ExpandableRow
      key={`aktivitet-rad-${index}`}
      content={
        <div className={styles.begrunnelseWrapper}>
          <BegrunnelseBoks begrunnelse={begrunnelse} saksbehandler={undefined} dato={undefined} />
        </div>
      }
    >
      <Table.DataCell>{dayjs(fom).format('DD.MM.YYYY')}</Table.DataCell>
      <Table.DataCell>{dayjs(tom).format('DD.MM.YYYY')}</Table.DataCell>
      <Table.DataCell>{søkersUttaksgrad}</Table.DataCell>
      <Table.DataCell>
        <Button
          size="xsmall"
          variant="tertiary"
          icon={<Edit aria-hidden />}
          onClick={() => {
            handleRediger(index);
          }}
          disabled={visOverstyringSkjema}
          loading={loading}
        >
          Endre
        </Button>

        <Button
          size="xsmall"
          variant="tertiary"
          icon={<Delete aria-hidden />}
          onClick={() => handleSlett(id)}
          disabled={visOverstyringSkjema}
          loading={loading}
        >
          Slett
        </Button>
      </Table.DataCell>
    </Table.ExpandableRow>
  );
};

export default AktivitetRad;

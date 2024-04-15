import React from 'react';

import { Delete, Edit } from '@navikt/ds-icons';
import { Button, Table } from '@navikt/ds-react';

import dayjs from 'dayjs';

import { OverstyringUttak } from '../../../types';
import styles from './aktivitetRad.module.css';
import BegrunnelseBoks from './components/BegrunnelseBoks';

interface ownProps {
  index: number;
  overstyring: OverstyringUttak;
  handleRediger: (index: number) => void;
  visOverstyringSkjema: boolean;
  handleSlett: (id: string) => void;
  loading: boolean;
  leseModus: boolean;
  erTilVurdering: boolean;
}

const AktivitetRad: React.FC<ownProps> = ({
  overstyring,
  index,
  handleRediger,
  visOverstyringSkjema,
  handleSlett,
  leseModus,
  loading,
  erTilVurdering,
}) => {
  const { id, periode, søkersUttaksgrad, begrunnelse } = overstyring;
  const { fom, tom } = periode;

  return (
    <Table.ExpandableRow
      key={`aktivitet-rad-${index}`}
      expandOnRowClick
      content={
        <div className={styles.begrunnelseWrapper}>
          <BegrunnelseBoks begrunnelse={begrunnelse} overstyring={overstyring} />
        </div>
      }
    >
      <Table.DataCell>{dayjs(fom).format('DD.MM.YYYY')}</Table.DataCell>
      <Table.DataCell>{dayjs(tom).format('DD.MM.YYYY')}</Table.DataCell>
      <Table.DataCell>{søkersUttaksgrad} %</Table.DataCell>
      {!leseModus && (
        <Table.DataCell>
          {erTilVurdering && (
            <>
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
            </>
          )}
        </Table.DataCell>
      )}
    </Table.ExpandableRow>
  );
};

export default AktivitetRad;

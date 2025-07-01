import React from 'react';
import dayjs from 'dayjs';
import { Delete, Edit } from '@navikt/ds-icons';
import { Button, Table } from '@navikt/ds-react';
import type { ArbeidsgiverOversiktDto, OverstyrUttakPeriodeDto } from '@k9-sak-web/backend/k9sak/generated';
import BegrunnelseBoks from './components/BegrunnelseBoks';

import styles from './aktivitetRad.module.css';

interface ownProps {
  index: number;
  overstyring: OverstyrUttakPeriodeDto;
  handleRediger: (index: number) => void;
  visOverstyringSkjema: boolean;
  handleSlett: (id: number) => void;
  loading: boolean;
  leseModus: boolean;
  erTilVurdering: boolean;
  arbeidsgivere: ArbeidsgiverOversiktDto['arbeidsgivere'];
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
  arbeidsgivere,
}) => {
  const { id = -1, periode, søkersUttaksgrad, begrunnelse } = overstyring;
  const { fom, tom } = periode;

  return (
    <Table.ExpandableRow
      key={`aktivitet-rad-${index}`}
      expandOnRowClick
      content={
        <div className={styles.begrunnelseWrapper}>
          <BegrunnelseBoks begrunnelse={begrunnelse} overstyring={overstyring} arbeidsgivere={arbeidsgivere} />
        </div>
      }
    >
      <Table.DataCell>{dayjs(fom).format('DD.MM.YYYY')}</Table.DataCell>
      <Table.DataCell>{dayjs(tom).format('DD.MM.YYYY')}</Table.DataCell>
      <Table.DataCell>{søkersUttaksgrad ? `${søkersUttaksgrad} %` : `-`}</Table.DataCell>
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

import { Detail, Tag } from '@navikt/ds-react';
import classNames from 'classnames';
import React from 'react';
import Kilde from '../../../types/Kilde';

import styles from './etablertTilsynRowContent.css';
import PartIkon from './PartIkon';

interface OwnProps {
  tittel: string;
  timer: number;
  kilde: Kilde;
  disabled: boolean;
  visIkon?: boolean;
}
const EtablertTilsynDag = ({ tittel, timer, kilde, disabled, visIkon = true }: OwnProps) => (
  <div>
    <Detail>{tittel}</Detail>
    <Tag
      className={classNames(styles.etablertTilsyn__tag, disabled && styles.etablertTilsyn__tag__disabled)}
      variant="info"
    >
      {visIkon && <PartIkon parter={[kilde]} fontSize="18px" />}
      {timer}
    </Tag>
  </div>
);

export default EtablertTilsynDag;

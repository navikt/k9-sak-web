import { Tag } from '@navikt/ds-react';
import classnames from 'classnames/bind';

import styles from './vurdertIForrigeBehandlingIcon.module.css';

const classNames = classnames.bind(styles);

export interface Props {
  className?: string;
}

/*
 * VurdertIForrigeBehandlingIcon
 *
 * Komponent/Ikon som viser om noe er vurdert tidligere
 */

export const VurdertIForrigeBehandlingIcon = ({ className = '' }: Props) => {
  return (
    <span data-testid="vurdertIForrigeIcon" className={classNames('vurdertIForrigeIcon', className)}>
      <Tag size="small" variant="neutral">
        Vurdert i en tidligere behandling
      </Tag>
    </span>
  );
};

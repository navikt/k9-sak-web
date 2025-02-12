import { useIntl } from 'react-intl';

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
  const intl = useIntl();
  return (
    <span data-testid="vurdertIForrigeIcon" className={classNames('vurdertIForrigeIcon', className)}>
      <Tag size="small" variant="neutral">
        {intl.formatMessage({ id: 'Fordeling.VurdertTidligere' })}
      </Tag>
    </span>
  );
};

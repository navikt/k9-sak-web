import endretFelt from '@k9-sak-web/assets/images/endret_felt.svg';
import classnames from 'classnames/bind';
import React from 'react';
import { useIntl } from 'react-intl';
import Image from './Image';

import styles from './editedIcon.module.css';

const classNames = classnames.bind(styles);

interface OwnProps {
  className?: string;
}

/*
 * EditedIcon
 *
 * Komponent/Ikon som viser om noe i GUI er endret.
 */

const EditedIcon = ({ className = '' }: OwnProps) => {
  const intl = useIntl();
  return (
    <span className={classNames('editedIcon', className)}>
      <Image
        src={endretFelt}
        alt={intl.formatMessage({ id: 'Behandling.EditedField' })}
        tooltip={intl.formatMessage({ id: 'Behandling.EditedField' })}
      />
    </span>
  );
};

export default EditedIcon;

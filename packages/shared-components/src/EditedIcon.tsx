import endretFelt from '@fpsak-frontend/assets/images/endret_felt.svg';
import classnames from 'classnames/bind';
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

const EditedIcon = ({ className = '' }: OwnProps) => (
  <span className={classNames('editedIcon', className)}>
    <Image
      src={endretFelt}
      alt="Saksbehandler har endret feltets verdi"
      tooltip="Saksbehandler har endret feltets verdi"
    />
  </span>
);

export default EditedIcon;

import * as React from 'react';
import { BucketIcon } from '@navikt/k9-react-components';
import styles from './deleteButton.less';

interface DeleteButtonProps {
    onClick: () => void;
}

const DeleteButton = ({ onClick }: DeleteButtonProps): JSX.Element => (
    <div className={styles.deleteButton__container}>
        <button className={styles.deleteButton__button} type="button" onClick={onClick} aria-label="Fjern periode">
            <BucketIcon />
        </button>
    </div>
);

export default DeleteButton;

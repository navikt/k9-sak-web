import { Box } from '@navikt/ds-react';
import classnames from 'classnames/bind';
import { ReactNode } from 'react';
import styles from './borderBox.module.css';

const classNames = classnames.bind(styles);

interface OwnProps {
  error?: boolean;
  className?: string;
  children?: ReactNode | ReactNode[];
}

/*
 * BorderBox
 *
 * Valideringskomponent. Visar en box kring noe som skall fikses.
 */
const BorderBox = ({ error = false, className, children }: OwnProps) => (
  <Box.New padding="4" borderWidth="1" borderRadius="medium" className={classNames('borderbox', { error }, className)}>
    {children}
  </Box.New>
);

export default BorderBox;

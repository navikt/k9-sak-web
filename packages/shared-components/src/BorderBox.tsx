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
  <Box padding="space-16" borderWidth="1" borderRadius="4" className={classNames('borderbox', { error }, className)}>
    {children}
  </Box>
);

export default BorderBox;

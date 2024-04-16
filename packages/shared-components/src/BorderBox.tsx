import { Box } from '@navikt/ds-react';
import classnames from 'classnames/bind';
import React, { ReactNode } from 'react';
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
  <Box
    background="surface-default"
    padding="4"
    borderWidth="1"
    borderColor="border-subtle"
    borderRadius="medium"
    className={classNames('borderbox', { error }, className)}
  >
    {children}
  </Box>
);

export default BorderBox;

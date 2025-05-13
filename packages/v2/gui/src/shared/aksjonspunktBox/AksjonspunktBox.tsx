import classnames from 'classnames/bind';
import { type ReactNode } from 'react';
import { Box } from '@navikt/ds-react';
import { K9MaxTextWidth } from '../../tokens/tokens';

import styles from './aksjonspunktBox.module.css';

const classNames = classnames.bind(styles);

interface OwnProps {
  children: ReactNode | ReactNode[];
  erAksjonspunktApent: boolean;
  className?: string;
}

/*
 * Legger til et flagg for maxWidth, som setter maxWidth til 43.5rem.
 * 43.5rem er hentet fra Aksel, i Alert komponenten som hardkodet maksbredde.
 */
const AksjonspunktBox = ({ erAksjonspunktApent, className, children, maxWidth = false }: OwnProps) => (
  <Box
    className={classNames('aksjonspunkt', className, { erAksjonspunktApent })}
    borderWidth={erAksjonspunktApent ? '3' : undefined}
    borderRadius={erAksjonspunktApent ? 'large' : undefined}
    padding={erAksjonspunktApent ? '4' : undefined}
    maxWidth={maxWidth ? K9MaxTextWidth : undefined}
  >
    {children}
  </Box>
);

export default AksjonspunktBox;

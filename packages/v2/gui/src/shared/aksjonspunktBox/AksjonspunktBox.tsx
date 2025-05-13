import classnames from 'classnames/bind';
import { type ReactNode } from 'react';
import { Box } from '@navikt/ds-react';
import { K9MaxTextWidth } from '../../tokens/tokens';

import styles from './aksjonspunktBox.module.css';

const classNames = classnames.bind(styles);

interface OwnProps {
  children: ReactNode | ReactNode[];
  erAksjonspunktApent: boolean;
  maxWidth?: boolean;
  className?: string;
}

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

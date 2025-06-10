import { type ReactNode } from 'react';
import { Box } from '@navikt/ds-react';
import { K9MaxTextWidth } from '@k9-sak-web/gui/tokens/tokens.js';

import styles from './aksjonspunktBox.module.css';

interface OwnProps {
  children: ReactNode | ReactNode[];
  erAksjonspunktApent: boolean;
  maxWidth?: boolean;
  className?: string;
}

const AksjonspunktBox = ({ erAksjonspunktApent, className, children, maxWidth = false }: OwnProps) => (
  <Box
    className={`${styles.aksjonspunkt} ${className} ${erAksjonspunktApent ? styles.erAksjonspunktApent : ''}`}
    borderWidth={erAksjonspunktApent ? '3' : undefined}
    borderRadius={erAksjonspunktApent ? 'large' : undefined}
    padding={erAksjonspunktApent ? '4' : undefined}
    maxWidth={maxWidth ? K9MaxTextWidth : undefined}
  >
    {children}
  </Box>
);

export default AksjonspunktBox;

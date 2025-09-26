import { K9MaxTextWidth } from '@k9-sak-web/gui/tokens/tokens.js';
import { Box } from '@navikt/ds-react';
import { type ReactNode } from 'react';

import styles from './aksjonspunktBox.module.css';

interface OwnProps {
  children: ReactNode | ReactNode[];
  erAksjonspunktApent: boolean;
  maxWidth?: boolean;
  className?: string;
}

const AksjonspunktBox = ({ erAksjonspunktApent, className, children, maxWidth = false }: OwnProps) => (
  <Box.New
    className={`${styles.aksjonspunkt} ${className} ${erAksjonspunktApent ? styles.erAksjonspunktApent : ''}`}
    borderWidth={erAksjonspunktApent ? '3' : undefined}
    borderRadius={erAksjonspunktApent ? 'large' : undefined}
    padding={erAksjonspunktApent ? '4' : undefined}
    maxWidth={maxWidth ? K9MaxTextWidth : undefined}
  >
    {children}
  </Box.New>
);

export default AksjonspunktBox;

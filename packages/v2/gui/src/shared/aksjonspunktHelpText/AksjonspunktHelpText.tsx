import { Alert, BodyShort } from '@navikt/ds-react';
import React, { type ReactNode } from 'react';
import styles from './aksjonspunktHelpText.module.css';

interface OwnProps {
  children: string[] | ReactNode[] | ReactNode;
  isAksjonspunktOpen: boolean;
}

const AksjonspunktHelpText = ({ isAksjonspunktOpen, children }: OwnProps) => {
  if (!children || (Array.isArray(children) && children.length === 0)) {
    return null;
  }
  if (!isAksjonspunktOpen) {
    return (
      <>
        {React.Children.map(children, child => (
          <BodyShort size="small" className={styles['wordwrap']}>
            <strong>{`Behandlet aksjonspunkt: `}</strong>
            {child}
          </BodyShort>
        ))}
      </>
    );
  }
  return (
    <Alert variant="warning" size="small">
      {React.Children.map(children, (child: ReactNode) => (
        <div>
          <BodyShort size="small" className={styles['wordwrap']}>
            {child}
          </BodyShort>
        </div>
      ))}
    </Alert>
  );
};

export default AksjonspunktHelpText;

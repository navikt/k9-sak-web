import { Alert, BodyShort } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import styles from './aksjonspunktHelpText.module.css';

interface OwnProps {
  children: string[] | ReactNode[] | ReactNode;
  isAksjonspunktOpen: boolean;
}

const AksjonspunktHelpText = ({ isAksjonspunktOpen, children }: OwnProps & WrappedComponentProps) => {
  if (!children || (Array.isArray(children) && children.length === 0)) {
    return null;
  }
  if (!isAksjonspunktOpen) {
    return (
      <>
        {React.Children.map(children, child => (
          <BodyShort size="small" className={styles.wordwrap}>
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
          <BodyShort size="small" className={styles.wordwrap}>
            {child}
          </BodyShort>
        </div>
      ))}
    </Alert>
  );
};

export default injectIntl(AksjonspunktHelpText);

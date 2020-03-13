import React, { FunctionComponent, ReactNode } from 'react';
import Column from 'nav-frontend-grid/lib/column';
import { Undertittel } from 'nav-frontend-typografi';
import styles from './uttakFormKolonne.less';

interface UttakFormKolonneProps {
  tittel: string;
  withBorderRight?: boolean;
  children: ReactNode;
}

const UttakFormKolonne: FunctionComponent<UttakFormKolonneProps> = ({ children, tittel, withBorderRight = false }) => (
  <Column xs="4">
    <Undertittel className={styles.tittel} tag="h3">
      {tittel}
    </Undertittel>
    <div className={withBorderRight ? styles.uttakKolonneBorderRight : ''}>{children}</div>
  </Column>
);

export default UttakFormKolonne;

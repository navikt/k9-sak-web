import * as React from 'react';
import { OnePersonOutlineGray } from '@navikt/k9-react-components';
import { Normaltekst } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import { pathToFagsak } from '@k9-sak-web/sak-app/src/app/paths';
import styles from './relatertFagsak.less';

interface RelatertFagsakProps {
  saksnummer: string;
  fodselsnummer: string;
  name: string;
}

const RelatertFagsak = ({ saksnummer, fodselsnummer, name }: RelatertFagsakProps) => (
  <div className={styles.relatertFagsak}>
    <div className={styles.relatertFagsak__nameGenderContainer}>
      <OnePersonOutlineGray classname={styles.relatertFagsak__icon} />
      <Normaltekst className={styles.relatertFagsak__description}>Andre parter i saken:</Normaltekst>

      <Lenke className={styles.relatertFagsak__selector} href={`/k9/web${pathToFagsak(saksnummer)}`} target="_blank">
        <Normaltekst tag="span" className={styles.relatertFagsak__name}>
          {name}
        </Normaltekst>
      </Lenke>
    </div>
    <Normaltekst tag="span">/</Normaltekst>
    <div className={styles.relatertFagsak__centeredFlex}>
      <Normaltekst>{fodselsnummer}</Normaltekst>
    </div>
  </div>
);

export default RelatertFagsak;

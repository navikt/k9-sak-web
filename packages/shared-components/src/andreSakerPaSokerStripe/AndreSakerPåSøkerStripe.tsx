import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import { pathToFagsak } from '@k9-sak-web/sak-app/src/app/paths';
import { K9sakApiKeys, restApiHooks } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { Fagsak } from '@k9-sak-web/types';
import { Alert, Link } from '@navikt/ds-react';
import React, { useEffect } from 'react';
import styles from './andreSakerPåSøkerStripe.module.css';

interface Props {
  søkerIdent: string;
  saksnummer: string;
  fagsakYtelseType: string;
}

const AndreSakerPåSøkerStripe: React.FC<Props> = ({ søkerIdent, saksnummer, fagsakYtelseType }) => {
  const {
    startRequest: searchFagsaker,
    data: fagsaker = [],
    state: sokeStatus,
    error,
  } = restApiHooks.useRestApiRunner<Fagsak[]>(K9sakApiKeys.MATCH_FAGSAK);
  useEffect(() => {
    let isMounted = true;

    setTimeout(() => {
      if (isMounted) {
        searchFagsaker({
          ytelseType: fagsakYtelseType,
          bruker: søkerIdent,
        });
      }
    }, 3 * 1000);

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return (
      <Alert size="small" variant="error">
        Får ikke hentet andre saker knyttet til søker
      </Alert>
    );
  }
  const fagsakerPåSøker = fagsaker.filter(fagsak => fagsak.saksnummer !== saksnummer);

  if (sokeStatus !== RestApiState.SUCCESS || fagsakerPåSøker.length === 0) {
    return null;
  }

  const getFagsakLenker = () =>
    fagsakerPåSøker.map((fagsak, index) => {
      const harMerEnnEnFagsak = fagsakerPåSøker.length > 1;
      const fagsakErSisteILista = index === fagsakerPåSøker.length - 1;
      return (
        <Link
          key={fagsak.saksnummer}
          className={styles.fagsakLenke}
          href={`/k9/web${pathToFagsak(fagsak.saksnummer)}`}
          target="_blank"
        >
          {fagsak.saksnummer}
          {harMerEnnEnFagsak && !fagsakErSisteILista ? ',' : ''}
        </Link>
      );
    });

  return (
    <Alert size="small" variant="info">
      <div className={styles.fagsakLenkeContainer}>
        {`Andre saker knyttet til søker: `}
        {getFagsakLenker()}
      </div>
    </Alert>
  );
};
export default AndreSakerPåSøkerStripe;

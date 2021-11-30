import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import { pathToFagsak } from '@k9-sak-web/sak-app/src/app/paths';
import { K9sakApiKeys, restApiHooks } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { Fagsak } from '@k9-sak-web/types';
import { AlertStripeFeil, AlertStripeInfo } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import React, { useEffect } from 'react';
import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import styles from './andreSakerPåSøkerStripe.less';

interface Props {
  søkerIdent: string;
  saksnummer: string;
}

const AndreSakerPåSøkerStripe: React.FC<Props> = ({ søkerIdent, saksnummer }) => {
  const {
    startRequest: searchFagsaker,
    data: fagsaker = [],
    state: sokeStatus,
    error,
  } = restApiHooks.useRestApiRunner<Fagsak[]>(K9sakApiKeys.MATCH_FAGSAK);
  useEffect(() => {
    searchFagsaker({
      ytelseType: FagsakYtelseType.PLEIEPENGER,
      bruker: søkerIdent,
    });
  }, []);

  if (error) {
    return <AlertStripeFeil>Får ikke hentet andre saker knyttet til søker</AlertStripeFeil>;
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
        <Lenke
          key={fagsak.saksnummer}
          className={styles.fagsakLenke}
          href={`/k9/web${pathToFagsak(fagsak.saksnummer)}`}
          target="_blank"
        >
          {fagsak.saksnummer}
          {harMerEnnEnFagsak && !fagsakErSisteILista ? ',' : ''}
        </Lenke>
      );
    });

  return (
    <AlertStripeInfo>
      <div className={styles.fagsakLenkeContainer}>
        {`Andre saker knyttet til søker: `}
        {getFagsakLenker()}
      </div>
    </AlertStripeInfo>
  );
};
export default AndreSakerPåSøkerStripe;

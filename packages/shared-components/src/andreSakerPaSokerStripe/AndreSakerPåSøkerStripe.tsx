import { httpErrorHandler } from '@fpsak-frontend/utils';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { pathToFagsak } from '@k9-sak-web/sak-app/src/app/paths';
import { Fagsak } from '@k9-sak-web/types';
import { Alert, Link } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import styles from './andreSakerPåSøkerStripe.module.css';

interface Props {
  søkerIdent: string;
  saksnummer: string;
  fagsakYtelseType: string;
}

const AndreSakerPåSøkerStripe: React.FC<Props> = ({ søkerIdent, saksnummer, fagsakYtelseType }) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();

  const {
    data: fagsaker,
    error,
    isSuccess,
  } = useQuery<Fagsak[]>({
    queryKey: ['andreFagsaker', { fagsakYtelseType, søkerIdent }],
    queryFn: async ({ signal }) =>
      axios
        .post(`/k9/sak/api/fagsak/match`, { ytelseType: fagsakYtelseType, bruker: søkerIdent }, { signal })
        .then(({ data }) => data)
        .catch(error => {
          httpErrorHandler(error?.response?.status, addErrorMessage, error?.response?.headers?.location);
        }),
    initialData: [],
  });

  if (error) {
    return (
      <Alert size="small" variant="error">
        Får ikke hentet andre saker knyttet til søker
      </Alert>
    );
  }
  const andreFagsakerPåSøker = fagsaker.filter(fagsak => fagsak.saksnummer !== saksnummer);

  if (!isSuccess || andreFagsakerPåSøker.length === 0) {
    return null;
  }

  const getFagsakLenker = () =>
    andreFagsakerPåSøker.map((fagsak, index) => {
      const harMerEnnEnFagsak = andreFagsakerPåSøker.length > 1;
      const fagsakErSisteILista = index === andreFagsakerPåSøker.length - 1;
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

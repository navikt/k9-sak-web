import { pathToFagsak } from '@k9-sak-web/gui/utils/paths.js';
import { Alert, Link } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import type { K9StatusBackendApi } from '../K9StatusBackendApi';
import styles from './andreSakerPåSøkerStripe.module.css';
interface Props {
  saksnummer: string;
  behandlingUuid: string;
  api: K9StatusBackendApi;
}

const AndreSakerPåSøkerStripe: React.FC<Props> = ({ saksnummer, api, behandlingUuid }) => {
  const {
    data: fagsaker,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ['andreFagsaker', { behandlingUuid }],
    queryFn: () => api.getAndreSakerPåSøker(behandlingUuid),
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

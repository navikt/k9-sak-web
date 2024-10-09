import { LinkPanel } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import VisittkortSakIndex from '@fpsak-frontend/sak-visittkort';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types/KodeverkType.js';
import { Fagsak, FagsakPerson } from '@k9-sak-web/types';
import { pathToFagsak } from '@k9-sak-web/sak-app/src/app/paths';

import styles from './aktoerGrid.module.css';

interface OwnProps {
  aktorInfo: {
    fagsaker: Fagsak[];
    person: FagsakPerson;
  };
}

const AktoerGrid = ({ aktorInfo }: OwnProps) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();

  return (
    <>
      <VisittkortSakIndex fagsakPerson={aktorInfo.person} />
      <div className={styles.list}>
        {aktorInfo.fagsaker.length ? (
          aktorInfo.fagsaker.map(fagsak => (
            <LinkPanel key={fagsak.saksnummer} href={`/k9/web${pathToFagsak(fagsak.saksnummer)}`}>
              <LinkPanel.Description>
                {kodeverkNavnFraKode(fagsak.sakstype, KodeverkType.FAGSAK_YTELSE)}
                {` (${fagsak.saksnummer}) `}
                {kodeverkNavnFraKode(fagsak.status, KodeverkType.FAGSAK_STATUS)}
              </LinkPanel.Description>
            </LinkPanel>
          ))
        ) : (
          <FormattedMessage id="AktoerGrid.IngenFagsaker" />
        )}
      </div>
    </>
  );
};

export default AktoerGrid;

import Lenkepanel from 'nav-frontend-lenkepanel';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import VisittkortSakIndex from '@fpsak-frontend/sak-visittkort';
import { Fagsak, FagsakPerson } from '@k9-sak-web/types';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';

import styles from './aktoerGrid.module.css';

interface OwnProps {
  aktorInfo: {
    fagsaker: Fagsak[];
    person: FagsakPerson;
  };
  finnPathToFagsak: (saksnummer: string) => string;
}

const AktoerGrid = ({ aktorInfo, finnPathToFagsak }: OwnProps) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();

  return (
    <>
      <VisittkortSakIndex fagsakPerson={aktorInfo.person} />
      <div className={styles.list}>
        {aktorInfo.fagsaker.length ? (
          aktorInfo.fagsaker.map(fagsak => (
            <Lenkepanel
              linkCreator={props => (
                <Link to={finnPathToFagsak(fagsak.saksnummer)} className={props.className}>
                  {props.children}
                </Link>
              )}
              key={fagsak.saksnummer}
              href="#"
              tittelProps="normaltekst"
            >
              {kodeverkNavnFraKode(fagsak.sakstype, KodeverkType.FAGSAK_YTELSE)}
              {` (${fagsak.saksnummer}) `}
              {kodeverkNavnFraKode(fagsak.status, KodeverkType.FAGSAK_STATUS)}
            </Lenkepanel>
          ))
        ) : (
          <FormattedMessage id="AktoerGrid.IngenFagsaker" />
        )}
      </div>
    </>
  );
};

export default AktoerGrid;

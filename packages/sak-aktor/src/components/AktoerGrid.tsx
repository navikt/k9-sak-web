import Lenkepanel from 'nav-frontend-lenkepanel';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import VisittkortSakIndex from '@fpsak-frontend/sak-visittkort';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import { Fagsak, FagsakPerson, KodeverkMedNavn } from '@k9-sak-web/types';

import styles from './aktoerGrid.css';

interface OwnProps {
  aktorInfo: {
    fagsaker: Fagsak[];
    person: FagsakPerson;
  };
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  finnPathToFagsak: (saksnummer: string) => string;
}

const AktoerGrid = ({ aktorInfo, alleKodeverk, finnPathToFagsak }: OwnProps) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);

  return (
    <>
      <VisittkortSakIndex alleKodeverk={alleKodeverk} fagsakPerson={aktorInfo.person} />
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
              {getKodeverknavn(fagsak.sakstype)}
              {` (${fagsak.saksnummer}) `}
              {getKodeverknavn(fagsak.status)}
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

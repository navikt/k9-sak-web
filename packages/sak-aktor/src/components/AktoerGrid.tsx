import { LinkPanel } from '@navikt/ds-react';
import { FormattedMessage } from 'react-intl';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import { pathToFagsak } from '@k9-sak-web/sak-app/src/app/paths';
import { Fagsak, FagsakPerson, KodeverkMedNavn } from '@k9-sak-web/types';

import VisittkortPanel from '@k9-sak-web/gui/sak/visittkort/VisittkortPanel.js';
import styles from './aktoerGrid.module.css';
import { KodeverkTypeV2 } from '@k9-sak-web/lib/kodeverk/types.js';

interface OwnProps {
  aktorInfo: {
    fagsaker: Fagsak[];
    person: FagsakPerson;
  };
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
}

const AktoerGrid = ({ aktorInfo, alleKodeverk }: OwnProps) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);

  return (
    <>
      <VisittkortPanel fagsakPerson={aktorInfo.person} />
      <div className={styles.list}>
        {aktorInfo.fagsaker.length ? (
          aktorInfo.fagsaker.map(fagsak => (
            <LinkPanel key={fagsak.saksnummer} href={`/k9/web${pathToFagsak(fagsak.saksnummer)}`}>
              <LinkPanel.Description>
                {kodeverkNavnFraKode(fagsak.sakstype, KodeverkTypeV2.FAGSAK_YTELSE)}
                {` (${fagsak.saksnummer}) `}
                {getKodeverknavn(fagsak.status)}
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

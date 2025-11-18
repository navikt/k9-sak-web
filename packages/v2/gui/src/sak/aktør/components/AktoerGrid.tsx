import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import VisittkortPanel from '@k9-sak-web/gui/sak/visittkort/VisittkortPanel.js';
import { pathToFagsak } from '@k9-sak-web/gui/utils/paths.js';
import { KodeverkTypeV2 } from '@k9-sak-web/lib/kodeverk/types.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types/KodeverkType.js';
import { LinkPanel } from '@navikt/ds-react';
import type { Aktørinfo } from '../Aktørinfo';
import styles from './aktoerGrid.module.css';
interface OwnProps {
  aktorInfo: Aktørinfo;
}

const AktoerGrid = ({ aktorInfo }: OwnProps) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();

  return (
    <>
      {aktorInfo.person && <VisittkortPanel fagsakPerson={aktorInfo.person} />}
      <div className={styles.list}>
        {aktorInfo.fagsaker?.length
          ? aktorInfo.fagsaker.map(fagsak => (
              <LinkPanel key={fagsak.saksnummer} href={`/k9/web${pathToFagsak(fagsak.saksnummer)}`}>
                <LinkPanel.Description>
                  {kodeverkNavnFraKode(fagsak.sakstype, KodeverkTypeV2.FAGSAK_YTELSE)}
                  {` (${fagsak.saksnummer}) `}
                  {fagsak.status ? kodeverkNavnFraKode(fagsak.status, KodeverkType.FAGSAK_STATUS) : null}
                </LinkPanel.Description>
              </LinkPanel>
            ))
          : 'Har ingen fagsaker i k9sak'}
      </div>
    </>
  );
};

export default AktoerGrid;

// LEGACY-UTTAK: Slettes når feature toggle NYTT_UTTAK_PANEL fjernes. Ikke endre.
import type KvoteInfo from './KvoteInfo';
import AntallDagerLivetsSluttfaseIndex from './AntallDagerLivetsSluttfaseIndex';

export default {
  title: 'gui/prosess/Uttak-legacy/antall-dager-livets-sluttfase',
  component: AntallDagerLivetsSluttfaseIndex,
};

const kvoteInfo: KvoteInfo = {
  maxDato: '2021-02-20',
  totaltForbruktKvote: 20,
};

export const antallDagerLivetsSluttfaseIndex = () => (
  <>
    <hr />
    <h3>Forbruk: 20 dager</h3>
    <AntallDagerLivetsSluttfaseIndex kvoteInfo={kvoteInfo} />
    <hr />
    <h3>Forbruk: 60 dager</h3>
    <AntallDagerLivetsSluttfaseIndex kvoteInfo={{ ...kvoteInfo, totaltForbruktKvote: 60 }} />
    <hr />
    <h3>Forbruk: 70 dager</h3>
    <AntallDagerLivetsSluttfaseIndex kvoteInfo={{ ...kvoteInfo, totaltForbruktKvote: 70 }} />
  </>
);

import KvoteInfo from '@k9-sak-web/behandling-pleiepenger-sluttfase/src/types/KvoteInfo';
import AntallDagerLivetsSluttfaseIndex from '@k9-sak-web/prosess-uttak-antall-dager-sluttfase/src/AntallDagerLivetsSluttfaseIndex';
import React from 'react';

export default {
  title: 'prosess/antall-dager-livets-sluttfase',
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

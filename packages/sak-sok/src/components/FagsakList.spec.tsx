import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { Fagsak } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
import React from 'react';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { BehandlingType } from '@k9-sak-web/lib/types/index.js';

import messages from '../../i18n/nb_NO.json';
import FagsakList, { sortFagsaker } from './FagsakList';

describe('<FagsakList>', () => {
  const fagsak: Fagsak = {
    saksnummer: '12345',
    sakstype: 'ES', // FAGSAK_YTELSE_KODEVERK
    relasjonsRolleType: 'TEST',
    status: 'UBEH', // FAGSAK_STATUS_KODEVERK
    barnFodt: null,
    opprettet: '2019-02-17T13:49:18.645',
    endret: '2019-02-17T13:49:18.645',
    antallBarn: 1,
    kanRevurderingOpprettes: false,
    skalBehandlesAvInfotrygd: false,
    dekningsgrad: 100,
  } as Fagsak;

  it('skal vise en tabell med en rad og tilhørende kolonnedata', () => {
    const clickFunction = vi.fn();
    renderWithIntl(
      <KodeverkProvider
        behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <FagsakList fagsaker={[fagsak]} selectFagsakCallback={clickFunction} />
      </KodeverkProvider>,
      { messages },
    );
    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.getByText('Engangsstønad')).toBeInTheDocument();
    expect(screen.getByText('Under behandling')).toBeInTheDocument();
  });

  it('skal sortere søkeresultat der avsluttede skal vises sist, mens sist endrede skal vises først', () => {
    const fagsak2 = {
      saksnummer: '23456',
      sakstype: 'ES', // FAGSAK_YTELSE_KODEVERK
      relasjonsRolleType: 'TEST',
      status: 'UBEH', // FAGSAK_STATUS_KODEVERK
      barnFodt: null,
      opprettet: '2019-02-18T13:49:18.645',
      endret: '2019-02-18T13:49:18.645',
      dekningsgrad: 100,
    } as Fagsak;

    const fagsak3 = {
      saksnummer: '34567',
      sakstype: 'ES', // FAGSAK_YTELSE_KODEVERK
      status: 'AVSLU', // FAGSAK_STATUS_KODEVERK
      barnFodt: null,
      opprettet: '2019-02-18T13:49:18.645',
      endret: '2019-02-18T13:49:18.645',
      dekningsgrad: 100,
    } as Fagsak;

    const fagsaker = [fagsak, fagsak2, fagsak3];
    const sorterteFagsaker = sortFagsaker(fagsaker);
    expect(sorterteFagsaker[0]).toEqual(fagsaker[1]);
    expect(sorterteFagsaker[1]).toEqual(fagsaker[0]);
    expect(sorterteFagsaker[2]).toEqual(fagsaker[2]);
  });
});

import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { Fagsak, KodeverkMedNavn } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import FagsakList, { sortFagsaker } from './FagsakList';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { KodeverkTypeV2 } from '@k9-sak-web/lib/kodeverk/types.js';

const FAGSAK_STATUS_KODEVERK = 'FAGSAK_STATUS';

const alleKodeverk = {
  [kodeverkTyper.FAGSAK_STATUS]: [
    {
      kode: fagsakStatus.UNDER_BEHANDLING,
      navn: 'Under behandling',
      kodeverk: FAGSAK_STATUS_KODEVERK,
    },
    {
      kode: fagsakStatus.AVSLUTTET,
      navn: 'Avsluttet',
      kodeverk: FAGSAK_STATUS_KODEVERK,
    },
  ],
  [KodeverkTypeV2.FAGSAK_YTELSE]: [
    {
      kode: fagsakYtelsesType.ES,
      navn: 'Engangsstønad',
      kodeverk: KodeverkTypeV2.FAGSAK_YTELSE,
    },
  ],
};

describe('<FagsakList>', () => {
  const fagsak = {
    saksnummer: '12345',
    sakstype: fagsakYtelsesType.ES,
    relasjonsRolleType: {
      kode: 'TEST',
      kodeverk: '',
    },
    status: {
      kode: 'UBEH',
      kodeverk: FAGSAK_STATUS_KODEVERK,
    },
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
        behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <FagsakList
          fagsaker={[fagsak]}
          selectFagsakCallback={clickFunction}
          alleKodeverk={alleKodeverk as unknown as { [key: string]: [KodeverkMedNavn] }}
        />
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
      sakstype: fagsakYtelsesType.ES,
      relasjonsRolleType: {
        kode: 'TEST',
        kodeverk: '',
      },
      status: {
        kode: 'UBEH',
        kodeverk: FAGSAK_STATUS_KODEVERK,
      },
      barnFodt: null,
      opprettet: '2019-02-18T13:49:18.645',
      endret: '2019-02-18T13:49:18.645',
      dekningsgrad: 100,
    } as Fagsak;

    const fagsak3 = {
      saksnummer: '34567',
      sakstype: fagsakYtelsesType.ES,
      status: {
        kode: 'AVSLU',
        kodeverk: FAGSAK_STATUS_KODEVERK,
      },
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

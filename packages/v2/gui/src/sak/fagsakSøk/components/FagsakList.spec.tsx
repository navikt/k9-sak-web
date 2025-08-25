import {
  k9_kodeverk_behandling_FagsakStatus as fagsakStatus,
  k9_kodeverk_behandling_FagsakYtelseType as fagsakYtelseType,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { sortFagsaker } from './FagsakList';

describe('<FagsakList>', () => {
  it('skal sortere søkeresultat der avsluttede skal vises sist, mens sist endrede skal vises først', () => {
    const fagsak = {
      saksnummer: '12345',
      sakstype: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
      status: fagsakStatus.UNDER_BEHANDLING,
      opprettet: '2019-02-17T13:49:18.645',
      endret: '2019-02-17T13:49:18.645',
    };
    const fagsak2 = {
      saksnummer: '23456',
      sakstype: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
      status: fagsakStatus.UNDER_BEHANDLING,
      opprettet: '2019-02-18T13:49:18.645',
      endret: '2019-02-18T13:49:18.645',
    };

    const fagsak3 = {
      saksnummer: '34567',
      sakstype: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
      status: fagsakStatus.AVSLUTTET,
      opprettet: '2019-02-18T13:49:18.645',
      endret: '2019-02-18T13:49:18.645',
    };

    const fagsaker = [fagsak, fagsak2, fagsak3];
    const sorterteFagsaker = sortFagsaker(fagsaker);
    expect(sorterteFagsaker[0]).toEqual(fagsaker[1]);
    expect(sorterteFagsaker[1]).toEqual(fagsaker[0]);
    expect(sorterteFagsaker[2]).toEqual(fagsaker[2]);
  });
});

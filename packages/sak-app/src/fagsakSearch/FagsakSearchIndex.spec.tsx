import React from 'react';
import { shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

import { Fagsak } from '@k9-sak-web/types';
import FagsakSokSakIndex from '@fpsak-frontend/sak-sok';

import { requestApi, K9sakApiKeys } from '../data/k9sakApi';
import FagsakSearchIndex from './FagsakSearchIndex';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useNavigate: () => mockNavigate,
}));

describe('<FagsakSearchIndex>', () => {
  const fagsak: Partial<Fagsak> = {
    saksnummer: '12345',
    sakstype: {
      kode: 'ES',
      kodeverk: 'test',
    },
    status: {
      kode: 'OPPR',
      kodeverk: 'test',
    },
    barnFodt: '10.10.2017',
    antallBarn: 1,
    opprettet: '13‎.‎02‎.‎2017‎ ‎09‎:‎54‎:‎22',
    dekningsgrad: 100,
  };
  const fagsak2: Partial<Fagsak> = {
    ...fagsak,
    saksnummer: '23456',
  };
  const fagsaker = [fagsak, fagsak2];

  it('skal søke opp fagsaker', () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, {});
    requestApi.mock(K9sakApiKeys.SEARCH_FAGSAK, fagsaker);

    const wrapper = shallow(<FagsakSearchIndex />);

    const fagsakSearchIndex = wrapper.find(FagsakSokSakIndex);
    expect(fagsakSearchIndex).toHaveLength(1);

    expect(fagsakSearchIndex.prop('fagsaker')).toEqual([]);

    const sok = fagsakSearchIndex.prop('searchFagsakCallback');
    sok();

    expect(wrapper.find(FagsakSokSakIndex).prop('fagsaker')).toEqual(fagsaker);
  });

  it('skal gå til valgt fagsak', () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, {});
    requestApi.mock(K9sakApiKeys.SEARCH_FAGSAK, fagsaker);

    const wrapper = shallow(<FagsakSearchIndex />, { wrappingComponent: MemoryRouter });

    const fagsakSearchIndex = wrapper.find(FagsakSokSakIndex);
    const velgFagsak = fagsakSearchIndex.prop('selectFagsakCallback') as (event: any, saksnummer: string) => undefined;
    velgFagsak('', fagsak.saksnummer);

    expect(mockNavigate).toHaveBeenCalledWith(`/fagsak/${fagsak.saksnummer}/`);
  });
});

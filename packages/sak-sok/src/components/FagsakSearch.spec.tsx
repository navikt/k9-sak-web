import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import FagsakSearch from './FagsakSearch';
import FagsakList from './FagsakList';
import SearchForm from './SearchForm';

describe('<FagsakSearch>', () => {
  const fagsak = {
    saksnummer: '12345',
    sakstype: 'TEST',
    relasjonsRolleType: 'TEST',
    status: 'UBEH',
    barnFodt: '13‎.‎02‎.‎2017‎',
    opprettet: '13‎.‎02‎.‎2017‎ ‎09‎:‎54‎:‎22',
    endret: '13‎.‎02‎.‎2017‎',
    antallBarn: 1,
    kanRevurderingOpprettes: false,
    skalBehandlesAvInfotrygd: false,
    person: {
      erDod: false,
      navn: 'Frida',
      alder: 44,
      personnummer: '0405198632231',
      erKvinne: true,
      personstatusType: 'TEST',
    },
    dekningsgrad: 100,
  };

  it('skal kun vise søkefelt før søk er startet', () => {
    const searchFagsakFunction = sinon.spy();
    const wrapper = shallow(
      <FagsakSearch
        fagsaker={[]}
        searchFagsakCallback={searchFagsakFunction}
        searchResultReceived={false}
        selectFagsakCallback={sinon.spy()}
        searchStarted
        alleKodeverk={{}}
      />,
    );

    const searchComp = wrapper.find(SearchForm);
    expect(searchComp).toHaveLength(1);
    expect(wrapper.find('Label')).toHaveLength(0);
    expect(wrapper.find(FagsakList)).toHaveLength(0);
  });

  it('skal vise søkefelt og label for ingen søketreff når ingen fagsaker blir hentet', () => {
    const wrapper = shallow(
      <FagsakSearch
        fagsaker={[]}
        searchFagsakCallback={sinon.spy()}
        searchResultReceived
        selectFagsakCallback={sinon.spy()}
        searchStarted
        alleKodeverk={{}}
      />,
    );

    expect(wrapper.find(SearchForm)).toHaveLength(1);
    const labelComp = wrapper.find('Normaltekst');
    expect(labelComp).toHaveLength(1);
    expect(labelComp.find('MemoizedFormattedMessage').prop('id')).toEqual('FagsakSearch.ZeroSearchResults');
  });

  it('skal vise søkefelt og søketreff der to fagsaker blir vist', () => {
    const searchFagsakFunction = sinon.spy();
    const selectFagsakFunction = sinon.spy();
    const wrapper = shallow(
      <FagsakSearch
        fagsaker={[fagsak, fagsak]}
        searchFagsakCallback={searchFagsakFunction}
        searchResultReceived
        selectFagsakCallback={selectFagsakFunction}
        searchStarted
        alleKodeverk={{}}
      />,
    );

    expect(wrapper.find(SearchForm)).toHaveLength(1);
    expect(wrapper.find('Label')).toHaveLength(0);

    const fagsakListComp = wrapper.find(FagsakList);
    expect(fagsakListComp).toHaveLength(1);
    expect(fagsakListComp.prop('fagsaker')).toEqual([fagsak, fagsak]);
    expect(fagsakListComp.prop('selectFagsakCallback')).toEqual(selectFagsakFunction);
  });
});

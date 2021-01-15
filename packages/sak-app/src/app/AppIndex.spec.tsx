import React from 'react';
import { shallow } from 'enzyme';
import { History } from 'history';
import { match } from 'react-router-dom';

import AppIndex from './AppIndex';
import Home from './components/Home';
import Dekorator from './components/Dekorator';
import { requestApi, K9sakApiKeys } from '../data/k9sakApi';

describe('<AppIndex>', () => {
  const locationMock = {
    pathname: 'test',
    search: 'test',
    state: {},
    hash: 'test',
  };

  it('skal vise hjem-skjermbilde', () => {
    requestApi.mock(K9sakApiKeys.NAV_ANSATT, { navn: 'Peder' });
    const wrapper = shallow(
      <AppIndex.WrappedComponent location={locationMock} history={{} as History} match={{} as match} />,
    );
    expect(wrapper.find(Dekorator)).toHaveLength(1);
    expect(wrapper.find(Home)).toHaveLength(1);
  });

  it('skal vise query-feilmelding', () => {
    requestApi.mock(K9sakApiKeys.NAV_ANSATT, { navn: 'Peder' });
    const location = {
      search: '?errormessage=Det+finnes+ingen+sak+med+denne+referansen%3A+266',
    };

    const wrapper = shallow(
      <AppIndex.WrappedComponent
        location={{ ...locationMock, ...location }}
        history={{} as History}
        match={{} as match}
      />,
    );

    const headerComp = wrapper.find(Dekorator);
    expect(headerComp.prop('queryStrings')).toEqual({ errormessage: 'Det finnes ingen sak med denne referansen: 266' });
  });
});

import React from 'react';
import { shallow } from 'enzyme';

import AppIndex from './AppIndex';
import Home from './components/Home';
import Dekorator from './components/Dekorator';
import { requestApi, K9sakApiKeys } from '../data/k9sakApi';

const mockUseLocationValue = {
  pathname: '',
  search: '',
  state: {},
  hash: '',
};

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useLocation: vi.fn().mockImplementation(() => mockUseLocationValue),
}));

afterEach(() => {
  mockUseLocationValue.pathname = '';
  mockUseLocationValue.search = '';
  mockUseLocationValue.state = {};
  mockUseLocationValue.hash = '';
});

describe('<AppIndex>', () => {
  it('skal vise hjem-skjermbilde', () => {
    requestApi.mock(K9sakApiKeys.NAV_ANSATT, { navn: 'Peder' });
    mockUseLocationValue.pathname = 'test';
    const wrapper = shallow(<AppIndex />);
    expect(wrapper.find(Dekorator)).toHaveLength(1);
    expect(wrapper.find(Home)).toHaveLength(1);
  });

  it('skal vise query-feilmelding', () => {
    requestApi.mock(K9sakApiKeys.NAV_ANSATT, { navn: 'Peder' });
    mockUseLocationValue.search = '?errormessage=Det+finnes+ingen+sak+med+denne+referansen%3A+266';
    const wrapper = shallow(<AppIndex />);
    const headerComp = wrapper.find(Dekorator);
    expect(headerComp.prop('queryStrings')).toEqual({ errormessage: 'Det finnes ingen sak med denne referansen: 266' });
  });
});

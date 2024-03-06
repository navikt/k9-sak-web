/* eslint-disable vitest/no-commented-out-tests */

// import Dekorator from './components/Dekorator';

const mockUseLocationValue = {
  pathname: '',
  search: '',
  state: {},
  hash: '',
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useLocation: vi.fn().mockImplementation(() => mockUseLocationValue),
  };
});

afterEach(() => {
  mockUseLocationValue.pathname = '';
  mockUseLocationValue.search = '';
  mockUseLocationValue.state = {};
  mockUseLocationValue.hash = '';
});

describe.skip('<AppIndex>', () => {
  // it('skal vise hjem-skjermbilde', () => {
  //   requestApi.mock(K9sakApiKeys.NAV_ANSATT, { navn: 'Peder' });
  //   mockUseLocationValue.pathname = 'test';
  //   const wrapper = shallow(<AppIndex />);
  //   expect(wrapper.find(Dekorator)).toHaveLength(1);
  //   expect(wrapper.find(Home)).toHaveLength(1);
  // });
  // it('skal vise query-feilmelding', () => {
  //   requestApi.mock(K9sakApiKeys.NAV_ANSATT, { navn: 'Peder' });
  //   mockUseLocationValue.search = '?errormessage=Det+finnes+ingen+sak+med+denne+referansen%3A+266';
  //   const wrapper = shallow(<AppIndex />);
  //   const headerComp = wrapper.find(Dekorator);
  //   expect(headerComp.prop('queryStrings')).toEqual({ errormessage: 'Det finnes ingen sak med denne referansen: 266' });
  // });
});

/* eslint-disable vitest/no-commented-out-tests */
// import Dekorator from './Dekorator';

const navAnsatt = {
  brukernavn: 'Test',
  kanBehandleKode6: false,
  kanBehandleKode7: false,
  kanBehandleKodeEgenAnsatt: false,
  kanBeslutte: true,
  kanOverstyre: false,
  kanSaksbehandle: true,
  kanVeilede: false,
  navn: 'Test',
};

let contextStubHistory;
afterEach(() => {
  if (contextStubHistory) {
    contextStubHistory.restore();
  }
});

describe.skip('<Dekorator>', () => {
  // it('skal vise søkeskjermbildet, men ikke systemstatuser', () => {
  //   requestApi.mock(K9sakApiKeys.NAV_ANSATT, navAnsatt);
  //   const wrapper = shallowWithIntl(
  //     <Dekorator.WrappedComponent
  //       intl={intlMock}
  //       queryStrings={{}}
  //       setSiteHeight={sinon.spy()}
  //       pathname="/fagsak/ABC39/"
  //     />,
  //   );
  //   const header = wrapper.find(HeaderWithErrorPanel);
  //   expect(header.length).toBe(1);
  // });
  // it('skal vise feilmeldinger', () => {
  //   requestApi.mock(K9sakApiKeys.NAV_ANSATT, navAnsatt);
  //   contextStubHistory = sinon.stub(useRestApiError, 'default').returns([
  //     {
  //       type: EventType.REQUEST_ERROR,
  //       feilmelding: 'Dette er en feilmelding',
  //     },
  //   ]);
  //   const wrapper = shallowWithIntl(
  //     <Dekorator.WrappedComponent intl={intlMock} queryStrings={{}} setSiteHeight={sinon.spy()} pathname="test" />,
  //   );
  //   const header = wrapper.find(HeaderWithErrorPanel);
  //   expect(header.prop('errorMessages')).toEqual([
  //     {
  //       message: 'Dette er en feilmelding',
  //       additionalInfo: undefined,
  //     },
  //   ]);
  // });
});

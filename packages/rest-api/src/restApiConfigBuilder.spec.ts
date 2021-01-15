import RestApiConfigBuilder from './RestApiConfigBuilder';

describe('RestApiConfigBuilder', () => {
  it('skal lage config med to rest endepunkter', () => {
    const endpoints = new RestApiConfigBuilder()
      .withGet('www.pjokken.com', 'PJOKKEN')
      .withPost('www.espenutvikler.com', 'ESPENUTVIKLER')
      .build();

    expect(endpoints).toHaveLength(2);
    expect(endpoints[0].name).toEqual('PJOKKEN');
    expect(endpoints[0].path).toEqual('www.pjokken.com');
    expect(endpoints[0].restMethod).toEqual('GET');
    expect(endpoints[0].config).toEqual({
      maxPollingLimit: undefined,
      isResponseBlob: false,
    });

    expect(endpoints[1].name).toEqual('ESPENUTVIKLER');
    expect(endpoints[1].path).toEqual('www.espenutvikler.com');
    expect(endpoints[1].restMethod).toEqual('POST');
    expect(endpoints[1].config).toEqual({
      maxPollingLimit: undefined,
      isResponseBlob: false,
    });
  });
});

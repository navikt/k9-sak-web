Håndterer rest-kall mot backend via Axios.

Eksempel: 
```javascript
import { createRequestApi, RequestConfig } from '@k9-sak-web/rest-api';

const requestConfigs: [
    new RequestConfig('FAGSAK_SOK', '/api/fagsak/sok').withGetMethod(),
    new RequestConfig('LAGRE_FAGSAK', '/api/fagsak/lagre').withPostMethod()
];
const requestApi = createRequestApi(requestConfigs);

//Utfør kall (responsen vil være et Promise med data på formatet {payload: responsdata})
const params = {saksnummer: 1};
const payload = requestApi.startRequest('FAGSAK_SOK', params);
```


Forenkling av oppsett av endepunktene ved bruk av builder:
```javascript
import { createRequestApi, RestApiConfigBuilder } from '@k9-sak-web/rest-api';

const endpoints = new RestApiConfigBuilder()
  .withGet('/api/fagsak/sok', 'FAGSAK_SOK')
  .withPost('/api/fagsak/lagre', 'LAGRE_FAGSAK')
  .build();

const requestApi = createRequestApi(endpoints);
```


Konfigurering av ekstra parametere for et request: (Med og uten bruk av builder.)
```javascript
    new RequestConfig('FAGSAK_SOK', '/api/fagsak/sok', {maxPollingLimit: 100}).withAsyncGetMethod()
    new RestApiConfigBuilder().withAsyncPost('/api/behandlinger', 'FAGSAK_SOK', {maxPollingLimit: 100})
```
For en oversikt over parametere, se "defaultConfig" i RequestConfig-klassen.

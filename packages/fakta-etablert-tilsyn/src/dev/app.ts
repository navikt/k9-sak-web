/* eslint-disable no-console */
import '@navikt/ds-css';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import renderers from '../util/renderers';

const data = {
  readOnly: false,
  endpoints: {
    tilsyn: 'http://localhost:8082/mock/tilsyn',
    sykdom: 'http://localhost:8082/mock/sykdom',
    sykdomInnleggelse: 'http://localhost:8082/mock/sykdomInnleggelse',
  },
  onFinished: () => console.log('Aksjonspunkt løst'),
  beredskapMåVurderes: true,
  nattevåkMåVurderes: true,
  httpErrorHandler: undefined,
  lagreBeredskapvurdering: undefined,
  lagreNattevåkvurdering: undefined,
  harAksjonspunktForBeredskap: true,
  harAksjonspunktForNattevåk: true,
};

(window as any).renderTilsynApp = async appId => {
  const { renderAppInSuccessfulState } = renderers;
  renderAppInSuccessfulState(appId, data);
};

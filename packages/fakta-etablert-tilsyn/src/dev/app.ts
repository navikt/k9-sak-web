import renderers from '../util/renderers';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import '@navikt/ds-css';

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
  saksbehandlere: [],
};

(window as any).renderTilsynApp = async appId => {
  const { renderAppInSuccessfulState } = renderers;
  renderAppInSuccessfulState(appId, data);
};

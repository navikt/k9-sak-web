import renderers from '../util/renderers';
import './devStyles.css';
import ContainerContract from '../types/ContainerContract';
import '@navikt/ft-plattform-komponenter/dist/style.css';

interface ExtendedWindow extends Window {
  renderOmBarnetApp: (id: string, contract: ContainerContract) => void;
}

const data = {
  readOnly: false,
  endpoints: {
    rettVedDod: 'http://localhost:8082/mock/rettVedDod',
    omPleietrengende: 'http://localhost:8082/mock/omPleietrengende',
  },
  httpErrorHandler: undefined,
  onFinished: undefined,
};

(window as Partial<ExtendedWindow>).renderOmBarnetApp = async appId => {
  const { renderAppInSuccessfulState } = renderers;
  renderAppInSuccessfulState(appId, data);
};

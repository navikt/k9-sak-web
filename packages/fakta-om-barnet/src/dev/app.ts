import renderers from '../util/renderers';
import './devStyles.css';
import ContainerContract from '../types/ContainerContract';
import '@navikt/ft-plattform-komponenter/dist/style.css';

interface ExtendedWindow extends Window {
  renderOmBarnetApp: (id: string, contract: ContainerContract) => void;
}

(window as Partial<ExtendedWindow>).renderOmBarnetApp = async (appId, data) => {
  const { renderAppInSuccessfulState } = renderers;
  renderAppInSuccessfulState(appId, data);
};

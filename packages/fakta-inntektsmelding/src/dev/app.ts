import renderers from '../util/renderers';
import ContainerContract from '../types/ContainerContract';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import '@navikt/ds-css';

interface ExtendedWindow extends Window {
  renderKompletthetApp: (id: string, contract: ContainerContract) => void;
}

(window as Partial<ExtendedWindow>).renderKompletthetApp = async (appId, data) => {
  const { renderAppInSuccessfulState } = renderers;
  renderAppInSuccessfulState(appId, data);
};

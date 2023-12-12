import renderers from '../util/renderers';
import ContainerContract from '../types/ContainerContract';
import '@navikt/ds-css';
import '@navikt/ft-plattform-komponenter/dist/style.css';

interface ExtendedWindow extends Window {
  renderUttakApp: (id: string, contract: ContainerContract) => void;
}

(window as Partial<ExtendedWindow>).renderUttakApp = async (appId, data) => {
  const { renderAppInSuccessfulState } = renderers;
  renderAppInSuccessfulState(appId, data);
};

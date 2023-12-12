import { ContainerContract } from '../types/ContainerContract';
import renderers from '../util/renderers';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import '@navikt/ds-css';

interface ExtendedWindow extends Window {
  renderOmsorgenForApp: (id: string, contract: ContainerContract) => void;
}

(window as Partial<ExtendedWindow>).renderOmsorgenForApp = async (appId, data) => {
  const { renderAppInSuccessfulState } = renderers;
  renderAppInSuccessfulState(appId, data);
};

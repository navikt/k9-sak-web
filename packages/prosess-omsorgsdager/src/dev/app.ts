import renderers from '../util/renderers';
import ContainerContract from '../types/ContainerContract';
import '@navikt/ds-css';

// test
(window as any).renderMicrofrontendOmsorgsdagerApp = async (appId, data: ContainerContract) => {
  const { renderAppInSuccessfulState } = renderers;
  renderAppInSuccessfulState(appId, data);
};

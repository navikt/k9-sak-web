import renderers from '../util/renderers';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import '@navikt/ds-css';

(window as any).renderTilsynApp = async (appId, data) => {
  const { renderAppInSuccessfulState } = renderers;
  renderAppInSuccessfulState(appId, data);
};

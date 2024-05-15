/* eslint-disable no-console */
import '@navikt/ds-css';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import { ContainerContract } from '../types/ContainerContract';
import renderers from '../util/renderers';

interface ExtendedWindow extends Window {
  renderOmsorgenForApp: (id: string, contract: ContainerContract) => void;
}

const data = {
  readOnly: false,
  endpoints: {
    omsorgsperioder: 'http://localhost:8082/mock/omsorgsperioder',
  },
  onFinished: () => console.log('Klar til å løse aksjonspunkt'),
  sakstype: 'OMP',
  httpErrorHandler: undefined,
};

(window as Partial<ExtendedWindow>).renderOmsorgenForApp = async appId => {
  const { renderAppInSuccessfulState } = renderers;
  renderAppInSuccessfulState(appId, data);
};

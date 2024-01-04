import { ContainerContract } from '../types/ContainerContract';
import renderers from '../util/renderers';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import '@navikt/ds-css';

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
};

(window as Partial<ExtendedWindow>).renderOmsorgenForApp = async appId => {
  const { renderAppInSuccessfulState } = renderers;
  renderAppInSuccessfulState(appId, data);
};

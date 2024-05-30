/* eslint-disable no-console */
import '@navikt/ds-css';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import { mockUrlPrepend } from '../../mock/constants';
import renderers from '../util/renderers';

const data = {
  readOnly: false,
  endpoints: {
    tilsyn: `${mockUrlPrepend}/mock/tilsyn`,
    sykdom: `${mockUrlPrepend}/mock/sykdom`,
    sykdomInnleggelse: `${mockUrlPrepend}/mock/sykdomInnleggelse`,
  },
  onFinished: () => console.log('Aksjonspunkt løst'),
  beredskapMåVurderes: true,
  nattevåkMåVurderes: true,
  httpErrorHandler: undefined,
  lagreBeredskapvurdering: undefined,
  lagreNattevåkvurdering: undefined,
  harAksjonspunktForBeredskap: true,
  harAksjonspunktForNattevåk: true,
};

(window as any).renderTilsynApp = async appId => {
  const { renderAppInSuccessfulState } = renderers;
  renderAppInSuccessfulState(appId, data);
};

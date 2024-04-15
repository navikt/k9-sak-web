/* eslint-disable no-console */
import '@navikt/ds-css';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import BehandlingType from '../constants/BehandlingType';
import FagsakYtelseType from '../constants/FagsakYtelseType';
import ContainerContract from '../types/ContainerContract';
import renderers from '../util/renderers';

interface ExtendedWindow extends Window {
  renderMedisinskVilkarApp: (id: string, contract: ContainerContract) => void;
}

const data = {
  endpoints: {
    vurderingsoversiktKontinuerligTilsynOgPleie:
      'http://localhost:8082/mock/kontinuerlig-tilsyn-og-pleie/vurderingsoversikt',
    vurderingsoversiktBehovForToOmsorgspersoner: 'http://localhost:8082/mock/to-omsorgspersoner/vurderingsoversikt',
    dokumentoversikt: 'http://localhost:8082/mock/dokumentoversikt',
    dataTilVurdering: 'http://localhost:8082/mock/data-til-vurdering',
    innleggelsesperioder: 'http://localhost:8082/mock/innleggelsesperioder',
    diagnosekoder: 'http://localhost:8082/mock/diagnosekoder',
    diagnosekodeSearch: 'http://localhost:8082/mock/diagnosekode-search',
    status: 'http://localhost:8082/mock/status',
    nyeDokumenter: 'http://localhost:8082/mock/nye-dokumenter',
    vurderingsoversiktLivetsSluttfase: 'http://localhost:8082/mock/livets-sluttfase/vurderingsoversikt',
  },
  behandlingUuid: '123',
  readOnly: false,
  onFinished: () => console.log('Aksjonspunkt løst'),
  visFortsettknapp: true,
  saksbehandlere: {},
  fagsakYtelseType: FagsakYtelseType.PLEIEPENGER,
  behandlingType: BehandlingType.FORSTEGANGSSOKNAD,
  httpErrorHandler: undefined,
};

(window as Partial<ExtendedWindow>).renderMedisinskVilkarApp = async appId => {
  const { renderAppInSuccessfulState } = renderers;
  renderAppInSuccessfulState(appId, data);
};

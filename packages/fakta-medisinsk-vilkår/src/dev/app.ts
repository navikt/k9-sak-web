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
    vurderingsoversiktKontinuerligTilsynOgPleie: '/mock/kontinuerlig-tilsyn-og-pleie/vurderingsoversikt',
    vurderingsoversiktBehovForToOmsorgspersoner: '/mock/to-omsorgspersoner/vurderingsoversikt',
    dokumentoversikt: '/mock/dokumentoversikt',
    dataTilVurdering: '/mock/data-til-vurdering',
    innleggelsesperioder: '/mock/innleggelsesperioder',
    diagnosekoder: '/mock/diagnosekoder',
    diagnosekodeSearch: '/mock/diagnosekode-search',
    status: '/mock/status',
    nyeDokumenter: '/mock/nye-dokumenter',
    vurderingsoversiktLivetsSluttfase: '/mock/livets-sluttfase/vurderingsoversikt',
  },
  behandlingUuid: '123',
  readOnly: false,
  onFinished: () => console.log('Aksjonspunkt løst'),
  visFortsettknapp: true,
  fagsakYtelseType: FagsakYtelseType.PLEIEPENGER,
  behandlingType: BehandlingType.FORSTEGANGSSOKNAD,
  httpErrorHandler: undefined,
};

(window as Partial<ExtendedWindow>).renderMedisinskVilkarApp = async appId => {
  const { renderAppInSuccessfulState } = renderers;
  renderAppInSuccessfulState(appId, data);
};

import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import { K9sakApiKeys, LinkCategory, requestApi, restApiHooks } from '../data/k9sakApi';
import InitLinks from './initLinks';

const LINKS_TEMPLATE = {
  links: [],
  sakLinks: [],
  toggleLinks: [],
};

const useHentInitLenker = (): boolean[] => {
  const { data: initFetchLinksK9Sak = LINKS_TEMPLATE, state: initFetchStateK9Sak } =
    restApiHooks.useGlobalStateRestApi<InitLinks>(K9sakApiKeys.INIT_FETCH);
  const { data: initFetchLinksTilbake = LINKS_TEMPLATE, state: initFetchStateTilbake } =
    restApiHooks.useGlobalStateRestApi<InitLinks>(K9sakApiKeys.INIT_FETCH_TILBAKE);
  const { data: initFetchLinksKlage = LINKS_TEMPLATE, state: initFetchStateKlage } =
    restApiHooks.useGlobalStateRestApi<InitLinks>(K9sakApiKeys.INIT_FETCH_KLAGE);

  const harK9sakInitKallFeilet = initFetchStateK9Sak === RestApiState.ERROR;
  const harHentetFerdigInitLenker =
    initFetchStateK9Sak === RestApiState.SUCCESS &&
    (initFetchStateTilbake === RestApiState.SUCCESS || initFetchStateTilbake === RestApiState.ERROR) &&
    (initFetchStateKlage === RestApiState.SUCCESS || initFetchStateKlage === RestApiState.ERROR);

  if (harHentetFerdigInitLenker) {
    requestApi.setLinks(
      initFetchLinksK9Sak.links.concat(initFetchLinksTilbake.links).concat(initFetchLinksKlage.links),
      LinkCategory.INIT_DATA,
    );
    requestApi.setLinks(
      initFetchLinksK9Sak.sakLinks.concat(initFetchLinksTilbake.sakLinks).concat(initFetchLinksKlage.sakLinks),
      LinkCategory.FAGSAK,
    );
  }

  return [harHentetFerdigInitLenker, harK9sakInitKallFeilet];
};

export default useHentInitLenker;

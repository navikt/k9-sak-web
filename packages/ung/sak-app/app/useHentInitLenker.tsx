import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import InitLinks from '@k9-sak-web/sak-app/src/app/initLinks';
import { LinkCategory, requestApi, restApiHooks, UngSakApiKeys } from '../data/ungsakApi';

const LINKS_TEMPLATE = {
  links: [],
  sakLinks: [],
  toggleLinks: [],
};

const useHentInitLenker = (): boolean[] => {
  const { data: initFetchLinksUngSak = LINKS_TEMPLATE, state: initFetchStateUngSak } =
    restApiHooks.useGlobalStateRestApi<InitLinks>(UngSakApiKeys.INIT_FETCH);
  const { data: initFetchLinksTilbake = LINKS_TEMPLATE, state: initFetchStateTilbake } =
    restApiHooks.useGlobalStateRestApi<InitLinks>(UngSakApiKeys.INIT_FETCH_TILBAKE);

  const harUngsakInitKallFeilet = initFetchStateUngSak === RestApiState.ERROR;
  const harHentetFerdigInitLenker =
    initFetchStateUngSak === RestApiState.SUCCESS &&
    (initFetchStateTilbake === RestApiState.SUCCESS || initFetchStateTilbake === RestApiState.ERROR);

  if (harHentetFerdigInitLenker) {
    requestApi.setLinks(initFetchLinksUngSak.links.concat(initFetchLinksTilbake.links), LinkCategory.INIT_DATA);
    requestApi.setLinks(initFetchLinksUngSak.sakLinks.concat(initFetchLinksTilbake.sakLinks), LinkCategory.FAGSAK);
  }

  return [harHentetFerdigInitLenker, harUngsakInitKallFeilet];
};

export default useHentInitLenker;

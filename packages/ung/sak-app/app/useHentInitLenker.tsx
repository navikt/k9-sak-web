import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import InitLinks from '@k9-sak-web/sak-app/src/app/initLinks';
import { LinkCategory, requestApi, restApiHooks, UngSakApiKeys } from '../data/ungsakApi';

const LINKS_TEMPLATE = {
  links: [],
  sakLinks: [],
  toggleLinks: [],
};

const useHentInitLenker = (): boolean[] => {
  const { data: initFetchLinksK9Sak = LINKS_TEMPLATE, state: initFetchStateK9Sak } =
    restApiHooks.useGlobalStateRestApi<InitLinks>(UngSakApiKeys.INIT_FETCH);

  const harK9sakInitKallFeilet = initFetchStateK9Sak === RestApiState.ERROR;
  const harHentetFerdigInitLenker = initFetchStateK9Sak === RestApiState.SUCCESS;

  if (harHentetFerdigInitLenker) {
    requestApi.setLinks(initFetchLinksK9Sak.links, LinkCategory.INIT_DATA);
    requestApi.setLinks(initFetchLinksK9Sak.sakLinks, LinkCategory.FAGSAK);
  }

  return [harHentetFerdigInitLenker, harK9sakInitKallFeilet];
};

export default useHentInitLenker;

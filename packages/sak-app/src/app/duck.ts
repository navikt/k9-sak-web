import { createSelector } from 'reselect';

import { reducerRegistry } from '@fpsak-frontend/rest-api-redux';
import { NavAnsatt } from '@k9-sak-web/types';
import { featureToggle } from '@k9-sak-web/konstanter';

import ApplicationContextPath from '../behandling/ApplicationContextPath';
import fpsakApi from '../data/fpsakApi';

const reducerName = 'app';

/* Action types */
const actionType = name => `${reducerName}/${name}`;
const SET_DISABLED_APPLICATION_CONTEXT = actionType('SET_DISABLED_APPLICATION_CONTEXT');

export const setDisabledApplicationContext = applicationContext => ({
  type: SET_DISABLED_APPLICATION_CONTEXT,
  data: applicationContext,
});

export const fetchAlleKodeverk = () => dispatch => {
  dispatch(fpsakApi.KODEVERK.makeRestApiRequest()());
  dispatch(fpsakApi.KODEVERK_FPTILBAKE.makeRestApiRequest()()).catch(() =>
    dispatch(setDisabledApplicationContext(ApplicationContextPath.FPTILBAKE)),
  );
  if (featureToggle.KLAGEBEHANDLING) {
    dispatch(fpsakApi.KODEVERK_KLAGE.makeRestApiRequest()()).catch(() =>
      dispatch(setDisabledApplicationContext(ApplicationContextPath.KLAGE)),
    );
  }
};

/* Reducer */
const initialState = {
  disabledApplicationContexts: [],
};

interface Action {
  type: string;
  data?: string;
}

export const appReducer = (state = initialState, action: Action = { type: '' }) => {
  // NOSONAR Switch brukes som standard i reducers
  switch (action.type) {
    case SET_DISABLED_APPLICATION_CONTEXT:
      return {
        ...state,
        disabledApplicationContexts: state.disabledApplicationContexts.concat(action.data),
      };
    default:
      return state;
  }
};

reducerRegistry.register(reducerName, appReducer);

// Selectors (Kun de knyttet til reducer)
const getAppContext = state => state.default[reducerName];
const getDisabledApplicationContexts = createSelector(
  [getAppContext],
  appContext => appContext.disabledApplicationContexts,
);

const DEFAULT_NAV_ANSATT = {
  brukernavn: '',
  kanBehandleKode6: false,
  kanBehandleKode7: false,
  kanBehandleKodeEgenAnsatt: false,
  kanBeslutte: false,
  kanOverstyre: false,
  kanSaksbehandle: false,
  kanVeilede: false,
  navn: '',
};

/* Selectors */
export const getNavAnsatt = createSelector(
  [fpsakApi.NAV_ANSATT.getRestApiData()],
  (navAnsattData: NavAnsatt): NavAnsatt => navAnsattData || DEFAULT_NAV_ANSATT,
);
export const getNavAnsattName = createSelector([getNavAnsatt], (navAnsatt: NavAnsatt) => navAnsatt.navn);
export const getFunksjonellTid = createSelector([getNavAnsatt], (navAnsatt: NavAnsatt) => navAnsatt.funksjonellTid);
export const getShowDetailedErrorMessages = createSelector(
  [fpsakApi.SHOW_DETAILED_ERROR_MESSAGES.getRestApiData()],
  (showDetailedErrorMessages = false) => showDetailedErrorMessages,
);
export const getIntegrationStatusList = createSelector(
  [fpsakApi.INTEGRATION_STATUS.getRestApiData()],
  (integrationStatusList = []) => integrationStatusList,
);

const isFinishedLoadingFpSakData = createSelector(
  [
    fpsakApi.NAV_ANSATT.getRestApiFinished(),
    fpsakApi.LANGUAGE_FILE.getRestApiFinished(),
    fpsakApi.KODEVERK.getRestApiFinished(),
    fpsakApi.SHOW_DETAILED_ERROR_MESSAGES.getRestApiFinished(),
  ],
  (...blockers) => blockers.every(finished => finished),
);

const sufficientDataForErrorPageLoaded = createSelector(
  [
    fpsakApi.NAV_ANSATT.getRestApiFinished(),
    fpsakApi.LANGUAGE_FILE.getRestApiFinished(),
    fpsakApi.SHOW_DETAILED_ERROR_MESSAGES.getRestApiFinished(),
  ],
  (...blockers) => blockers.every(finished => finished),
);

const isFinishedLoadingFpTilbakeData = createSelector(
  [fpsakApi.KODEVERK_FPTILBAKE.getRestApiFinished()],
  (...blockers) => blockers.every(finished => finished),
);

export const getEnabledApplicationContexts = createSelector(
  [getDisabledApplicationContexts],
  disabledApplicationContexts => {
    const erFpTilbakeDisabled = disabledApplicationContexts.includes(ApplicationContextPath.FPTILBAKE);
    const erKlagefeatureAktivert = featureToggle.KLAGEBEHANDLING || false;
    const erKlageDeaktivert = disabledApplicationContexts.includes(ApplicationContextPath.KLAGE);
    if (!erFpTilbakeDisabled) {
      return erKlagefeatureAktivert && !erKlageDeaktivert
        ? [ApplicationContextPath.FPSAK, ApplicationContextPath.FPTILBAKE, ApplicationContextPath.KLAGE]
        : [ApplicationContextPath.FPSAK, ApplicationContextPath.FPTILBAKE];
    }
    return erKlagefeatureAktivert && !erKlageDeaktivert
      ? [ApplicationContextPath.FPSAK, ApplicationContextPath.KLAGE]
      : [ApplicationContextPath.FPSAK];
  },
);

export const isFinishedLoadingData = createSelector(
  [getEnabledApplicationContexts, isFinishedLoadingFpSakData, isFinishedLoadingFpTilbakeData],
  (enabledContexts = [], isFinishedLoadingFpSak = false, isFinishedLoadingFpTilbake = false) =>
    enabledContexts.includes(ApplicationContextPath.FPTILBAKE)
      ? isFinishedLoadingFpSak && isFinishedLoadingFpTilbake
      : isFinishedLoadingFpSak,
);

export const isFinishedLoadingErrorPageData = createSelector(
  [sufficientDataForErrorPageLoaded],
  (isFinished = false) => isFinished,
);

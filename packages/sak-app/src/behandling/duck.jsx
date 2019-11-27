import { createSelector } from 'reselect';

import { reducerRegistry, BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import { getSelectedSaksnummer } from '../fagsak/duck';
import fpsakApi from '../data/fpsakApi';
import { getBehandlinger } from './selectors/behandlingerSelectors';

const reducerName = 'behandling';

/* Action types */
const actionType = (name) => `${reducerName}/${name}`;
const SET_TEMP_BEHANDLING_ID = actionType('SET_TEMP_BEHANDLING_ID');
const SET_BEHANDLING_ID_OG_VERSJON = actionType('SET_BEHANDLING_ID_OG_VERSJON');
const OPPDATER_BEHANDLING_VERSJON = actionType('OPPDATER_BEHANDLING_VERSJON');
const RESET_BEHANDLING_CONTEXT = actionType('RESET_BEHANDLING_CONTEXT');

export const setTempBehandlingId = (behandlingId) => ({
  type: SET_TEMP_BEHANDLING_ID,
  data: behandlingId,
});

export const setSelectedBehandlingIdOgVersjon = (versjon) => ({
  type: SET_BEHANDLING_ID_OG_VERSJON,
  data: versjon,
});

export const oppdaterBehandlingVersjon = (behandlingVersjon) => ({
  type: OPPDATER_BEHANDLING_VERSJON,
  data: behandlingVersjon,
});

export const resetBehandlingContext = () => ({
  type: RESET_BEHANDLING_CONTEXT,
});


/* Action creators */
export const previewMessage = (erTilbakekreving, data) => (dispatch) => {
  const api = erTilbakekreving ? fpsakApi.PREVIEW_MESSAGE_TILBAKEKREVING : fpsakApi.PREVIEW_MESSAGE_FORMIDLING;
  return dispatch(api.makeRestApiRequest()(data));
};

/* Reducer */
const initialState = {
  tempBehandlingId: undefined,
  behandlingId: undefined,
  behandlingVersjon: undefined,
};

export const behandlingReducer = (state = initialState, action = {}) => { // NOSONAR Switch brukes som standard i reducers
  switch (action.type) {
    case SET_TEMP_BEHANDLING_ID:
      return {
        ...state,
        tempBehandlingId: action.data,
      };
    case SET_BEHANDLING_ID_OG_VERSJON:
      return {
        ...state,
        behandlingId: state.tempBehandlingId,
        behandlingVersjon: action.data,
      };
    case OPPDATER_BEHANDLING_VERSJON:
      return {
        ...state,
        behandlingVersjon: action.data,
      };
    case RESET_BEHANDLING_CONTEXT:
      return initialState;
    default:
      return state;
  }
};

reducerRegistry.register(reducerName, behandlingReducer);

// Selectors (Kun de knyttet til reducer)
const getBehandlingContext = (state) => state.default[reducerName];
export const getTempBehandlingId = createSelector([getBehandlingContext], (behandlingContext) => behandlingContext.tempBehandlingId);
export const getSelectedBehandlingId = createSelector([getBehandlingContext], (behandlingContext) => behandlingContext.behandlingId);
export const getBehandlingIdentifier = createSelector(
  [getSelectedBehandlingId, getSelectedSaksnummer],
  (behandlingId, saksnummer) => (behandlingId ? new BehandlingIdentifier(saksnummer, behandlingId) : undefined
  ),
);


const getBehandling = createSelector([getBehandlinger, getSelectedBehandlingId],
  (behandlinger = [], behandlingId) => behandlinger.find((b) => b.id === behandlingId));

export const getTempBehandlingVersjon = createSelector([getBehandlinger, getTempBehandlingId],
  (behandlinger = [], behandlingId) => (behandlinger.some((b) => b.id === behandlingId) ? behandlinger.find((b) => b.id === behandlingId).versjon : undefined));
export const getBehandlingVersjon = createSelector([getBehandlingContext], (behandlingContext) => behandlingContext.behandlingVersjon);

export const getBehandlingStatus = createSelector([getBehandling], (behandling = {}) => behandling.status);
export const getBehandlingType = createSelector([getBehandling], (behandling = {}) => behandling.type);
export const getBehandlingBehandlendeEnhetId = createSelector([getBehandling], (behandling = {}) => behandling.behandlendeEnhetId);
export const getBehandlingBehandlendeEnhetNavn = createSelector([getBehandling], (behandling = {}) => behandling.behandlendeEnhetNavn);
export const getBehandlingSprak = createSelector([getBehandling], (behandling) => behandling.sprakkode);
export const erBehandlingPaVent = createSelector([getBehandling], (behandling) => (behandling ? behandling.behandlingPaaVent : false));
export const erBehandlingKoet = createSelector([getBehandling], (behandling) => (behandling ? behandling.behandlingKoet : false));
export const getBehandlingAnsvarligSaksbehandler = createSelector([getBehandling], (behandling) => (behandling
  ? behandling.ansvarligSaksbehandler : undefined));
export const getBehandlingToTrinnsBehandling = createSelector([getBehandling], (behandling) => behandling.toTrinnsBehandling);
export const getBehandlingErPapirsoknad = createSelector([getBehandling], (behandling) => (behandling ? behandling.erAktivPapirsoknad : false));
export const getBehandlingsresultat = createSelector([getBehandling], (behandling) => behandling.behandlingsresultat);
export const getBehandlingArsaker = createSelector([getBehandling], (behandling) => behandling.behandlingArsaker);

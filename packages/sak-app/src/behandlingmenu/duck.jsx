import moment from 'moment';

import { ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import { getLocationWithDefaultBehandlingspunktAndFakta, pathToBehandling } from '@fpsak-frontend/fp-felles';

import ApiForBehandlingstype from '@fpsak-frontend/utils/src/behandlingstypeUtils';
import fpsakApi from '../data/fpsakApi';
import behandlingEventHandler from '../behandling/BehandlingEventHandler';

const findNewBehandlingId = (behandlingerResponse) => {
  const sortedBehandlinger = behandlingerResponse.payload
    .sort((b1, b2) => moment(b2.opprettet, ISO_DATE_FORMAT).diff(moment(b1.opprettet, ISO_DATE_FORMAT)));
  return sortedBehandlinger[0].id;
};

const createNewBehandlingRequest = (params, apiForBehandlingstype) =>
  apiForBehandlingstype.newBehandlingApi().makeRestApiRequest()(params);

export const createNewBehandling = (push, saksnummer, erBehandlingValgt, params) => dispatch => {
  const apiForBehandlingstype = new ApiForBehandlingstype(params.behandlingType);
  return dispatch(createNewBehandlingRequest(params, apiForBehandlingstype)).then(response => {
    const updateBehandlinger = apiForBehandlingstype.behandlingerApi();
    if (response.payload.saksnummer) {
      // NEW_BEHANDLING har returnert fagsak
      return dispatch(updateBehandlinger.makeRestApiRequest()({ saksnummer })).then(behandlingerResponse => {
        const pathname = pathToBehandling(saksnummer, findNewBehandlingId(behandlingerResponse));
        push(getLocationWithDefaultBehandlingspunktAndFakta({ pathname }));
        return Promise.resolve(behandlingerResponse);
      });
    }
    // NEW_BEHANDLING har returnert behandling
    return dispatch(updateBehandlinger.makeRestApiRequest()({ saksnummer }))
      .then(() => push(getLocationWithDefaultBehandlingspunktAndFakta({ pathname: pathToBehandling(saksnummer, response.payload.id) })));
  });
};

export const sjekkOmTilbakekrevingKanOpprettes = (params) => (dispatch) => dispatch(
  fpsakApi.KAN_TILBAKEKREVING_OPPRETTES.makeRestApiRequest()(params),
);
export const sjekkOmTilbakekrevingRevurderingKanOpprettes = (params) => (dispatch) => dispatch(
  fpsakApi.KAN_TILBAKEKREVING_REVURDERING_OPPRETTES.makeRestApiRequest()(params),
);

export const hentVergeMenyvalg = (params) => (dispatch) => dispatch(fpsakApi.VERGE_MENYVALG.makeRestApiRequest()(params));
export const resetVergeMenyvalg = () => (dispatch) => dispatch(fpsakApi.VERGE_MENYVALG.resetRestApi()());

export const shelveBehandling = (params) => behandlingEventHandler.henleggBehandling(params);

export const setBehandlingOnHold = (params) => behandlingEventHandler.settBehandlingPaVent(params);

export const resumeBehandling = (params) => behandlingEventHandler.taBehandlingAvVent(params);

export const nyBehandlendeEnhet = (params) => behandlingEventHandler.endreBehandlendeEnhet(params);

export const openBehandlingForChanges = (params) => behandlingEventHandler.opneBehandlingForEndringer(params);

export const opprettVerge = (push, behandlingIdentifier, versjon) => behandlingEventHandler.opprettVerge({
  behandlingId: behandlingIdentifier.behandlingId,
  behandlingVersjon: versjon,
}).then(() => push(getLocationWithDefaultBehandlingspunktAndFakta({
  pathname: pathToBehandling(behandlingIdentifier.saksnummer, behandlingIdentifier.behandlingId),
})));

export const fjernVerge = (push, behandlingIdentifier, versjon) => behandlingEventHandler.fjernVerge({
  behandlingId: behandlingIdentifier.behandlingId,
  behandlingVersjon: versjon,
}).then(() => push(getLocationWithDefaultBehandlingspunktAndFakta({
  pathname: pathToBehandling(behandlingIdentifier.saksnummer, behandlingIdentifier.behandlingId),
})));

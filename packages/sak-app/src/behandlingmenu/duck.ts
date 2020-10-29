import moment from 'moment';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import { getLocationWithDefaultProsessStegAndFakta, pathToBehandling } from '../app/paths';
import fpsakApi from '../data/fpsakApi';
import behandlingEventHandler from '../behandling/BehandlingEventHandler';

const LAG_NY_BEHANDLING_ENDEPUNKTER = {
  [BehandlingType.UNNTAK]: fpsakApi.NEW_BEHANDLING_UNNTAK,
  [BehandlingType.KLAGE]: fpsakApi.NEW_BEHANDLING_KLAGE,
  [BehandlingType.TILBAKEKREVING]: fpsakApi.NEW_BEHANDLING_FPTILBAKE,
  [BehandlingType.TILBAKEKREVING_REVURDERING]: fpsakApi.NEW_BEHANDLING_FPTILBAKE,
};

const OPPDATER_BEHANDLINGER_ENDEPUNKTER = {
  [BehandlingType.KLAGE]: fpsakApi.BEHANDLINGER_KLAGE,
  [BehandlingType.TILBAKEKREVING]: fpsakApi.BEHANDLINGER_FPTILBAKE,
  [BehandlingType.TILBAKEKREVING_REVURDERING]: fpsakApi.BEHANDLINGER_FPTILBAKE,
};

const findNewBehandlingId = behandlingerResponse => {
  const sortedBehandlinger = behandlingerResponse.payload.sort((b1, b2) =>
    moment(b2.opprettet).diff(moment(b1.opprettet)),
  );
  return sortedBehandlinger[0].id;
};

const createNewBehandlingRequest = (behandlingType, params) => {
  const endepunkt = LAG_NY_BEHANDLING_ENDEPUNKTER[behandlingType] || fpsakApi.NEW_BEHANDLING_FPSAK;
  return endepunkt.makeRestApiRequest()(params);
};

const oppdaterBehandlinger = (behandlingType, params, meta?: any) => {
  const endepunkt = OPPDATER_BEHANDLINGER_ENDEPUNKTER[behandlingType] || fpsakApi.BEHANDLINGER_FPSAK;
  return endepunkt.makeRestApiRequest()(params, meta);
};

export const createNewBehandling = (location, push) => (
  saksnummer,
  behandlingId,
  behandlingVersion,
  behandlingType,
  params,
) => dispatch =>
  dispatch(createNewBehandlingRequest(behandlingType, params)).then(response => {
    if (response.payload.saksnummer) {
      // NEW_BEHANDLING har returnert fagsak
      const meta = {
        keepData: true,
        cacheParams: { behandlingId, behandlingVersion },
      };
      return dispatch(oppdaterBehandlinger(behandlingType, { saksnummer }, meta)).then(behandlingerResponse => {
        const pathname = pathToBehandling(saksnummer, findNewBehandlingId(behandlingerResponse));
        push(getLocationWithDefaultProsessStegAndFakta({ ...location, pathname }));
        return Promise.resolve(behandlingerResponse);
      });
    }
    // NEW_BEHANDLING har returnert behandling
    return dispatch(oppdaterBehandlinger(behandlingType, { saksnummer })).then(() =>
      push(
        getLocationWithDefaultProsessStegAndFakta({
          ...location,
          pathname: pathToBehandling(saksnummer, response.payload.id),
        }),
      ),
    );
  });

export const sjekkOmTilbakekrevingKanOpprettes = params => dispatch =>
  dispatch(fpsakApi.KAN_TILBAKEKREVING_OPPRETTES.makeRestApiRequest()(params));
export const sjekkOmTilbakekrevingRevurderingKanOpprettes = params => dispatch =>
  dispatch(fpsakApi.KAN_TILBAKEKREVING_REVURDERING_OPPRETTES.makeRestApiRequest()(params));

export const hentVergeMenyvalg = (params: {}) => dispatch =>
  dispatch(fpsakApi.VERGE_MENYVALG.makeRestApiRequest()(params));
export const resetVergeMenyvalg = () => dispatch => dispatch(fpsakApi.VERGE_MENYVALG.resetRestApi()());

export const shelveBehandling = (params: {}) => behandlingEventHandler.henleggBehandling(params);

export const setBehandlingOnHold = (params: {}) => behandlingEventHandler.settBehandlingPaVent(params);

export const resumeBehandling = (params: {}) => behandlingEventHandler.taBehandlingAvVent(params);

export const nyBehandlendeEnhet = (params: {}) => behandlingEventHandler.endreBehandlendeEnhet(params);

export const openBehandlingForChanges = (params: {}) => behandlingEventHandler.opneBehandlingForEndringer(params);

export const opprettVerge = (location, push, saksnummer, behandlingId, versjon) => () =>
  behandlingEventHandler
    .opprettVerge({
      behandlingId,
      behandlingVersjon: versjon,
    })
    .then(() =>
      push(
        getLocationWithDefaultProsessStegAndFakta({
          ...location,
          pathname: pathToBehandling(saksnummer, behandlingId),
        }),
      ),
    );

export const fjernVerge = (location, push, saksnummer, behandlingId, versjon) => () =>
  behandlingEventHandler
    .fjernVerge({
      behandlingId,
      behandlingVersjon: versjon,
    })
    .then(() =>
      push(
        getLocationWithDefaultProsessStegAndFakta({
          ...location,
          pathname: pathToBehandling(saksnummer, behandlingId),
        }),
      ),
    );

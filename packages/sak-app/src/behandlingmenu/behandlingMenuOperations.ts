import { Location } from 'history';

import { getLocationWithDefaultProsessStegAndFakta, pathToBehandling } from '../app/paths';
import behandlingEventHandler from '../behandling/BehandlingEventHandler';

export const shelveBehandling = (params: any) => behandlingEventHandler.henleggBehandling(params);

export const setBehandlingOnHold = (params: any) => behandlingEventHandler.settBehandlingPaVent(params);

export const resumeBehandling = (params: any) => behandlingEventHandler.taBehandlingAvVent(params);

export const nyBehandlendeEnhet = (params: any) => behandlingEventHandler.endreBehandlendeEnhet(params);

export const markerBehandling = (params: any) => behandlingEventHandler.markerBehandling(params);

export const opprettVerge =
  (location: Location, push, saksnummer: string, behandlingId: number, versjon: number) => () =>
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

export const fjernVerge = (location: Location, push, saksnummer: string, behandlingId: number, versjon: number) => () =>
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

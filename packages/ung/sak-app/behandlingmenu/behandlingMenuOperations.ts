import behandlingEventHandler from '../behandling/BehandlingEventHandler';

export const shelveBehandling = (params: any) => behandlingEventHandler.henleggBehandling(params);

export const setBehandlingOnHold = (params: any) => behandlingEventHandler.settBehandlingPaVent(params);

export const resumeBehandling = (params: any) => behandlingEventHandler.taBehandlingAvVent(params);

export const nyBehandlendeEnhet = (params: any) => behandlingEventHandler.endreBehandlendeEnhet(params);

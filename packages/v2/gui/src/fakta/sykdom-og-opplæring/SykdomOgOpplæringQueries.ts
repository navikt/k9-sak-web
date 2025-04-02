import { useMutation, useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { K9SakClientContext } from '@k9-sak-web/gui/app/K9SakClientContext.js';
import {
  type BekreftResponse,
  type OppdaterLangvarigSykdomsVurderingData,
  type OppdaterLangvarigSykdomsVurderingResponse,
  type OpprettLangvarigSykdomsVurderingData,
  type OpprettLangvarigSykdomsVurderingResponse,
} from '@k9-sak-web/backend/k9sak/generated';
import SykdomOgOpplæringBackendClient from './SykdomOgOpplæringBackendClient';

export const useSykdomBackendClient = () => {
  const k9SakClient = useContext(K9SakClientContext);
  return new SykdomOgOpplæringBackendClient(k9SakClient);
};

export const useOpprettSykdomsvurdering = ({ onSuccess }: { onSuccess?: () => void }) => {
  const backendClient = useSykdomBackendClient();

  return useMutation<
    OpprettLangvarigSykdomsVurderingResponse,
    Error,
    OpprettLangvarigSykdomsVurderingData['requestBody']
  >({
    mutationFn: requestBody => backendClient.opprettSykdomsvurdering(requestBody),
    onSuccess,
  });
};

export const useOppdaterSykdomsvurdering = ({ onSuccess }: { onSuccess?: () => void }) => {
  const backendClient = useSykdomBackendClient();

  return useMutation<
    OppdaterLangvarigSykdomsVurderingResponse,
    Error,
    OppdaterLangvarigSykdomsVurderingData['requestBody']
  >({
    mutationFn: requestBody => backendClient.oppdaterSykdomsvurdering(requestBody),
    onSuccess,
  });
};

export const useDiagnosekoder = (behandlingUuid: string) => {
  const backendClient = useSykdomBackendClient();
  return useQuery({
    queryKey: ['diagnosekoder', behandlingUuid],
    queryFn: () => backendClient.hentDiagnosekoder(behandlingUuid),
    enabled: !!behandlingUuid,
  });
};

export const useLangvarigSykVurderingerFagsak = (behandlingUuid: string) => {
  const backendClient = useSykdomBackendClient();

  return useQuery({
    queryKey: ['langvarigSykVurderingerFagsak', behandlingUuid],
    queryFn: () => backendClient.hentLangvarigSykVurderingerFagsak(behandlingUuid),
    enabled: !!behandlingUuid,
  });
};
export const useInstitusjonInfo = (behandlingUuid: string) => {
  const backendClient = useSykdomBackendClient();

  return useQuery({
    queryKey: ['institusjonInfo', behandlingUuid],
    queryFn: () => backendClient.getInstitusjonInfo(behandlingUuid),
    enabled: !!behandlingUuid,
  });
};

export const useVurdertOpplæring = (behandlingUuid: string) => {
  const backendClient = useSykdomBackendClient();

  return useQuery({
    queryKey: ['vurdertOpplæring', behandlingUuid],
    queryFn: () => backendClient.getVurdertOpplæring(behandlingUuid),
  });
};

export const useVurdertReisetid = (behandlingUuid: string) => {
  const backendClient = useSykdomBackendClient();

  return useQuery({
    queryKey: ['vurdertReisetid', behandlingUuid],
    queryFn: () => backendClient.getVurdertReisetid(behandlingUuid),
  });
};

// Generic mutation hook for any aksjonspunkt submission
interface SubmitAksjonspunktVariables {
  payload: any;
}

export const useSubmitAksjonspunkt = (onSuccess?: () => void) => {
  const backendClient = useSykdomBackendClient();

  return useMutation<BekreftResponse, Error, SubmitAksjonspunktVariables>({
    mutationFn: ({ payload }) => backendClient.submitAksjonspunkt(payload),
    onSuccess,
  });
};

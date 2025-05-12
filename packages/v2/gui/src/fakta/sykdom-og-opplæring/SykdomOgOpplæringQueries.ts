import { useMutation, useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { K9SakClientContext } from '@k9-sak-web/gui/app/K9SakClientContext.js';
import {
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

export const useVilkår = (behandlingUuid: string) => {
  const backendClient = useSykdomBackendClient();

  return useQuery({
    queryKey: ['vilkår', behandlingUuid],
    queryFn: () => backendClient.getVilkår(behandlingUuid),
  });
};
export const useOppdaterSykdomsvurdering = ({
  onSuccess,
}: {
  onSuccess?: (data: OppdaterLangvarigSykdomsVurderingResponse) => void;
}) => {
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

export const useLangvarigSykVurderingerFagsak = (behandlingUuid: string) => {
  const backendClient = useSykdomBackendClient();

  return useQuery({
    queryKey: ['langvarigSykVurderingerFagsak', behandlingUuid],
    queryFn: () => backendClient.hentLangvarigSykVurderingerFagsak(behandlingUuid),
    enabled: !!behandlingUuid,
  });
};

export const useVurdertLangvarigSykdom = (behandlingUuid: string) => {
  const backendClient = useSykdomBackendClient();

  return useQuery({
    queryKey: ['vurdertLangvarigSykdom', behandlingUuid],
    queryFn: () => backendClient.hentVurdertLangvarigSykdom(behandlingUuid),
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

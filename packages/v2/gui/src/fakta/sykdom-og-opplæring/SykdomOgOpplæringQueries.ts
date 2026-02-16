import type { K9SakApiError } from '@k9-sak-web/backend/k9sak/errorhandling/K9SakApiError.js';
import type {
  GetBrevMottakerinfoEregData,
  GetBrevMottakerinfoEregResponse,
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_opplæring_OpplæringDto,
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_reisetid_ReisetidDto,
  OpprettLangvarigSykdomsVurderingData,
  OpprettLangvarigSykdomsVurderingResponse,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { type UseQueryOptions, useMutation, useQuery } from '@tanstack/react-query';
import SykdomOgOpplæringBackendClient from './SykdomOgOpplæringBackendClient';

export const useSykdomBackendClient = () => {
  return new SykdomOgOpplæringBackendClient();
};
const MAX_RETRIES = 3;
export const useOpprettSykdomsvurdering = ({ onSuccess }: { onSuccess?: () => void }) => {
  const backendClient = useSykdomBackendClient();

  return useMutation<OpprettLangvarigSykdomsVurderingResponse, Error, OpprettLangvarigSykdomsVurderingData['body']>({
    mutationFn: requestBody => backendClient.opprettSykdomsvurdering(requestBody),
    onSuccess,
    retry: MAX_RETRIES,
  });
};

export const useVilkår = (behandlingUuid: string) => {
  const backendClient = useSykdomBackendClient();

  return useQuery({
    queryKey: ['vilkår', behandlingUuid],
    queryFn: () => backendClient.getVilkår(behandlingUuid),
    retry: MAX_RETRIES,
  });
};

export const useLangvarigSykVurderingerFagsak = (behandlingUuid: string) => {
  const backendClient = useSykdomBackendClient();

  return useQuery({
    queryKey: ['langvarigSykVurderingerFagsak', behandlingUuid],
    queryFn: () => backendClient.hentLangvarigSykVurderingerFagsak(behandlingUuid),
    enabled: !!behandlingUuid,
    retry: MAX_RETRIES,
  });
};

export const useVurdertLangvarigSykdom = (behandlingUuid: string) => {
  const backendClient = useSykdomBackendClient();

  return useQuery({
    queryKey: ['vurdertLangvarigSykdom', behandlingUuid],
    queryFn: () => backendClient.hentVurdertLangvarigSykdom(behandlingUuid),
    retry: MAX_RETRIES,
  });
};

// institusjon
export const useInstitusjonInfo = (behandlingUuid: string) => {
  const backendClient = useSykdomBackendClient();

  return useQuery({
    queryKey: ['institusjonInfo', behandlingUuid],
    queryFn: () => backendClient.getInstitusjonInfo(behandlingUuid),
    enabled: !!behandlingUuid,
    retry: MAX_RETRIES,
  });
};

export const useAlleInstitusjoner = () => {
  const backendClient = useSykdomBackendClient();

  return useQuery({
    queryKey: ['alleInstitusjoner'],
    queryFn: () => backendClient.hentAlleInstitusjoner(),
    retry: MAX_RETRIES,
  });
};

export const useHentOrganisasjonsnummer = (organisasjonsnummer: string) => {
  const backendClient = useSykdomBackendClient();

  return useMutation<GetBrevMottakerinfoEregResponse, K9SakApiError, GetBrevMottakerinfoEregData['body']>({
    mutationFn: () => backendClient.hentOrganisasjonsnummer(organisasjonsnummer),
    retry: MAX_RETRIES,
  });
};

// nødvendig opplæring
export const useVurdertOpplæring = (
  behandlingUuid: string,
  options: Partial<
    UseQueryOptions<k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_opplæring_OpplæringDto>
  > = {},
) => {
  const backendClient = useSykdomBackendClient();

  return useQuery({
    queryKey: ['vurdertOpplæring', behandlingUuid],
    queryFn: () => backendClient.getVurdertOpplæring(behandlingUuid),
    retry: MAX_RETRIES,
    ...options,
  });
};

export const useVurdertReisetid = (
  behandlingUuid: string,
  options: Partial<
    UseQueryOptions<k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_reisetid_ReisetidDto>
  > = {},
) => {
  const backendClient = useSykdomBackendClient();

  return useQuery({
    queryKey: ['vurdertReisetid', behandlingUuid],
    queryFn: () => backendClient.getVurdertReisetid(behandlingUuid),
    retry: MAX_RETRIES,
    ...options,
  });
};

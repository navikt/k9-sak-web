// Keys for Tanstack Query queries.
// Grunnen til å opprette denne er for å ha stabile query keys slik at vi kan refetche/invalidere queries fra andre steder i løsningen
// enn der useQuery kalles.

// Dette vil refetche alle queries med key som inneholder QueryKeys.BEHANDLING.
// eks: void queryClient.invalidateQueries({ queryKey: QueryKeys.BEHANDLING });

// Dette vil refetche alle queries med key som inneholder [QueryKeys.BEHANDLING, 'kompletthet-beregning'] i denne rekkefølgen.
// eks: void queryClient.invalidateQueries({ queryKey: QueryKeys.KOMPLETTHET_BEREGNING });

export const QueryKeys = {
  BEHANDLING: 'behandling' as const,
  KOMPLETTHET_BEREGNING: () => [QueryKeys.BEHANDLING, 'kompletthet-beregning'] as const,
  HISTORIKK: () => [QueryKeys.BEHANDLING, 'historikk'] as const,
};

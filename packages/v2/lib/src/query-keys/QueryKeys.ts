// Keys for Tanstack Query queries.
// Grunnen til å opprette denne er for å ha stabile query keys slik at vi kan refetche/invalidere queries fra andre steder i løsningen
// enn der useQuery kalles.

// Dette vil refetche alle queries med key som inneholder BaseQueryKeys.BEHANDLING.
// eks: void queryClient.invalidateQueries({ queryKey: QueryKeys.BEHANDLING });

// Dette vil refetche alle queries med key som inneholder [BaseQueryKeys.BEHANDLING, 'kompletthet-beregning'] i denne rekkefølgen.
// eks: void queryClient.invalidateQueries({ queryKey: QueryKeys.KOMPLETTHET_BEREGNING });

export const BaseQueryKeys = {
  BEHANDLING: 'behandling',
} as const;

// Keys for queries som er relatert til behandling.
export const QueryKeys = {
  KOMPLETTHET_BEREGNING: [BaseQueryKeys.BEHANDLING, 'kompletthet-beregning'],
  HISTORIKK: [BaseQueryKeys.BEHANDLING, 'historikk'],
} as const;

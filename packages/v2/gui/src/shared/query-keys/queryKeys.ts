// Keys for Tanstack Query queries.
// Grunnen til å opprette denne er for å ha stabile query keys slik at vi kan refetche/invalidere queries fra andre steder i løsningen
// enn der useQuery kalles.

// Dette vil refetche alle queries med key som inneholder queryKeys.BEHANDLING.
// eks: void queryClient.invalidateQueries({ queryKey: queryKeys.BEHANDLING });

// Dette vil refetche alle queries med key som inneholder [queryKeys.BEHANDLING, 'kompletthet-beregning'] i denne rekkefølgen.
// eks: void queryClient.invalidateQueries({ queryKey: queryKeys.KOMPLETTHET_BEREGNING });

const behandling = 'behandling' as const;

export const queryKeys = {
  BEHANDLING: behandling,
  KOMPLETTHET_BEREGNING: [behandling, 'kompletthet-beregning'],
  HISTORIKK: [behandling, 'historikk'],
} as const;

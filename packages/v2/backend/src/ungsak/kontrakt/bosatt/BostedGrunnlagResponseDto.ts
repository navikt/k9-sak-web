/** Foreslåtte og eventuelt fastsatte bostedavklaringer for ett skjæringstidspunkt. */
export interface BostedGrunnlagPeriodeDto {
  /** Skjæringstidspunkt (fom-dato i vilkårsperioden), ISO 8601. */
  fom: string;
  /** Saksbehandlers foreslåtte vurdering fra VURDER_BOSTED-steget. */
  foreslåttErBosattITrondheim: boolean;
  /** Fastsatt vurdering etter FASTSETT_BOSTED. Null dersom ikke fastset ennå. */
  fastsattErBosattITrondheim: boolean | null;
}

/** Respons fra GET /behandling/bosatt. */
export interface BostedGrunnlagResponseDto {
  perioder: BostedGrunnlagPeriodeDto[];
}

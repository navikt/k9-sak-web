export enum VergeBehandlingmenyValg {
  OPPRETT = 'OPPRETT',
  FJERN = 'FJERN',
  SKJUL = 'SKJUL',
}

type BehandlingRettigheter = Readonly<{
  behandlingFraBeslutter: boolean;
  behandlingKanSendeMelding: boolean;
  behandlingTilGodkjenning: boolean;
  behandlingKanBytteEnhet: boolean;
  behandlingKanHenlegges: boolean;
  behandlingKanGjenopptas: boolean;
  behandlingKanOpnesForEndringer: boolean;
  behandlingKanSettesPaVent: boolean;
  vergeBehandlingsmeny: VergeBehandlingmenyValg;
}>;

export default BehandlingRettigheter;

let mockFagsakRettigheter;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default mockFagsakRettigheter = {
  sakSkalTilInfotrygd: false,
  behandlingTypeKanOpprettes: [
    {
      behandlingType: {
        kode: 'BT-010',
        kodeverk: 'BEHANDLING_TYPE',
      },
      kanOppretteBehandling: true,
    },
    {
      behandlingType: {
        kode: 'BT-004',
        kodeverk: 'BEHANDLING_TYPE',
      },
      kanOppretteBehandling: true,
    },
    {
      behandlingType: {
        kode: 'BT-002',
        kodeverk: 'BEHANDLING_TYPE',
      },
      kanOppretteBehandling: false,
    },
  ],
  behandlingTillatteOperasjoner: [],
};

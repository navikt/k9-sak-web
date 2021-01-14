const historikkResultatTypeCodes = {
  // Tilbakebetaling er fjernet fra k9 ift fp, så disse kodene ligger igjen inntil videre
  DELVIS_TILBAKEBETALING: {
    kode: 'DELVIS_TILBAKEBETALING',
    feltId: 'HistorikkResultat.DelvisTilbakebetaling',
  },
  FULL_TILBAKEBETALING: {
    kode: 'FULL_TILBAKEBETALING',
    feltId: 'HistorikkResultat.FullTilbakebetaling',
  },
  INGEN_TILBAKEBETALING: {
    kode: 'INGEN_TILBAKEBETALING',
    feltId: 'HistorikkResultat.IngenTilbakebetaling',
  },
  MIGRERT_FRA_INFOTRYGD: {
    kode: 'MIGRERT_FRA_INFOTRYGD',
    feltId: 'HistorikkResultat.MigrertFraInfotrygd',
  },
  MIGRERT_FRA_INFOTRYGD_FJERNET: {
    kode: 'MIGRERT_FRA_INFOTRYGD_FJERNET',
    feltId: 'HistorikkResultat.MigrertFraInfotrygdFjernet',
  },
};

export default historikkResultatTypeCodes;

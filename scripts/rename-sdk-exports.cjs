const fs = require('fs');
const path = require('path');

const ROOT = '/Users/Vebjorn.Nordby/git/k9-sak-web';

// Complete mapping: backend -> { generatedName: cleanName }
const MAPPINGS = {
  k9sak: {
    aksjonspunkt_bekreft: 'bekreftAksjonspunkt',
    aksjonspunkt_getAksjonspunkter1: 'getAksjonspunkter',
    aksjonspunkt_overstyr: 'overstyrAksjonspunkt',
    arbeidsgiver_getArbeidsgiverOpplysninger: 'getArbeidsgiverOpplysninger',
    behandlinger_hentBehandlingData1: 'hentBehandlingData',
    behandlinger_settBehandlingPaVent: 'settBehandlingPåVent',
    behandlingPerson_getPersonopplysninger: 'getPersonopplysninger',
    behandlingPerson_hentMedlemskap: 'hentMedlemskap',
    behandlingPleiepengerInntektsgradering_getInntektsgradering: 'getInntektsgradering',
    behandlingPleiepengerUttak_uttaksplanMedUtsattePerioder: 'hentUttaksplanMedUtsattePerioder',
    behandlingUttak_getOverstyrtUttak: 'getOverstyrtUttak',
    behandlingUttak_hentEgneOverlappendeSaker: 'hentEgneOverlappendeSaker',
    behandlingUttak_hentOverstyrbareAktiviterForUttak: 'hentOverstyrbareAktiviteterForUttak',
    beregningsgrunnlag_hentBeregningsgrunnlagene: 'hentBeregningsgrunnlag',
    'beregningsgrunnlag_hentNøklerTilVurdering': 'hentBeregningsnøklerTilVurdering',
    beregningsresultat_hentBeregningsresultatMedUtbetaling: 'hentBeregningsresultatMedUtbetaling',
    beregningsresultat_hentFeriepengegrunnlag: 'hentFeriepengegrunnlag',
    brev_bestillDokument: 'bestillDokument',
    brev_getBrevMottakerinfoEreg: 'getBrevMottakerinfoEreg',
    fagsak_hentFagsak: 'hentFagsak',
    'fagsak_hentSøkersRelaterteSaker': 'hentSøkersRelaterteSaker',
    historikk_hentAlleInnslagV2: 'hentAlleHistorikkInnslag',
    'inntektsmelding_etterspørInntektsmelding': 'etterspørInntektsmelding',
    journalposter_getUferdigJournalpostIderPrAktoer1: 'getUferdigeJournalposter',
    kodeverk_alleKodeverdierSomObjekt: 'hentKodeverk',
    kompletthet_utledStatusForKompletthet: 'utledKompletthetsStatus',
    los_deleteMerknad: 'slettMerknad',
    los_getMerknad: 'getMerknad',
    los_postMerknad: 'opprettMerknad',
    navAnsatt_innloggetBruker: 'hentInnloggetBruker',
    notat_endre: 'endreNotat',
    notat_hent: 'hentNotater',
    notat_opprett: 'opprettNotat',
    notat_skjul: 'skjulNotat',
    'opplæringsinstitusjonSaksbehandling_hentAlleV2': 'hentAlleInstitusjoner',
    'opplæringspenger_hentLangvarigSykVurderingerFagsak': 'hentLangvarigSykVurderinger',
    'opplæringspenger_hentVurdertInstitusjon': 'hentVurdertInstitusjon',
    'opplæringspenger_hentVurdertLangvarigSykdom': 'hentVurdertLangvarigSykdom',
    'opplæringspenger_hentVurdertOpplæring': 'hentVurdertOpplæring',
    'opplæringspenger_hentVurdertReisetid': 'hentVurdertReisetid',
    'opplæringspenger_opprettLangvarigSykdomsVurdering': 'opprettLangvarigSykdomsVurdering',
    opptjening_getOpptjeninger: 'getOpptjeninger',
    'perioder_hentPerioderMedVilkårForBehandling': 'hentPerioderMedVilkår',
    simulering_hentSimuleringResultat: 'hentSimuleringResultat',
    'søknadsfrist_utledStatus': 'utledSøknadsfristStatus',
    tilbakekrevingsvalg_hentTilbakekrevingValg: 'hentTilbakekrevingValg',
    totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext: 'hentTotrinnskontroll',
    totrinnskontroll_hentTotrinnskontrollvurderingSkjermlenkeContext: 'hentTotrinnskontrollvurdering',
    'vilkår_getVilkårV3': 'getVilkår',
    ytelser_hentOverlappendeYtelser: 'hentOverlappendeYtelser',
  },
  ungsak: {
    aksjonspunkt_bekreft: 'bekreftAksjonspunkt',
    arbeidsgiver_getArbeidsgiverOpplysninger: 'getArbeidsgiverOpplysninger',
    etterlysning_endreFrist: 'endreFristEtterlysning',
    formidling_bestillInformasjonsbrev: 'bestillInformasjonsbrev',
    formidling_editor: 'hentBrevEditor',
    'formidling_forhåndsvisInformasjonsbrev': 'forhåndsvisInformasjonsbrev',
    'formidling_forhåndsvisKlageVedtaksbrev': 'forhåndsvisKlageVedtaksbrev',
    'formidling_forhåndsvisVedtaksbrev': 'forhåndsvisVedtaksbrev',
    formidling_informasjonsbrevValg: 'hentInformasjonsbrevValg',
    formidling_lagreVedtaksbrevValg: 'lagreVedtaksbrevValg',
    formidling_vedtaksbrevValg: 'hentVedtaksbrevValg',
    hentEtterlysninger: 'hentEtterlysninger',
    historikk_hentAlleInnslag: 'hentAlleHistorikkInnslag',
    kodeverk_alleKodeverdierSomObjekt: 'hentKodeverk',
    kontroll_hentKontrollerInntekt: 'hentKontrollerInntekt',
    navAnsatt_innloggetBruker: 'hentInnloggetBruker',
    noNavK9Klage_getKlageVurdering: 'getKlageVurdering',
    noNavK9Klage_hentValgbareKlagehjemler: 'hentValgbareKlagehjemler',
    noNavK9Klage_mellomlagreKlage: 'mellomlagreKlage',
    notat_endre: 'endreNotat',
    notat_hent: 'hentNotater',
    notat_opprett: 'opprettNotat',
    notat_skjul: 'skjulNotat',
    'perioder_hentPerioderMedVilkårForBehandling': 'hentPerioderMedVilkår',
    totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext: 'hentTotrinnskontroll',
    totrinnskontroll_hentTotrinnskontrollvurderingSkjermlenkeContext: 'hentTotrinnskontrollvurdering',
    ung_getSatsOgUtbetalingPerioder: 'getSatsOgUtbetalingPerioder',
    ung_getUngdomsprogramInformasjon: 'getUngdomsprogramInformasjon',
    'vilkår_getVilkårV3': 'getVilkår',
  },
  k9klage: {
    aksjonspunkt_bekreft: 'bekreftAksjonspunkt',
    brev_bestillDokument: 'bestillDokument',
    historikk_hentAlleInnslagV2: 'hentAlleHistorikkInnslag',
    kodeverk_alleKodeverdierSomObjekt: 'hentKodeverk',
    noNavK9Klage_getKlageVurdering: 'getKlageVurdering',
    noNavK9Klage_mellomlagreKlage: 'mellomlagreKlage',
    parter_hentValgtKlagendePart: 'hentValgtKlagendePart',
    totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext1: 'hentTotrinnskontroll',
    totrinnskontroll_hentTotrinnskontrollvurderingSkjermlenkeContext1: 'hentTotrinnskontrollvurdering',
  },
  k9tilbake: {
    aksjonspunkt_beslutt: 'besluttAksjonspunkt',
    brev_bestillBrev: 'bestillBrev',
    'brev_forhåndsvisBrev': 'forhåndsvisBrev',
    brev_hentMaler: 'hentBrevmaler',
    historikk_hentAlleInnslagV2: 'hentAlleHistorikkInnslag',
    kodeverk_alleKodeverdierSomObjekt: 'hentKodeverk',
    totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext: 'hentTotrinnskontroll',
    totrinnskontroll_hentTotrinnskontrollvurderingSkjermlenkeContext: 'hentTotrinnskontrollvurdering',
  },
  ungtilbake: {
    aksjonspunkt_beslutt: 'besluttAksjonspunkt',
    brev_bestillBrev: 'bestillBrev',
    'brev_forhåndsvisBrev': 'forhåndsvisBrev',
    brev_hentMaler: 'hentBrevmaler',
    historikk_hentAlleInnslagV2: 'hentAlleHistorikkInnslag',
    kodeverk_alleKodeverdierSomObjekt: 'hentKodeverk',
    totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext: 'hentTotrinnskontroll',
    totrinnskontroll_hentTotrinnskontrollvurderingSkjermlenkeContext: 'hentTotrinnskontrollvurdering',
  },
};

const SCHEMA_MAPPINGS = {
  k9sak: {
    '$k9_sak_kontrakt_dokument_BestillBrevDto': '$BestillBrevDto',
    '$k9_sak_kontrakt_dokument_FritekstbrevinnholdDto': '$FritekstbrevinnholdDto',
  },
};

// Phase 1: Rewrite re-export files
console.log('=== Phase 1: Rewriting re-export files ===');
for (const [backend, mapping] of Object.entries(MAPPINGS)) {
  const sdkPath = path.join(ROOT, 'packages/v2/backend/src', backend, 'sdk.ts');
  const entries = Object.entries(mapping);
  const lines = entries.map(([gen, clean]) =>
    gen === clean
      ? `  ${gen},`
      : `  ${gen} as ${clean},`
  );
  const content = `export {\n${lines.join('\n')}\n} from './generated/sdk.js';\n`;
  fs.writeFileSync(sdkPath, content, 'utf8');
  console.log(`  Wrote ${backend}/sdk.ts (${entries.length} exports)`);
}

for (const [backend, mapping] of Object.entries(SCHEMA_MAPPINGS)) {
  const schemaPath = path.join(ROOT, 'packages/v2/backend/src', backend, 'schemas.ts');
  const entries = Object.entries(mapping);
  const lines = entries.map(([gen, clean]) =>
    gen === clean
      ? `  ${gen},`
      : `  ${gen} as ${clean},`
  );
  const content = `export {\n${lines.join('\n')}\n} from './generated/schemas.js';\n`;
  fs.writeFileSync(schemaPath, content, 'utf8');
  console.log(`  Wrote ${backend}/schemas.ts (${entries.length} exports)`);
}

// Phase 2: Update consumer files
console.log('\n=== Phase 2: Updating consumer files ===');
const { execSync } = require('child_process');

let totalFilesUpdated = 0;
let totalReplacements = 0;

// Process SDK imports
for (const [backend, mapping] of Object.entries(MAPPINGS)) {
  const importPath = `@k9-sak-web/backend/${backend}/sdk.js`;
  let files;
  try {
    files = execSync(
      `grep -rl "${importPath}" packages/ --include='*.ts' --include='*.tsx'`,
      { encoding: 'utf8', cwd: ROOT }
    ).trim().split('\n').filter(Boolean);
  } catch { files = []; }

  for (const relFile of files) {
    const filePath = path.join(ROOT, relFile);
    let src = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Find import blocks from this backend's sdk.js
    const importRe = new RegExp(
      `(import\\s*\\{)([^}]+)(\\}\\s*from\\s*['"]${importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"])`,
      'gs'
    );

    src = src.replace(importRe, (fullMatch, prefix, importList, suffix) => {
      const newImportList = importList.split(',').map(part => {
        const trimmed = part.trim();
        if (!trimmed) return part;

        // Handle "generatedName as alias" pattern
        const asMatch = trimmed.match(/^(\S+)\s+as\s+(\S+)$/);
        if (asMatch) {
          const [, genName, alias] = asMatch;
          const cleanName = mapping[genName];
          if (cleanName && cleanName !== genName) {
            changed = true;
            totalReplacements++;
            // Replace genName with cleanName, keep the alias
            if (cleanName === alias) {
              // alias matches clean name, simplify
              return part.replace(trimmed, cleanName);
            }
            return part.replace(genName, cleanName);
          }
          return part;
        }

        // Handle plain import "generatedName"
        const cleanName = mapping[trimmed];
        if (cleanName && cleanName !== trimmed) {
          changed = true;
          totalReplacements++;
          return part.replace(trimmed, cleanName);
        }
        return part;
      }).join(',');

      return prefix + newImportList + suffix;
    });

    // Also replace usage of the generated names in the body of the file
    // (only the ones that were NOT aliased — for aliased imports we only changed the import)
    // We need to find which names were used directly (not aliased) and replace them in the body
    // Actually, we need to be more careful: re-read the original to find unaliased imports
    const origSrc = fs.readFileSync(filePath, 'utf8');
    const origImportRe = new RegExp(
      `import\\s*\\{([^}]+)\\}\\s*from\\s*['"]${importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`,
      'gs'
    );
    const directNames = []; // { genName, cleanName } for unaliased imports
    let m;
    while ((m = origImportRe.exec(origSrc))) {
      m[1].split(',').forEach(part => {
        const trimmed = part.trim();
        if (!trimmed) return;
        // Skip aliased imports — those use the alias in the body, not the generated name
        if (/\s+as\s+/.test(trimmed)) return;
        const cleanName = mapping[trimmed];
        if (cleanName && cleanName !== trimmed) {
          directNames.push({ genName: trimmed, cleanName });
        }
      });
    }

    // Replace usage in file body (outside imports)
    for (const { genName, cleanName } of directNames) {
      // Use word boundary to avoid partial matches
      // Need Unicode-aware boundaries for Norwegian chars
      const usageRe = new RegExp(`(?<![\\w\\p{L}])${genName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w\\p{L}])`, 'gu');
      const beforeLen = src.length;
      src = src.replace(usageRe, cleanName);
      if (src.length !== beforeLen) {
        changed = true;
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, src, 'utf8');
      totalFilesUpdated++;
      console.log(`  Updated: ${relFile}`);
    }
  }
}

// Process schema imports
for (const [backend, mapping] of Object.entries(SCHEMA_MAPPINGS)) {
  const importPath = `@k9-sak-web/backend/${backend}/schemas.js`;
  let files;
  try {
    files = execSync(
      `grep -rl "${importPath}" packages/ --include='*.ts' --include='*.tsx'`,
      { encoding: 'utf8', cwd: ROOT }
    ).trim().split('\n').filter(Boolean);
  } catch { files = []; }

  for (const relFile of files) {
    const filePath = path.join(ROOT, relFile);
    let src = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    const importRe = new RegExp(
      `(import\\s*\\{)([^}]+)(\\}\\s*from\\s*['"]${importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"])`,
      'gs'
    );

    src = src.replace(importRe, (fullMatch, prefix, importList, suffix) => {
      const newImportList = importList.split(',').map(part => {
        const trimmed = part.trim();
        if (!trimmed) return part;
        const asMatch = trimmed.match(/^(\S+)\s+as\s+(\S+)$/);
        if (asMatch) {
          const [, genName, alias] = asMatch;
          const cleanName = mapping[genName];
          if (cleanName && cleanName !== genName) {
            changed = true;
            totalReplacements++;
            if (cleanName === alias) {
              return part.replace(trimmed, cleanName);
            }
            return part.replace(genName, cleanName);
          }
          return part;
        }
        const cleanName = mapping[trimmed];
        if (cleanName && cleanName !== trimmed) {
          changed = true;
          totalReplacements++;
          return part.replace(trimmed, cleanName);
        }
        return part;
      }).join(',');

      return prefix + newImportList + suffix;
    });

    // Replace body usage for unaliased schema imports
    const origSrc = fs.readFileSync(filePath, 'utf8');
    const origImportRe = new RegExp(
      `import\\s*\\{([^}]+)\\}\\s*from\\s*['"]${importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`,
      'gs'
    );
    const directNames = [];
    let m2;
    while ((m2 = origImportRe.exec(origSrc))) {
      m2[1].split(',').forEach(part => {
        const trimmed = part.trim();
        if (!trimmed || /\s+as\s+/.test(trimmed)) return;
        const cleanName = mapping[trimmed];
        if (cleanName && cleanName !== trimmed) {
          directNames.push({ genName: trimmed, cleanName });
        }
      });
    }
    for (const { genName, cleanName } of directNames) {
      const usageRe = new RegExp(`(?<![\\w\\p{L}\\$])\\${genName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w\\p{L}])`, 'gu');
      const beforeLen = src.length;
      src = src.replace(usageRe, cleanName);
      if (src.length !== beforeLen) changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, src, 'utf8');
      totalFilesUpdated++;
      console.log(`  Updated: ${relFile}`);
    }
  }
}

console.log(`\nDone. Updated ${totalFilesUpdated} consumer files with ${totalReplacements} import renames.`);

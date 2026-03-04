#!/usr/bin/env node
/**
 * Codemod: Replace direct imports from @k9-sak-web/backend/x/generated/types.js
 * with imports from re-export files.
 *
 * Usage: node scripts/fix-generated-imports.cjs [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const BACKEND_SRC = path.join(ROOT, 'packages/v2/backend/src');
const DRY_RUN = process.argv.includes('--dry-run');

// ==================================================================
// PREFIX RULES: map generated symbol prefix → re-export subdirectory
// Ordered longest-first to match most specific prefix first
// ==================================================================
const PREFIX_RULES = [
  // k9sak
  { backend: 'k9sak', prefix: 'k9_sak_web_app_tjenester_', dir: 'tjenester/' },
  { backend: 'k9sak', prefix: 'k9_sak_kontrakt_', dir: 'kontrakt/' },
  { backend: 'k9sak', prefix: 'k9_sak_typer_', dir: 'typer/' },
  { backend: 'k9sak', prefix: 'k9_kodeverk_', dir: 'kodeverk/' },
  { backend: 'k9sak', prefix: 'k9_formidling_kontrakt_kodeverk_', dir: 'kodeverk/formidling/' },
  { backend: 'k9sak', prefix: 'folketrygdloven_kalkulus_kodeverk_', dir: 'kodeverk/beregning/' },
  { backend: 'k9sak', prefix: 'pleiepengerbarn_uttak_kontrakter_', dir: 'kontrakt/uttak/' },
  { backend: 'k9sak', prefix: 'sif_abac_kontrakt_abac_', dir: 'kontrakt/sif/' },
  // k9klage
  { backend: 'k9klage', prefix: 'k9_klage_web_app_tjenester_', dir: 'tjenester/' },
  { backend: 'k9klage', prefix: 'k9_klage_kontrakt_', dir: 'kontrakt/' },
  { backend: 'k9klage', prefix: 'k9_klage_kodeverk_', dir: 'kodeverk/' },
  // k9tilbake
  { backend: 'k9tilbake', prefix: 'foreldrepenger_tilbakekreving_web_app_tjenester_kodeverk_dto_', dir: 'tjenester/kodeverk/' },
  { backend: 'k9tilbake', prefix: 'foreldrepenger_tilbakekreving_web_app_tjenester_behandling_dto_', dir: 'tjenester/behandling/' },
  { backend: 'k9tilbake', prefix: 'foreldrepenger_tilbakekreving_web_app_tjenester_', dir: 'tjenester/' },
  { backend: 'k9tilbake', prefix: 'foreldrepenger_tilbakekreving_behandlingslager_', dir: 'kodeverk/' },
  { backend: 'k9tilbake', prefix: 'foreldrepenger_tilbakekreving_dokumentbestilling_', dir: 'kontrakt/dokumentbestilling/' },
  { backend: 'k9tilbake', prefix: 'foreldrepenger_tilbakekreving_historikk_', dir: 'kontrakt/historikk/' },
  // ungsak
  { backend: 'ungsak', prefix: 'ung_sak_web_app_tjenester_', dir: 'tjenester/' },
  { backend: 'ungsak', prefix: 'ung_sak_kontrakt_', dir: 'kontrakt/' },
  { backend: 'ungsak', prefix: 'ung_kodeverk_', dir: 'kodeverk/' },
  // ungtilbake
  { backend: 'ungtilbake', prefix: 'sif_tilbakekreving_web_app_tjenester_kodeverk_dto_', dir: 'tjenester/kodeverk/' },
  { backend: 'ungtilbake', prefix: 'sif_tilbakekreving_web_app_tjenester_behandling_dto_', dir: 'tjenester/behandling/' },
  { backend: 'ungtilbake', prefix: 'sif_tilbakekreving_web_app_tjenester_', dir: 'tjenester/' },
  { backend: 'ungtilbake', prefix: 'sif_tilbakekreving_behandlingslager_', dir: 'kodeverk/' },
  { backend: 'ungtilbake', prefix: 'sif_tilbakekreving_dokumentbestilling_', dir: 'kontrakt/dokumentbestilling/' },
  // Additional prefixes
  { backend: 'k9sak', prefix: 'k9_oppdrag_kontrakt_', dir: 'kontrakt/oppdrag/' },
].sort((a, b) => b.prefix.length - a.prefix.length); // longest first

// Explicit mappings for short names or irregular names
const EXPLICIT_PATH = {
  'k9sak:AlleKodeverdierSomObjektResponse': 'k9sak/tjenester/kodeverk/',
  'k9sak:GetVilkårV3Response': 'k9sak/tjenester/vilkår/',
  'k9sak:HentAlleInnslagV2Response': 'k9sak/tjenester/historikk/',
  'k9sak:HentAlleV2Response': 'k9sak/tjenester/historikk/',
  'k9sak:MatchFagsakerResponse': 'k9sak/tjenester/fagsak/',
  'k9sak:OpprettLangvarigSykdomsVurderingData': 'k9sak/tjenester/opplæringspenger/',
  'k9klage:AlleKodeverdierSomObjektResponse': 'k9klage/tjenester/kodeverk/',
  'k9tilbake:AlleKodeverdierSomObjektResponse': 'k9tilbake/tjenester/kodeverk/',
  'ungsak:AlleKodeverdierSomObjektResponse': 'ungsak/tjenester/kodeverk/',
  'ungsak:GetVilkårV3Response': 'ungsak/tjenester/vilkår/',
  'ungtilbake:AlleKodeverdierSomObjektResponse': 'ungtilbake/tjenester/kodeverk/',
};

// For short generated names with no prefix match, derive a subdirectory from the name
function deriveSubdirFromShortName(name) {
  // Response/Request types → tjenester/
  if (/Response$/.test(name)) return 'tjenester/';
  if (/Request$/.test(name)) return 'tjenester/';
  if (/Data$/.test(name)) return 'tjenester/';
  // Dto types → kontrakt/
  if (/Dto$/.test(name)) return 'kontrakt/';
  // Default
  return 'kontrakt/';
}

// ==================================================================
// PHASE 1: Scan existing re-export files → build mapping
// ==================================================================

/**
 * mapping: Map<"backend:generatedSymbol", {
 *   reexportFile: string,       // relative path from BACKEND_SRC
 *   exportedNames: string[],    // names exported from the re-export (type and/or const)
 *   isValue: boolean,           // whether the re-export also has a const export
 * }>
 */
const mapping = new Map();

function scanExistingReexports() {
  const files = execSync(
    `find ${BACKEND_SRC} -not -path '*/generated/*' -type f -name '*.ts' ! -name '*.spec.ts'`,
    { encoding: 'utf8' }
  ).trim().split('\n');

  for (const absPath of files) {
    const content = fs.readFileSync(absPath, 'utf8');
    const relPath = path.relative(BACKEND_SRC, absPath);

    // Find imports from generated/types.js (both relative and absolute)
    const importRegex = /import\s+(?:type\s+)?\{([^}]+)\}\s+from\s+['"]([^'"]*generated\/types\.js)['"]/gs;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const fromPath = match[2];
      let backend;

      // Determine backend from the import path
      const absImportMatch = fromPath.match(/@k9-sak-web\/backend\/(k9sak|ungsak|k9klage|k9tilbake|ungtilbake)/);
      if (absImportMatch) {
        backend = absImportMatch[1];
      } else {
        // Relative import → derive from file location
        if (relPath.startsWith('k9sak/')) backend = 'k9sak';
        else if (relPath.startsWith('ungsak/')) backend = 'ungsak';
        else if (relPath.startsWith('k9klage/')) backend = 'k9klage';
        else if (relPath.startsWith('k9tilbake/')) backend = 'k9tilbake';
        else if (relPath.startsWith('ungtilbake/')) backend = 'ungtilbake';
        else if (relPath.startsWith('combined/')) {
          // Combined files can import from any backend
          const relGenMatch = fromPath.match(/\.\.\/(k9sak|ungsak|k9klage|k9tilbake|ungtilbake)\//);
          if (relGenMatch) backend = relGenMatch[1];
        }
      }

      if (!backend) continue;

      const symbols = match[1].split(',');
      for (let sym of symbols) {
        sym = sym.trim();
        if (!sym) continue;
        if (sym.startsWith('//')) continue;
        if (sym.startsWith('type ')) sym = sym.slice(5).trim();
        const asMatch = sym.match(/^(\S+)\s+as\s+/);
        const genName = asMatch ? asMatch[1] : sym.split(/\s/)[0];
        if (!genName || genName.startsWith('//')) continue;

        const key = `${backend}:${genName}`;
        if (!mapping.has(key)) {
          // Find exported names from the file
          const exportedTypes = [];
          const exportedConsts = [];
          const typeExportRegex = /export\s+type\s+([\w\p{L}]+)/gu;
          const constExportRegex = /export\s+const\s+([\w\p{L}]+)/gu;
          const directTypeExRegex = /export\s+type\s+\{[^}]*?\bas\s+([\w\p{L}]+)/gu;
          const directValueExRegex = /export\s+\{[^}]*?\bas\s+([\w\p{L}]+)/gu;
          let m;
          while ((m = typeExportRegex.exec(content)) !== null) exportedTypes.push(m[1]);
          while ((m = constExportRegex.exec(content)) !== null) exportedConsts.push(m[1]);
          while ((m = directTypeExRegex.exec(content)) !== null) exportedTypes.push(m[1]);
          while ((m = directValueExRegex.exec(content)) !== null) {
            if (!content.match(new RegExp(`export\\s+type\\s+\\{[^}]*as\\s+${m[1]}`))) {
              exportedConsts.push(m[1]);
            }
          }

          mapping.set(key, {
            reexportFile: relPath,
            exportedTypes: [...new Set(exportedTypes)],
            exportedConsts: [...new Set(exportedConsts)],
          });
        }
      }
    }

    // Also handle direct re-exports: export type { X as Y } from '...generated/types.js'
    const directExportRegex = /export\s+(type\s+)?\{([^}]+)\}\s+from\s+['"]([^'"]*generated\/types\.js)['"]/gs;
    let dMatch;
    while ((dMatch = directExportRegex.exec(content)) !== null) {
      const isTypeExport = !!dMatch[1];
      const fromPath = dMatch[3];
      let backend;
      const absImportMatch = fromPath.match(/@k9-sak-web\/backend\/(k9sak|ungsak|k9klage|k9tilbake|ungtilbake)/);
      if (absImportMatch) {
        backend = absImportMatch[1];
      } else {
        if (relPath.startsWith('k9sak/')) backend = 'k9sak';
        else if (relPath.startsWith('ungsak/')) backend = 'ungsak';
        else if (relPath.startsWith('k9klage/')) backend = 'k9klage';
        else if (relPath.startsWith('k9tilbake/')) backend = 'k9tilbake';
        else if (relPath.startsWith('ungtilbake/')) backend = 'ungtilbake';
      }
      if (!backend) continue;

      const symbols = dMatch[2].split(',');
      for (let sym of symbols) {
        sym = sym.trim();
        if (!sym) continue;
        const asMatch = sym.match(/^(\S+)\s+as\s+(\S+)$/);
        if (asMatch) {
          const genName = asMatch[1];
          const exportedName = asMatch[2];
          const key = `${backend}:${genName}`;
          if (!mapping.has(key)) {
            mapping.set(key, {
              reexportFile: relPath,
              exportedTypes: isTypeExport ? [exportedName] : [],
              exportedConsts: isTypeExport ? [] : [exportedName],
            });
          }
        }
      }
    }
  }
}

// ==================================================================
// PHASE 2: Find all consuming files and collect needed symbols
// ==================================================================

function findConsumingFiles() {
  const result = execSync(
    `grep -rl "from '@k9-sak-web/backend/.*generated/types.js'" --include='*.ts' --include='*.tsx' packages/ | grep -v 'packages/v2/backend/'`,
    { cwd: ROOT, encoding: 'utf8' }
  ).trim().split('\n').filter(Boolean);
  return result.map(f => path.join(ROOT, f));
}

// Parse a symbol from an import clause like "type X as Y" or "X as Y" or "X"
function parseSymbol(raw) {
  raw = raw.trim();
  if (!raw) return null;
  const isTypeSpecific = raw.startsWith('type ');
  if (isTypeSpecific) raw = raw.slice(5).trim();
  const asMatch = raw.match(/^(\S+)\s+as\s+(\S+)$/);
  let genName, localAlias;
  if (asMatch) {
    genName = asMatch[1];
    localAlias = asMatch[2];
  } else {
    genName = raw;
    localAlias = raw;
  }
  return { genName, localAlias, isType: isTypeSpecific };
}

// ==================================================================
// PHASE 3: Derive re-export path for symbols not yet mapped
// ==================================================================

function deriveReexportPath(backend, genName) {
  // Check explicit mappings
  const explicitKey = `${backend}:${genName}`;
  if (EXPLICIT_PATH[explicitKey]) {
    return { dir: EXPLICIT_PATH[explicitKey], typeName: genName };
  }

  // Check prefix rules
  for (const rule of PREFIX_RULES) {
    if (rule.backend === backend && genName.startsWith(rule.prefix)) {
      const rest = genName.slice(rule.prefix.length);
      const result = splitRestIntoPathAndName(rule.dir, rest);
      result.dir = `${backend}/${result.dir}`;
      return result;
    }
  }

  // Default: use heuristic based on name suffix
  const subdir = deriveSubdirFromShortName(genName);
  return { dir: `${backend}/${subdir}`, typeName: genName };
}

function splitRestIntoPathAndName(baseDir, rest) {
  // Split by underscore. Lowercase segments → path, first PascalCase segment → type name (including any trailing underscored parts)
  const parts = rest.split('_');
  const pathParts = [];
  let typeNameParts = [];
  let foundTypeName = false;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!foundTypeName && part.length > 0 && part[0] === part[0].toLowerCase() && part[0] !== part[0].toUpperCase()) {
      pathParts.push(part);
    } else {
      foundTypeName = true;
      typeNameParts.push(part);
    }
  }

  const subDir = pathParts.length > 0 ? pathParts.join('/') + '/' : '';
  const typeName = typeNameParts.join('');

  return { dir: baseDir + subDir, typeName: typeName || rest };
}

// ==================================================================
// PHASE 4: Create missing re-export files
// ==================================================================

// Collect needed symbols from consumers
function collectNeededSymbols(consumerFiles) {
  const needed = new Map(); // "backend:genName" → { isValue: boolean, preferredAlias: string }

  for (const filePath of consumerFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const importRegex = /import\s+(type\s+)?\{([^}]+)\}\s+from\s+['"]@k9-sak-web\/backend\/(k9sak|ungsak|k9klage|k9tilbake|ungtilbake)\/generated\/types\.js['"]/gs;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const isTypeImport = !!match[1];
      const backend = match[3];
      const symbols = match[2].split(',');

      for (const raw of symbols) {
        const parsed = parseSymbol(raw);
        if (!parsed) continue;

        const key = `${backend}:${parsed.genName}`;
        if (!needed.has(key)) {
          needed.set(key, { isValue: false, preferredAlias: parsed.localAlias, backend });
        }
        const entry = needed.get(key);
        if (!isTypeImport && !parsed.isType) {
          entry.isValue = true;
        }
        // Prefer clean alias over raw generated name
        if (parsed.localAlias !== parsed.genName && entry.preferredAlias === parsed.genName) {
          entry.preferredAlias = parsed.localAlias;
        }
      }
    }
  }

  return needed;
}

function createReexportFile(backend, genName, info) {
  const derived = deriveReexportPath(backend, genName);
  const dir = derived.dir;
  const typeName = info.preferredAlias !== genName ? info.preferredAlias : derived.typeName;

  const filePath = path.join(BACKEND_SRC, dir, typeName + '.ts');
  const importPath = `@k9-sak-web/backend/${backend}/generated/types.js`;

  let content;
  if (info.isValue) {
    content = [
      `import {`,
      `  type ${genName} as typeUnion,`,
      `  ${genName} as enumObj,`,
      `} from '${importPath}';`,
      ``,
      `export type ${typeName} = typeUnion;`,
      ``,
      `export const ${typeName} = enumObj;`,
      ``
    ].join('\n');
  } else {
    content = [
      `import type { ${genName} } from '${importPath}';`,
      ``,
      `export type ${typeName} = ${genName};`,
      ``
    ].join('\n');
  }

  const absDir = path.dirname(filePath);
  const relFile = path.relative(BACKEND_SRC, filePath);

  if (DRY_RUN) {
    console.log(`[DRY] Would create: ${relFile}`);
  } else {
    fs.mkdirSync(absDir, { recursive: true });
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content);
      console.log(`Created: ${relFile}`);
    } else {
      console.log(`Exists:  ${relFile}`);
    }
  }

  // Register in mapping
  const key = `${backend}:${genName}`;
  mapping.set(key, {
    reexportFile: path.relative(BACKEND_SRC, filePath),
    exportedTypes: [typeName],
    exportedConsts: info.isValue ? [typeName] : [],
  });
}

// ==================================================================
// PHASE 5: Rewrite consumer files
// ==================================================================

function rewriteConsumerFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Match import blocks from generated/types.js (single-line and multi-line)
  const importRegex = /import\s+(type\s+)?\{([^}]+)\}\s+from\s+['"]@k9-sak-web\/backend\/(k9sak|ungsak|k9klage|k9tilbake|ungtilbake)\/generated\/types\.js['"](\s*;)?/gs;

  const replacements = []; // { start, end, newText, renames: [{from, to}] }

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const fullMatch = match[0];
    const isTypeImport = !!match[1];
    const backend = match[3];

    const symbols = match[2].split(',');
    const parsedSymbols = [];

    for (const raw of symbols) {
      const parsed = parseSymbol(raw);
      if (!parsed) continue;
      parsedSymbols.push({ ...parsed, isTypeImport });
    }

    // Group by re-export file
    const groups = new Map(); // reexportFile → [{ exportedName, localAlias, isType }]
    const renames = []; // file-wide renames needed

    for (const sym of parsedSymbols) {
      const key = `${backend}:${sym.genName}`;
      const info = mapping.get(key);

      if (!info) {
        console.warn(`  WARNING: No mapping for ${key} in ${path.relative(ROOT, filePath)}`);
        // Keep original import for this symbol
        continue;
      }

      const isType = isTypeImport || sym.isType;
      let exportedName;
      if (isType && info.exportedTypes.length > 0) {
        exportedName = info.exportedTypes[0];
      } else if (!isType && info.exportedConsts.length > 0) {
        exportedName = info.exportedConsts[0];
      } else if (info.exportedTypes.length > 0) {
        exportedName = info.exportedTypes[0];
      } else if (info.exportedConsts.length > 0) {
        exportedName = info.exportedConsts[0];
      } else {
        console.warn(`  WARNING: No exported name for ${key}`);
        continue;
      }

      const importPath = `@k9-sak-web/backend/${info.reexportFile.replace(/\.ts$/, '.js')}`;

      if (!groups.has(importPath)) {
        groups.set(importPath, []);
      }

      // Determine what alias to use
      let localAlias = sym.localAlias;

      // If the local alias is the raw generated name, we should rename usages
      if (localAlias === sym.genName && localAlias !== exportedName) {
        // The consumer uses the raw generated name → rename to the clean name
        renames.push({ from: sym.genName, to: exportedName });
        localAlias = exportedName;
      }

      groups.get(importPath).push({
        exportedName,
        localAlias,
        isType: isType,
        needsAs: localAlias !== exportedName,
      });
    }

    if (groups.size === 0) continue;

    // Build new import statements
    const newImports = [];
    for (const [importPath, syms] of groups) {
      // Group type-only and value imports
      const typeSyms = syms.filter(s => s.isType);
      const valueSyms = syms.filter(s => !s.isType);

      if (typeSyms.length > 0 && valueSyms.length === 0) {
        // All type imports
        const specifiers = typeSyms.map(s =>
          s.needsAs ? `${s.exportedName} as ${s.localAlias}` : s.exportedName
        ).join(', ');
        newImports.push(`import type { ${specifiers} } from '${importPath}';`);
      } else if (valueSyms.length > 0 && typeSyms.length === 0) {
        // All value imports
        const specifiers = valueSyms.map(s =>
          s.needsAs ? `${s.exportedName} as ${s.localAlias}` : s.exportedName
        ).join(', ');
        newImports.push(`import { ${specifiers} } from '${importPath}';`);
      } else {
        // Mix of type and value imports
        const allSpecifiers = [];
        for (const s of typeSyms) {
          const spec = s.needsAs ? `${s.exportedName} as ${s.localAlias}` : s.exportedName;
          allSpecifiers.push(`type ${spec}`);
        }
        for (const s of valueSyms) {
          const spec = s.needsAs ? `${s.exportedName} as ${s.localAlias}` : s.exportedName;
          allSpecifiers.push(spec);
        }
        newImports.push(`import { ${allSpecifiers.join(', ')} } from '${importPath}';`);
      }
    }

    replacements.push({
      start: match.index,
      end: match.index + fullMatch.length,
      newText: newImports.join('\n'),
      renames,
    });
  }

  if (replacements.length === 0) return false;

  // Apply replacements in reverse order (so indices stay valid)
  replacements.sort((a, b) => b.start - a.start);

  for (const rep of replacements) {
    content = content.slice(0, rep.start) + rep.newText + content.slice(rep.end);
  }

  // Apply renames (find-replace of generated names → clean names)
  for (const rep of replacements) {
    for (const rename of rep.renames) {
      // Replace all occurrences of the generated name with the clean name
      // Use word boundary to avoid partial matches
      const regex = new RegExp(`(?<![\\w\\p{L}])${escapeRegex(rename.from)}(?![\\w\\p{L}])`, 'gu');
      content = content.replace(regex, rename.to);
    }
  }

  if (DRY_RUN) {
    console.log(`[DRY] Would rewrite: ${path.relative(ROOT, filePath)}`);
  } else {
    fs.writeFileSync(filePath, content);
    modified = true;
  }

  return modified;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ==================================================================
// MAIN
// ==================================================================

function main() {
  console.log('=== Phase 1: Scanning existing re-exports ===');
  scanExistingReexports();
  console.log(`Found ${mapping.size} existing mappings`);

  console.log('\n=== Phase 2: Finding consuming files ===');
  const consumerFiles = findConsumingFiles();
  console.log(`Found ${consumerFiles.length} consuming files`);

  console.log('\n=== Phase 3: Collecting needed symbols ===');
  const needed = collectNeededSymbols(consumerFiles);
  console.log(`Found ${needed.size} unique symbols needed`);

  console.log('\n=== Phase 4: Creating missing re-export files ===');
  let created = 0;
  for (const [key, info] of needed) {
    if (!mapping.has(key)) {
      const [backend, genName] = [info.backend, key.split(':').slice(1).join(':')];
      createReexportFile(backend, genName, info);
      created++;
    }
  }
  console.log(`Created ${created} new re-export files`);

  console.log('\n=== Phase 5: Rewriting consumer files ===');
  let rewritten = 0;
  for (const filePath of consumerFiles) {
    const result = rewriteConsumerFile(filePath);
    if (result) rewritten++;
  }
  console.log(`Rewritten ${rewritten} files`);

  console.log('\n=== Done ===');
  console.log(`Total mappings: ${mapping.size}`);
}

main();

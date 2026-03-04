#!/usr/bin/env node
/**
 * Fix TS2440 errors in re-export files where import name == export name.
 * Changes: import type { X } from '...'; export type X = X;
 * To:      import type { X as Generated } from '...'; export type X = Generated;
 */

const fs = require('fs');

const files = [
  'packages/v2/backend/src/k9klage/tjenester/kodeverk/AlleKodeverdierSomObjektResponse.ts',
  'packages/v2/backend/src/k9sak/tjenester/BekreftData.ts',
  'packages/v2/backend/src/k9sak/tjenester/GetBrevMottakerinfoEregData.ts',
  'packages/v2/backend/src/k9sak/tjenester/GetBrevMottakerinfoEregResponse.ts',
  'packages/v2/backend/src/k9sak/tjenester/GetMerknadResponse.ts',
  'packages/v2/backend/src/k9sak/tjenester/GetUferdigJournalpostIderPrAktoer1Response.ts',
  'packages/v2/backend/src/k9sak/tjenester/OpprettLangvarigSykdomsVurderingResponse.ts',
  'packages/v2/backend/src/k9sak/tjenester/fagsak/MatchFagsakerResponse.ts',
  'packages/v2/backend/src/k9sak/tjenester/historikk/HentAlleInnslagV2Response.ts',
  'packages/v2/backend/src/k9sak/tjenester/historikk/HentAlleV2Response.ts',
  'packages/v2/backend/src/k9sak/tjenester/kodeverk/AlleKodeverdierSomObjektResponse.ts',
  'packages/v2/backend/src/k9sak/tjenester/opplæringspenger/OpprettLangvarigSykdomsVurderingData.ts',
  'packages/v2/backend/src/k9tilbake/tjenester/kodeverk/AlleKodeverdierSomObjektResponse.ts',
  'packages/v2/backend/src/ungsak/kontrakt/LagreVedtaksbrevValgResponses.ts',
  'packages/v2/backend/src/ungsak/tjenester/ForhåndsvisInformasjonsbrevResponse.ts',
  'packages/v2/backend/src/ungsak/tjenester/ForhåndsvisVedtaksbrevResponse.ts',
  'packages/v2/backend/src/ungsak/tjenester/GetSatsOgUtbetalingPerioderResponse.ts',
  'packages/v2/backend/src/ungsak/tjenester/InformasjonsbrevValgResponse.ts',
  'packages/v2/backend/src/ungsak/tjenester/VedtaksbrevValgResponse.ts',
  'packages/v2/backend/src/ungsak/tjenester/kodeverk/AlleKodeverdierSomObjektResponse.ts',
  'packages/v2/backend/src/ungtilbake/tjenester/kodeverk/AlleKodeverdierSomObjektResponse.ts',
];

const ROOT = require('path').resolve(__dirname, '..');
let fixed = 0;

for (const relPath of files) {
  const absPath = require('path').join(ROOT, relPath);
  const content = fs.readFileSync(absPath, 'utf8');

  // Match: import type { X } from '...'; export type X = X;
  const pattern = /^import type \{ ([\w\p{L}]+) \} from '([^']+)';\n\nexport type \1 = \1;\n$/u;
  const match = content.match(pattern);

  if (match) {
    const name = match[1];
    const fromPath = match[2];
    const newContent = `import type { ${name} as Generated } from '${fromPath}';\n\nexport type ${name} = Generated;\n`;
    fs.writeFileSync(absPath, newContent);
    console.log(`Fixed: ${relPath}`);
    fixed++;
  } else {
    // Try value pattern
    const valuePattern = /^import \{\n\s+type ([\w\p{L}]+) as typeUnion,\n\s+\1 as enumObj,\n\} from '([^']+)';\n\nexport type \1 = typeUnion;\n\nexport const \1 = enumObj;\n$/u;
    const vMatch = content.match(valuePattern);
    if (vMatch) {
      const name = vMatch[1];
      const fromPath = vMatch[2];
      // Same name for import and export with value - use alias
      const newContent = `import {\n  type ${name} as typeUnion,\n  ${name} as enumObj,\n} from '${fromPath}';\n\nexport type ${name}Type = typeUnion;\n\nexport const ${name}Const = enumObj;\n`;
      // Actually, better to just alias the import
      const newContent2 = `import type { ${name} as Generated } from '${fromPath}';\n\nexport type ${name} = Generated;\n`;
      fs.writeFileSync(absPath, newContent2);
      console.log(`Fixed (value→type): ${relPath}`);
      fixed++;
    } else {
      console.log(`SKIP (no match): ${relPath}`);
      console.log(`  Content: ${content.slice(0, 200)}`);
    }
  }
}

console.log(`\nFixed ${fixed}/${files.length} files`);

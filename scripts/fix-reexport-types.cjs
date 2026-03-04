#!/usr/bin/env node
/**
 * Fix re-export files that were incorrectly created with value pattern
 * for type-only generated symbols. Converts:
 *   import { type X as typeUnion, X as enumObj } from '...';
 *   export type Y = typeUnion;
 *   export const Y = enumObj;
 * to:
 *   import type { X } from '...';
 *   export type Y = X;
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BACKEND_SRC = path.join(ROOT, 'packages/v2/backend/src');

const files = [
  'k9sak/kontrakt/AvslagsårsakPrPeriodeDto.ts',
  'k9sak/kontrakt/BeregningsgrunnlagDto.ts',
  'k9sak/kontrakt/BeregningsgrunnlagPeriodeDto.ts',
  'k9sak/kontrakt/YtelsespesifiktGrunnlagDto.ts',
  'k9sak/kontrakt/behandling/BehandlingsresultatDto.ts',
  'k9sak/kontrakt/behandling/BehandlingÅrsakDto.ts',
  'k9sak/kontrakt/beregningsgrunnlag/BeregningsgrunnlagKoblingDto.ts',
  'k9sak/kontrakt/beregningsresultat/BeregningsresultatMedUtbetaltePeriodeDto.ts',
  'k9sak/kontrakt/beregningsresultat/BeregningsresultatPeriodeDto.ts',
  'k9sak/kontrakt/infotrygd/DirekteOvergangDto.ts',
  'k9sak/kontrakt/medlem/MedlemV2Dto.ts',
  'k9sak/kontrakt/oppdrag/simulering/v1/SimuleringDto.ts',
  'k9sak/kontrakt/opptjening/OpptjeningerDto.ts',
  'k9sak/kontrakt/person/PersonopplysningDto.ts',
  'k9sak/kontrakt/søknadsfrist/SøknadsfristTilstandDto.ts',
  'k9sak/kontrakt/vedtak/DokumentMedUstrukturerteDataDto.ts',
  'k9sak/kontrakt/vilkår/VilkårMedPerioderDto.ts',
  'k9sak/kontrakt/vilkår/VilkårPeriodeDto.ts',
  'k9sak/kontrakt/ytelser/OverlappendeYtelseDto.ts',
  'k9sak/kontrakt/økonomi/tilbakekreving/TilbakekrevingValgDto.ts',
  'k9sak/tjenester/behandling/uttak/UttaksplanMedUtsattePerioder.ts',
  'k9sak/tjenester/los/dto/MerknadResponse.ts',
  'ungsak/kontrakt/kontroll/KontrollerInntektDto.ts',
  'ungsak/kontrakt/person/PersonopplysningDto.ts',
  'ungsak/tjenester/GetUngdomsprogramInformasjonResponse.ts',
];

let fixed = 0;
for (const relFile of files) {
  const absPath = path.join(BACKEND_SRC, relFile);
  const content = fs.readFileSync(absPath, 'utf8');

  // Match the value export pattern
  const valuePattern = /import \{\n\s+type ([\w\p{L}]+) as typeUnion,\n\s+\1 as enumObj,\n\} from '([^']+)';\n\nexport type ([\w\p{L}]+) = typeUnion;\n\nexport const \3 = enumObj;\n/u;
  const match = content.match(valuePattern);

  if (match) {
    const genName = match[1];
    const fromPath = match[2];
    const exportName = match[3];

    const newContent = `import type { ${genName} } from '${fromPath}';\n\nexport type ${exportName} = ${genName};\n`;
    fs.writeFileSync(absPath, newContent);
    console.log(`Fixed: ${relFile}`);
    fixed++;
  } else {
    console.log(`SKIP (no match): ${relFile}`);
  }
}

console.log(`\nFixed ${fixed}/${files.length} files`);

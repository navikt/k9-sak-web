#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const BACKEND_SRC = path.join(ROOT, 'packages/v2/backend/src');

// Phase 1: Scan existing re-export files
const reexportFiles = execSync(
  `find ${BACKEND_SRC} -not -path '*/generated/*' -type f -name '*.ts' ! -name '*.spec.ts'`,
  { encoding: 'utf8' }
).trim().split('\n');

const existingMap = new Map(); // "backend:generatedSymbol" → relPath

for (const absPath of reexportFiles) {
  const content = fs.readFileSync(absPath, 'utf8');
  const relPath = path.relative(BACKEND_SRC, absPath);

  const importRegex = /import\s+(?:type\s+)?{([^}]+)}\s+from\s+['"]([^'"]*generated\/types\.js)['"]/gs;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const fromPath = match[2];
    let backend;
    const absMatch = fromPath.match(/@k9-sak-web\/backend\/(k9sak|ungsak|k9klage|k9tilbake|ungtilbake)/);
    if (absMatch) {
      backend = absMatch[1];
    } else {
      // Relative path - determine from file location
      if (relPath.startsWith('k9sak/')) backend = 'k9sak';
      else if (relPath.startsWith('ungsak/')) backend = 'ungsak';
      else if (relPath.startsWith('k9klage/')) backend = 'k9klage';
      else if (relPath.startsWith('k9tilbake/')) backend = 'k9tilbake';
      else if (relPath.startsWith('ungtilbake/')) backend = 'ungtilbake';
    }

    const symbols = match[1].split(',');
    for (let sym of symbols) {
      sym = sym.trim();
      if (!sym) continue;
      if (sym.startsWith('type ')) sym = sym.slice(5).trim();
      const asMatch = sym.match(/^(\S+)\s+as\s+/);
      const genName = asMatch ? asMatch[1] : sym.split(/\s/)[0];
      if (backend && genName) {
        existingMap.set(`${backend}:${genName}`, relPath);
      }
    }
  }
}

// Phase 2: Scan consuming files for generated imports
const consumerLines = execSync(
  `grep -rn "from '@k9-sak-web/backend/.*generated/types.js'" packages/ --include='*.ts' --include='*.tsx' | grep -v 'packages/v2/backend/'`,
  { cwd: ROOT, encoding: 'utf8' }
).trim().split('\n');

const needed = new Map(); // "backend:genName" → { aliases: Set, files: Set, isValue: boolean }

for (const line of consumerLines) {
  const fileMatch = line.match(/^([^:]+):\d+:/);
  const backendMatch = line.match(/@k9-sak-web\/backend\/(k9sak|ungsak|k9klage|k9tilbake|ungtilbake)\/generated/);
  if (!fileMatch || !backendMatch) continue;

  const file = fileMatch[1];
  const backend = backendMatch[1];
  const isTypeImport = /import\s+type\s+{/.test(line);

  const braceMatch = line.match(/\{([^}]+)\}/);
  if (!braceMatch) continue;

  const symbols = braceMatch[1].split(',');
  for (let sym of symbols) {
    sym = sym.trim();
    if (!sym) continue;
    const isTypeSpecific = sym.startsWith('type ');
    if (isTypeSpecific) sym = sym.slice(5).trim();

    let genName, alias;
    const asMatch = sym.match(/^(\S+)\s+as\s+(\S+)$/);
    if (asMatch) {
      genName = asMatch[1];
      alias = asMatch[2];
    } else {
      genName = sym.split(/\s/)[0];
      alias = genName;
    }

    const key = `${backend}:${genName}`;
    if (!needed.has(key)) {
      needed.set(key, { aliases: new Set(), files: new Set(), isValue: false });
    }
    const entry = needed.get(key);
    entry.aliases.add(alias);
    entry.files.add(file);
    if (!isTypeImport && !isTypeSpecific) {
      entry.isValue = true;
    }
  }
}

// Phase 3: Report
console.log('=== MAPPED (have re-export) ===');
let mapped = 0;
for (const [key, info] of needed) {
  if (existingMap.has(key)) {
    mapped++;
  }
}
console.log(`Count: ${mapped}`);

console.log('\n=== MISSING (need re-export) ===');
const missing = [];
for (const [key, info] of needed) {
  if (!existingMap.has(key)) {
    const [backend, genName] = key.split(':');
    missing.push({ backend, genName, aliases: [...info.aliases], fileCount: info.files.size, isValue: info.isValue });
  }
}

// Sort by backend then genName
missing.sort((a, b) => a.backend.localeCompare(b.backend) || a.genName.localeCompare(b.genName));

for (const m of missing) {
  const valueFlag = m.isValue ? ' [VALUE]' : '';
  console.log(`  ${m.backend}: ${m.genName}${valueFlag}`);
  console.log(`    aliases: ${m.aliases.join(', ')}`);
  console.log(`    files: ${m.fileCount}`);
}

console.log(`\nTotal unique symbols consumed: ${needed.size}`);
console.log(`Already mapped: ${mapped}`);
console.log(`Missing: ${missing.length}`);

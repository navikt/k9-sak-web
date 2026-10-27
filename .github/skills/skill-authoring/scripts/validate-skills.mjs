/**
 * Sjekker at skills og instruksjoner for kodeagenter henger sammen.
 *
 * Skills i .github/skills og instruksjoner i .github/instructions viser til hverandre og til kode i repoet.
 * Når en skill får nytt navn eller en fil flyttes, blir slike henvisninger lett stående igjen og peke til noe
 * som ikke finnes. Agenten finner da ikke regelen, eller følger en utdatert sti. Dette skriptet finner slike feil.
 *
 * Kjøres med `yarn skills:check` fra rotkatalogen. Skriptet avslutter med feilkode hvis noe er galt. Det kjøres ikke
 * i CI, så kjør det når du har endret skills eller instruksjoner.
 *
 * Hva som sjekkes:
 *
 * 1. Hver mappe i .github/skills har en SKILL.md med frontmatter der
 *    - `name` er lik mappenavnet (ellers blir skillen ikke funnet),
 *    - `name` bare har små bokstaver, tall og bindestrek, maks 64 tegn,
 *    - `description` finnes og er på maks 1024 tegn.
 *
 * 2. I alle markdown-filer under .github og packages/v2:
 *    - Henvisninger til skills finnes. Gjenkjente former er `navn` skill, `navn`-skill, (use navn)
 *      og stier som .github/skills/navn/.
 *    - Stier i backticks som starter med packages/ eller .github/ finnes. Stier med plassholdere
 *      som <backend> eller * blir hoppet over.
 *    - Relative markdown-lenker, som [tekst](../fil.md), peker til en fil som finnes. Ankre, nettadresser
 *      og lenker i kodeblokker blir hoppet over.
 *
 * Begrensninger:
 *
 * - Frontmatter leses med en enkel parser i stedet for et YAML-bibliotek, fordi repoet ikke har `yaml` som
 *   direkte avhengighet. Den støtter verdier på én linje (med eller uten anførselstegn) og flerlinjeverdier
 *   med `>-`, `>` eller `|`. Bruker du en annen YAML-skrivemåte, kan sjekken gi feil resultat.
 * - Skriptet sjekker at ting finnes, ikke at innholdet er riktig eller at regler ikke er duplisert.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';

const skillsDir = '.github/skills';
const markdownDirs = ['.github', 'packages/v2'];

const skillNames = readdirSync(skillsDir).filter(entry => statSync(join(skillsDir, entry)).isDirectory());
const markdownFiles = markdownDirs.flatMap(findMarkdownFiles);
const errors = [...skillNames.flatMap(checkSkillFrontmatter), ...markdownFiles.flatMap(checkReferences)];

if (errors.length > 0) {
  console.error(errors.join('\n'));
  console.error(
    `\n${errors.length} feil. Rett henvisningen til riktig navn eller sti, eller fjern den hvis det den viste til er slettet.` +
      '\nSe .github/skills/skill-authoring/SKILL.md for hvordan skills skal skrives.',
  );
  process.exit(1);
}
console.log(`${skillNames.length} skills og ${markdownFiles.length} markdown-filer er gyldige`);

/** Sjekk 1: frontmatter i SKILL.md. */
function checkSkillFrontmatter(dir) {
  const file = join(skillsDir, dir, 'SKILL.md');
  if (!existsSync(file)) return [`${join(skillsDir, dir)}: mangler SKILL.md`];

  const fields = readFrontmatter(readFileSync(file, 'utf8'));
  if (!fields) return [`${file}: mangler frontmatter mellom to linjer med ---`];

  const errors = [];
  if (fields.name !== dir) errors.push(`${file}: name "${fields.name}" er ikke lik mappenavnet "${dir}"`);
  if (!/^[a-z0-9-]{1,64}$/.test(fields.name ?? '')) {
    errors.push(`${file}: name "${fields.name}" kan bare ha små bokstaver, tall og bindestrek, maks 64 tegn`);
  }
  if (!fields.description) errors.push(`${file}: mangler description`);
  else if (fields.description.length > 1024) errors.push(`${file}: description er over 1024 tegn`);
  return errors;
}

/** Sjekk 2: henvisninger til skills, stier og lenker i én markdown-fil. */
function checkReferences(file) {
  const text = readFileSync(file, 'utf8');
  const errors = [];

  // `navn` skill, `navn`-skill, (use navn) eller .github/skills/navn/
  const skillReference =
    /`([a-z0-9-]+)`(?:-skill| skill)|\(use ([a-z0-9-]+)(?: skill)?\)|\.github\/skills\/([a-z0-9-]+)\//g;
  for (const match of text.matchAll(skillReference)) {
    const name = match[1] ?? match[2] ?? match[3];
    if (name && !skillNames.includes(name)) errors.push(`${file}: viser til skill som ikke finnes: ${name}`);
  }

  // `packages/...` eller `.github/...` i backticks, relativt til rotkatalogen
  for (const match of text.matchAll(/`((?:packages|\.github)\/[^`\s]+)`/g)) {
    const path = match[1].replace(/[.,:;]$/, '');
    if (/[<>*{}]/.test(path)) continue;
    if (!existsSync(path)) errors.push(`${file}: sti finnes ikke: ${path}`);
  }

  // [tekst](mål), relativt til filen. Kodeblokker fjernes først, siden de ofte inneholder eksempler.
  const textWithoutCodeBlocks = text.replace(/```[\s\S]*?```/g, '');
  for (const match of textWithoutCodeBlocks.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const target = decodeURI(match[1].split('#')[0]);
    if (target === '' || /^[a-z]+:/i.test(target)) continue;
    if (!existsSync(join(dirname(file), target))) {
      errors.push(`${file}: lenke peker til fil som ikke finnes: ${match[1]}`);
    }
  }

  return errors;
}

function findMarkdownFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap(entry => {
    if (entry === 'node_modules') return [];
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return findMarkdownFiles(path);
    return path.endsWith('.md') ? [path] : [];
  });
}

/** Leser feltene i frontmatter. Se begrensningene øverst i filen. */
function readFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const lines = match[1].split('\n');
  const fields = {};
  for (let i = 0; i < lines.length; i++) {
    const field = lines[i].match(/^([a-z-]+):\s*(.*)$/);
    if (!field) continue;
    const [, key, rawValue] = field;

    if (rawValue === '>-' || rawValue === '>' || rawValue === '|') {
      // Flerlinjeverdi: de innrykkede linjene under hører til feltet
      const block = [];
      while (i + 1 < lines.length && /^\s+/.test(lines[i + 1])) block.push(lines[++i].trim());
      fields[key] = block.join(' ');
    } else {
      fields[key] = rawValue.replace(/^'(.*)'$/, '$1').replace(/^"(.*)"$/, '$1');
    }
  }
  return fields;
}

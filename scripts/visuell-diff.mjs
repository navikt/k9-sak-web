// Sammenligner v1 og v2 visuelt fra en comparison story.
// Bruk: yarn visuell-diff <story-id> [--url http://127.0.0.1:9001] [--ut .tmp/visuell-diff]
// Krever at Storybook kjører (yarn storybook). Story må ha to elementer med aria-label "v1" og "v2".
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const args = process.argv.slice(2);
const flagg = (navn, standard) => {
  const i = args.indexOf(navn);
  return i >= 0 ? args[i + 1] : standard;
};
const storyId = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
if (!storyId) {
  console.error('Mangler story-id, f.eks. behandling-pleiepenger-sluttfase-fakta-omp...--v-1-og-v-2-side-om-side');
  process.exit(2);
}
const url = flagg('--url', 'http://127.0.0.1:9001');
const utMappe = flagg('--ut', '.tmp/visuell-diff');
await mkdir(utMappe, { recursive: true });

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto(`${url}/iframe.html?id=${storyId}&viewMode=story`);
  const v1Loc = page.locator('[aria-label="v1"]');
  const v2Loc = page.locator('[aria-label="v2"]');
  await v1Loc.waitFor({ timeout: 30_000 });
  await v2Loc.waitFor({ timeout: 30_000 });
  await page.waitForLoadState('networkidle');

  const v1 = PNG.sync.read(await v1Loc.screenshot());
  const v2 = PNG.sync.read(await v2Loc.screenshot());
  await writeFile(join(utMappe, 'v1.png'), PNG.sync.write(v1));
  await writeFile(join(utMappe, 'v2.png'), PNG.sync.write(v2));

  // Ulik høyde er i seg selv et avvik, så begge polstres til felles størrelse
  const bredde = Math.max(v1.width, v2.width);
  const hoyde = Math.max(v1.height, v2.height);
  const polstre = img => {
    const ut = new PNG({ width: bredde, height: hoyde });
    PNG.bitblt(img, ut, 0, 0, img.width, img.height, 0, 0);
    return ut;
  };
  const a = polstre(v1);
  const b = polstre(v2);
  const diff = new PNG({ width: bredde, height: hoyde });
  const antallAvvik = pixelmatch(a.data, b.data, diff.data, bredde, hoyde, { threshold: 0.1 });
  await writeFile(join(utMappe, 'diff.png'), PNG.sync.write(diff));

  const prosent = ((antallAvvik / (bredde * hoyde)) * 100).toFixed(2);
  console.log(`v1: ${v1.width}x${v1.height}, v2: ${v2.width}x${v2.height}`);
  console.log(`Avvikende piksler: ${antallAvvik} av ${bredde * hoyde} (${prosent} %)`);
  console.log(`Bilder lagret i ${utMappe}/ (v1.png, v2.png, diff.png)`);
} finally {
  await browser.close();
}

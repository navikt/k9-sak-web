import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext, waitForPageReady } from '@storybook/test-runner';
import fs from 'node:fs';
import path from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const SNAPSHOTS_DIR = path.join(process.cwd(), '__visual_snapshots__');
const DIFF_DIR = path.join(SNAPSHOTS_DIR, '__diff_output__');
const FAILURE_THRESHOLD = 0.005; // 0.5% av piksler

const config: TestRunnerConfig = {
  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);

    // Hopp over visuell test om story er opt-out via tags eller parameters
    if (
      storyContext.tags?.includes('no-visual-test') ||
      storyContext.parameters?.visualTest?.disable === true
    ) {
      return;
    }

    await waitForPageReady(page);
    await page.waitForLoadState('networkidle');

    // Deaktiver CSS-animasjoner og transitions for determinisme
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `,
    });

    await page.waitForTimeout(100);

    const screenshot = await page.locator('#storybook-root').screenshot();
    const snapshotPath = path.join(SNAPSHOTS_DIR, `${context.id}-snap.png`);

    const updateBaselines = process.env.VISUAL_UPDATE === 'true';

    if (!fs.existsSync(snapshotPath)) {
      if (process.env.CI && !updateBaselines) {
        throw new Error(
          `Ingen baseline funnet for story "${context.id}". Oppdater baselines via den faktiske flyten for repoet, for eksempel med commit-taggen "[update-baselines]".`,
        );
      }
      fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
      fs.writeFileSync(snapshotPath, screenshot);
      return;
    }

    if (updateBaselines) {
      fs.writeFileSync(snapshotPath, screenshot);
      return;
    }

    const baseline = PNG.sync.read(fs.readFileSync(snapshotPath));
    const current = PNG.sync.read(screenshot);

    if (baseline.width !== current.width || baseline.height !== current.height) {
      throw new Error(
        `Størrelse endret for story "${context.id}": baseline ${baseline.width}x${baseline.height}, nå ${current.width}x${current.height}`,
      );
    }

    const diff = new PNG({ width: baseline.width, height: baseline.height });
    const numDiffPixels = pixelmatch(baseline.data, current.data, diff.data, baseline.width, baseline.height, {
      threshold: 0.1,
    });

    const diffPercent = numDiffPixels / (baseline.width * baseline.height);

    if (diffPercent > FAILURE_THRESHOLD) {
      fs.mkdirSync(DIFF_DIR, { recursive: true });
      const diffPath = path.join(DIFF_DIR, `${context.id}-diff.png`);
      fs.writeFileSync(diffPath, PNG.sync.write(diff));
      throw new Error(
        `Visuell diff for story "${context.id}": ${(diffPercent * 100).toFixed(2)}% piksler endret (maks ${FAILURE_THRESHOLD * 100}%). Diff-bilde: ${diffPath}`,
      );
    }
  },
};

export default config;

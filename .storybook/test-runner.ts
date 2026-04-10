import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext, waitForPageReady } from '@storybook/test-runner';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },

  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);

    // Hopp over visuell test om story er opt-out via tags eller parameters
    if (storyContext.tags?.includes('no-visual-test') || storyContext.parameters?.visualTest?.disable === true) {
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

    const storyRoot = page.locator('#storybook-root');
    const screenshot = await storyRoot.screenshot();

    expect(screenshot).toMatchImageSnapshot({
      customSnapshotsDir: `${process.cwd()}/__visual_snapshots__`,
      customSnapshotIdentifier: context.id,
      failureThreshold: 0.005,
      failureThresholdType: 'percent',
    });
  },
};

export default config;

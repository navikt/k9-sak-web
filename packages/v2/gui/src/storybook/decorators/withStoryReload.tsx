import type { Decorator } from '@storybook/react';
import { useEffect } from 'react';
import { BehandlingProvider } from '../../context/BehandlingContext';

/**
 *
 * Reloads the current URL before showing the story.
 * If you use MSW and edit the mock data in the story this decorator will reset those changes when you navigate out of the story.
 *
 */

const withStoryReload = (): Decorator => Story => {
  useEffect(() => () => window.location.reload(), []);
  return (
    <BehandlingProvider refetchBehandling={() => Promise.resolve()}>
      <Story />
    </BehandlingProvider>
  );
};

export default withStoryReload;

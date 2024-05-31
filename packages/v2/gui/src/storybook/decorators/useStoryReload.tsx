import type { Decorator } from '@storybook/react';
import React, { useEffect } from 'react';

/**
 *
 * Reloads the current URL before showing the story.
 * If you use MSW and edit the mock data in the story this decorator will reset those changes when you navigate out of the story.
 *
 * @returns Story component
 */

const useStoryReload = (): Decorator => Story => {
  useEffect(() => () => window.location.reload(), []);
  return <Story />;
};

export default useStoryReload;

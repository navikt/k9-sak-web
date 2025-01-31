import type { Decorator } from '@storybook/react';
import type { FeatureToggles } from '@k9-sak-web/lib/types/FeatureTogglesType.js';
import { useContext } from 'react';
import FeatureTogglesContext from '../../utils/featureToggles/FeatureTogglesContext.js';

const withFeatureToggles =
  (featureToggles: FeatureToggles): Decorator =>
  Story => {
    const existingFeatureToggles = useContext(FeatureTogglesContext);
    const merged: FeatureToggles = {
      ...existingFeatureToggles,
      ...featureToggles,
    };
    return (
      <FeatureTogglesContext.Provider value={merged}>
        <Story />
      </FeatureTogglesContext.Provider>
    );
  };

export default withFeatureToggles;

import type { FeatureToggles } from '@k9-sak-web/gui/featuretoggles/FeatureToggles.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import type { Decorator } from '@storybook/react';
import { useContext } from 'react';

const withFeatureToggles =
  (featureToggles: Partial<FeatureToggles>): Decorator =>
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

import React from 'react';
import type { FeatureToggles } from './FeatureToggles.js';
import { prodFeatureToggles } from './prodFeatureToggles.js';

const FeatureTogglesContext = React.createContext<FeatureToggles>(prodFeatureToggles);
export default FeatureTogglesContext;

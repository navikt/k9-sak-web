import type { FeatureToggles } from '@k9-sak-web/lib/types/FeatureTogglesType.js';
import React from 'react';

const FeatureTogglesContext = React.createContext<FeatureToggles>({});
export default FeatureTogglesContext;

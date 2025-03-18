import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { devFeatureToggles } from './devFeatureToggles.js';
import { qFeatureToggles } from './qFeatureToggles.js';
import { prodFeatureToggles } from './prodFeatureToggles.js';
import type { FeatureToggles } from './FeatureToggles.js';

export const useFeatureToggles = (): { featureToggles: FeatureToggles | undefined } => {
  const backendUrl = window.location.pathname.includes('/ung/web') ? 'ung' : 'k9';
  const { data } = useQuery({
    queryKey: ['featureToggles', backendUrl],
    queryFn: ({ signal }) =>
      axios.get(`/${backendUrl}/feature-toggle/toggles.json`, { signal }).then(({ data }) => data),
  });

  const featureTogglesEnv = data['FEATURE_TOGGLES_ENV'];
  if (featureTogglesEnv === 'k9-sak-dev') {
    return { featureToggles: devFeatureToggles };
  } else if (featureTogglesEnv === 'k9-sak-q') {
    return { featureToggles: qFeatureToggles };
  } else if (featureTogglesEnv === 'k9-sak-prod') {
    return { featureToggles: prodFeatureToggles };
  } else {
    return { featureToggles: undefined };
  }
};

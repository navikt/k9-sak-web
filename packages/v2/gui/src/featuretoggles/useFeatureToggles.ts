import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { devFeatureToggles } from './devFeatureToggles.js';
import type { FeatureToggles } from './FeatureToggles.js';
import { prodFeatureToggles } from './prodFeatureToggles.js';
import { qFeatureToggles } from './qFeatureToggles.js';
import { devFeatureToggles as ungDevFeatureToggles } from './ung/devFeatureToggles.js';
import { prodFeatureToggles as ungProdFeatureToggles } from './ung/prodFeatureToggles.js';
import { qFeatureToggles as ungQFeatureToggles } from './ung/qFeatureToggles.js';

// feature-toggles/toggles.json returnerer array av {key: string, value: string} objekter
const getKeyValueFromArray = (data: any, dataKey: string): string | undefined => {
  if (data instanceof Array) {
    for (const { key, value } of data) {
      if (key === dataKey) {
        return value;
      }
    }
  }
  return undefined;
};

export const useFeatureToggles = (): { featureToggles: FeatureToggles | undefined } => {
  const backendUrl = window.location.pathname.includes('/ung/web') ? 'ung' : 'k9';
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['featureToggles', backendUrl],
    queryFn: ({ signal }) =>
      axios.get(`/${backendUrl}/feature-toggle/toggles.json`, { signal }).then(({ data }) => data),
  });

  // While fetch is pending, return undefined
  if (isPending) {
    return { featureToggles: undefined };
  }
  const featureTogglesEnv = getKeyValueFromArray(data, 'FEATURE_TOGGLES_ENV');
  if (featureTogglesEnv === 'k9-sak-dev') {
    return { featureToggles: devFeatureToggles };
  } else if (featureTogglesEnv === 'k9-sak-q') {
    return { featureToggles: qFeatureToggles };
  } else if (featureTogglesEnv === 'k9-sak-prod') {
    return { featureToggles: prodFeatureToggles };
  } else if (featureTogglesEnv === 'ung-sak-dev') {
    return { featureToggles: ungDevFeatureToggles };
  } else if (featureTogglesEnv === 'ung-sak-q') {
    return { featureToggles: ungQFeatureToggles };
  } else if (featureTogglesEnv === 'ung-sak-prod') {
    return { featureToggles: ungProdFeatureToggles };
  } else {
    // If feature toggles are not resolved, log it, and return prodFeatureToggles as default
    if (isError) {
      console.error(
        `fetch of feature-toggle/toggles.json failed. Will continue with k9-sak-prod feature toggles. (${error.message})`,
        error,
      );
    } else {
      console.error(
        `fetch of feature-toggle/toggles.json succeeded, but did not resolve FEATURE_TOGGLES_ENV. Will continue with k9-sak-prod feature toggles. Returned data was:`,
        data,
      );
    }
    return { featureToggles: prodFeatureToggles };
  }
};

import { type FeatureToggles } from '@k9-sak-web/lib/types/FeatureTogglesType.js';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { isUngWeb } from '../urlUtils';

type FeatureToggle = {
  key: string;
  value: string;
};

const transformData = (data: FeatureToggle[]): FeatureToggles =>
  data?.reduce((acc: { [x: string]: boolean }, curr: FeatureToggle) => {
    acc[curr.key] = `${curr.value}`.toLowerCase() === 'true';
    return acc;
  }, {});

export const useFeatureToggles = (): { featureToggles: FeatureToggles | undefined } => {
  const backendUrl = isUngWeb() ? 'ung' : 'k9';
  const { data: featureToggles } = useQuery({
    queryKey: ['featureToggles', backendUrl],
    queryFn: ({ signal }) =>
      axios.get(`/${backendUrl}/feature-toggle/toggles.json`, { signal }).then(({ data }) => data),
    select: transformData,
  });

  return { featureToggles };
};

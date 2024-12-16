import { type FeatureToggles } from '@k9-sak-web/lib/types/FeatureTogglesType.js';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';

type FeatureToggle = {
  key: string;
  value: string;
};

export const useFeatureToggles = (): [FeatureToggles] => {
  const { data: featureTogglesData } = useQuery({
    queryKey: ['featureToggles'],
    queryFn: ({ signal }) => axios.get('/k9/feature-toggle/toggles.json', { signal }).then(({ data }) => data),
    refetchOnWindowFocus: false,
  });

  const featureToggles: FeatureToggles = useMemo<FeatureToggles>(
    () =>
      featureTogglesData?.reduce((acc: { [x: string]: boolean }, curr: FeatureToggle) => {
        acc[curr.key] = `${curr.value}`.toLowerCase() === 'true';
        return acc;
      }, {}),
    [featureTogglesData],
  );

  return [featureToggles ?? {}];
};

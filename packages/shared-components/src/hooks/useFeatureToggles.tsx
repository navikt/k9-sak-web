import { useMemo } from 'react';
import { K9sakApiKeys, restApiHooks } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import FeatureToggles from '@k9-sak-web/types/src/featureTogglesTsType';

const useFeatureToggles = (): [FeatureToggles] => {
  const featureTogglesData = restApiHooks.useGlobalStateRestApiData<{ key: string; value: string }[]>(
    K9sakApiKeys.FEATURE_TOGGLE,
  );

  const featureToggles: FeatureToggles = useMemo<FeatureToggles>(
    () =>
      featureTogglesData?.reduce((acc, curr) => {
        acc[curr.key] = `${curr.value}`.toLowerCase() === 'true';
        return acc;
      }, {}),
    [featureTogglesData],
  );

  return [featureToggles];
};

export default useFeatureToggles;

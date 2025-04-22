import ApplicationContextPath from '@k9-sak-web/sak-app/src/app/ApplicationContextPath';

const useGetEnabledApplikasjonContext = (): ApplicationContextPath[] => {
  const enabledApplicationContexts = [ApplicationContextPath.K9SAK, ApplicationContextPath.UNGSAK];

  return enabledApplicationContexts;
};

export default useGetEnabledApplikasjonContext;

import { useRouteMatch as useRouteMatchOrig } from 'react-router-dom';

// TODO Dette er kun ein wrapper for å kunne mocka useLocation. Fjern når ein finn bedre måte

const useRouteMatch = () => {
  const routeMatch = useRouteMatchOrig();
  return routeMatch;
};

export default useRouteMatch;

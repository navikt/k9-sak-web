import { Location } from 'history';
import { Params, useLocation, useParams } from 'react-router-dom';

import { parseQueryString } from '@k9-sak-web/utils';

const defaultConfig = {
  paramName: '',
  parse: a => a,
  isQueryParam: false,
};

interface Config {
  paramName?: string;
  parse?: (a: any) => any;
  isQueryParam?: boolean;
}

const mapMatchToParam = (params: Params, location: Location, trackingConfig: Config) => {
  const newParams = trackingConfig.isQueryParam ? parseQueryString(location.search) : params;
  return trackingConfig.parse(newParams[trackingConfig.paramName]);
};

function useTrackRouteParam<T>(config: Config): { location: Location; selected: T } {
  const trackingConfig = { ...defaultConfig, ...config };

  const location = useLocation();
  const params = useParams();

  const paramFromUrl = mapMatchToParam(params, location, trackingConfig);
  return {
    location,
    selected: paramFromUrl,
  };
}

export default useTrackRouteParam;

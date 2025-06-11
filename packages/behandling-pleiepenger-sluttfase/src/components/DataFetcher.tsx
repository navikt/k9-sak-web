import axios from 'axios';
import React from 'react';
import { addLegacySerializerOption } from '@k9-sak-web/gui/utils/axios/axiosUtils.js';

interface DataFetcherProps {
  url: string;
  contentRenderer: (data: any, isLoading: boolean, hasError: boolean) => React.ReactNode;
}

const DataFetcher = ({ url, contentRenderer }: DataFetcherProps) => {
  const [fetchedData, setFetchedData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  const httpCanceler = React.useMemo(() => axios.CancelToken.source(), [url]);

  React.useEffect(() => {
    let isMounted = true;
    axios
      .get(
        url,
        addLegacySerializerOption({
          cancelToken: httpCanceler.token,
        }),
      )
      .then(
        response => {
          if (isMounted) {
            setFetchedData(response.data);
            setIsLoading(false);
          }
        },
        () => {
          if (isMounted) {
            setHasError(true);
            setIsLoading(false);
          }
        },
      );

    return () => {
      isMounted = false;
      httpCanceler.cancel();
    };
  }, []);

  return <>{contentRenderer(fetchedData, isLoading, hasError)}</>;
};

export default DataFetcher;

import axios from 'axios';
import React from 'react';

interface DataFetcherProps {
  url: string;
  contentRenderer: (data: any, isLoading: boolean, hasError: boolean) => React.ReactNode;
}

const DataFetcher = ({ url, contentRenderer }: DataFetcherProps) => {
  const [fetchedData, setFetchedData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    axios.get(url).then(
      response => {
        setFetchedData(response.data);
        setIsLoading(false);
      },
      () => {
        setHasError(true);
        setIsLoading(false);
      },
    );
  }, []);

  return <>{contentRenderer(fetchedData, isLoading, hasError)}</>;
};

export default DataFetcher;

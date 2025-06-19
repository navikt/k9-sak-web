import { addLegacySerializerOption } from '@k9-sak-web/gui/utils/axios/axiosUtils.js';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';

interface DataFetcherProps {
  url: string;
  contentRenderer: (data: any, isLoading: boolean, hasError: boolean) => React.ReactNode;
}

const DataFetcher = ({ url, contentRenderer }: DataFetcherProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dataFetcher', url],
    queryFn: async ({ signal }) => {
      const response = await axios.get(url, {
        ...addLegacySerializerOption(),
        signal,
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
    retry: 3,
  });

  return <>{contentRenderer(data, isLoading, isError)}</>;
};

export default DataFetcher;

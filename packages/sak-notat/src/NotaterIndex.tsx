import { NavAnsatt } from '@k9-sak-web/types';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Notater from './Notater';

const queryClient = new QueryClient();

interface NotatIndexProps {
  fagsakId: string;
  navAnsatt: NavAnsatt;
}

const NotaterIndex: React.FunctionComponent<NotatIndexProps> = ({ fagsakId, navAnsatt }) => (
  <QueryClientProvider client={queryClient}>
    <Notater fagsakId={fagsakId} navAnsatt={navAnsatt} />
  </QueryClientProvider>
);

export default NotaterIndex;

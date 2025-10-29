import React from 'react';

import DataFetchPendingModal from './DataFetchPendingModal';

export default {
  title: 'sharedComponents/DataFetchPendingModal',
  component: DataFetchPendingModal,
};

export const visModalForVisningAvPågåandeRestkall = () => (
  <div style={{ width: '200px' }}>
    <DataFetchPendingModal pendingMessage="Henting av data pågår" /></div>
);

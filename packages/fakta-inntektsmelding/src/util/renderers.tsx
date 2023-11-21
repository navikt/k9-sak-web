import React from 'react';
import { createRoot } from 'react-dom/client';
import MainComponent from '../ui/MainComponent';
import ContainerContract from '../types/ContainerContract';

function prepare() {
  if (process.env.NODE_ENV !== 'production') {
    return import('../mock/browser').then(({ worker }) => worker.start({ onUnhandledRequest: 'bypass' }));
  }

  return Promise.resolve();
}

const renderAppInSuccessfulState = (appId: string, data: ContainerContract): void => {
  prepare().then(() => {
    const container = document.getElementById(appId);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const root = createRoot(container!);
    root.render(<MainComponent data={data} />);
  });
};
export default {
  renderAppInSuccessfulState,
};

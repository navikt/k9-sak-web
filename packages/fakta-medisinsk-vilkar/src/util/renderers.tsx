import React from 'react';
import { render } from 'react-dom';
import MainComponent from '../ui/MainComponent';
import ContainerContract from '../types/ContainerContract';

function prepare() {
    if (process.env.NODE_ENV !== 'production') {
        return import('../mocks/browser').then(({ worker }) => worker.start({ onUnhandledRequest: 'bypass' }));
    }

    return Promise.resolve();
}

const renderAppInSuccessfulState = (appId: string, data: ContainerContract): Promise<void> =>
    prepare().then(() => {
        render(<MainComponent containerData={data} />, document.getElementById(appId));
    });

export default {
    renderAppInSuccessfulState,
};

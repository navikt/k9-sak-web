import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import configureStore from '@fpsak-frontend/sak-app/src/configureStore';

const history = createBrowserHistory({
  basename: '/k9/web/',
});

const withReduxAndRouterProvider = Story => {
  const store = configureStore(history);

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Story />
      </ConnectedRouter>
    </Provider>
  );
};

export default withReduxAndRouterProvider;

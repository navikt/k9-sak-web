import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import configureStore from '@k9-sak-web/sak-app/src/configureStore';

const history = createBrowserHistory({
  basename: '/k9/web/',
});

const withReduxAndRouterProvider = Story => {
  const store = configureStore();

  return (
    <Provider store={store}>
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    </Provider>
  );
};

export default withReduxAndRouterProvider;

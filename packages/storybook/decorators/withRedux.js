import React from 'react';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';

import configureStore from '@fpsak-frontend/sak-app/src/configureStore';

const history = createBrowserHistory({
  basename: '/k9/web/',
});

const withReduxProvider = story => {
  const store = configureStore(history);
  return <Provider store={store}>{story()}</Provider>;
};

export default withReduxProvider;

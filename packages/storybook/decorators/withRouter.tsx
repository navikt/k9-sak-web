import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory({
  basename: '/k9/web/',
});

const withRouterProvider = Story => (
  <Router history={history}>
    <Story />
  </Router>
);

export default withRouterProvider;

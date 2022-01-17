import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory({
  basename: '/k9/web/',
});

const withRouterProvider = Story => (
  <MemoryRouter>
    <Story />
  </MemoryRouter>
);

export default withRouterProvider;

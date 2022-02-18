import React from 'react';
import { MemoryRouter } from 'react-router-dom';

const withRouterProvider = Story => (
  <MemoryRouter>
    <Story />
  </MemoryRouter>
);

export default withRouterProvider;

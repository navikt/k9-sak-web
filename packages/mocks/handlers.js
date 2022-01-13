/* eslint-disable import/no-mutable-exports */
import { testHandlers } from './testHandlers';

// eslint-disable-next-line import/prefer-default-export
let handlers = [];

if (process.env.MSW_MODE === 'test') {
  handlers = handlers.concat(Object.values(testHandlers));
}

export default handlers;

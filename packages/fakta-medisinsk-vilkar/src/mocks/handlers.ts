/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-mutable-exports */

import { testHandlers } from './testHandlers';

let handlers = [];

if (process.env.MSW_MODE === 'test') {
    handlers = handlers.concat(Object.values(testHandlers));
}

export { handlers };

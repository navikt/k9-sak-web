/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import { setupWorker } from 'msw/browser';
import { handlers } from '../../mock/api-mock';

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers);

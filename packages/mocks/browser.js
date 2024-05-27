import { setupWorker } from "msw/browser";
import handlers from './handlers';

// eslint-disable-next-line import/prefer-default-export
export const worker = setupWorker(...handlers)
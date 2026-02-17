import { client } from './generated/client.js';
import { createPollingClient } from '../shared/polling/createPollingClient.js';

export const pollingClient = createPollingClient(client);

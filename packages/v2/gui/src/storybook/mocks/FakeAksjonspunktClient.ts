import { fn } from 'storybook/test';
import type { BekreftAksjonspunktClient } from '../../shared/hooks/useBekreftAksjonspunkt.js';

export const bekreftFn = fn();

export const fakeAksjonspunktClient = {
  bekreft: async (...args: Parameters<BekreftAksjonspunktClient['bekreft']>) => {
    bekreftFn(...args);
    return { response: new Response(null, { status: 200 }) };
  },
  poll: async (): Promise<{ data: undefined; response: Response }> => ({
    data: undefined,
    response: new Response(null, { status: 200 }),
  }),
} satisfies BekreftAksjonspunktClient;

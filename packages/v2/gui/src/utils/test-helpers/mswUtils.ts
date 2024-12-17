import '@testing-library/jest-dom/vitest';
import { setupServer } from 'msw/node';

/**
 * For mocking av endepunkter i backend
 * 
 * @example
 * it('en test som skal bruke msw', () => {
 * server.use(
      http.get('/k9/feature-toggle/toggles.json', () => {
        return HttpResponse.json([{ key: 'LOS_MARKER_BEHANDLING_SUBMIT', value: 'true' }]);
      }),
    );
    ...
    })
 */
export const server = setupServer();
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

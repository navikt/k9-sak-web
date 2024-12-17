import '@testing-library/jest-dom/vitest';
import { setupServer } from 'msw/node';

export const server = setupServer();
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

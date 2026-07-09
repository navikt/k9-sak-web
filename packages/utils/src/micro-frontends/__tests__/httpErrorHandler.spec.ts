import EventType from '@k9-sak-web/rest-api/src/requestApi/eventType';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { httpErrorHandler } from '../httpErrorHandler';

describe('httpErrorHandler', () => {
  const mockErrorDispatcher = vi.fn();

  // Store original window.location
  const originalLocation = window.location;

  beforeEach(() => {
    // Reset mock before each test
    mockErrorDispatcher.mockClear();

    // Mock window.location with proper typing
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/test/path',
        search: '?param=value',
        href: '',
      },
      writable: true,
    });
  });

  afterEach(() => {
    // Restore original location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  describe('403 Forbidden status', () => {
    it('should dispatch REQUEST_FORBIDDEN event for status 403', () => {
      httpErrorHandler(403, mockErrorDispatcher);

      expect(mockErrorDispatcher).toHaveBeenCalledTimes(1);
      expect(mockErrorDispatcher).toHaveBeenCalledWith({
        type: EventType.REQUEST_FORBIDDEN,
      });
    });

    it('should dispatch REQUEST_FORBIDDEN even when locationHeader is provided', () => {
      httpErrorHandler(403, mockErrorDispatcher, 'https://nav.no');

      expect(mockErrorDispatcher).toHaveBeenCalledTimes(1);
      expect(mockErrorDispatcher).toHaveBeenCalledWith({
        type: EventType.REQUEST_FORBIDDEN,
      });
      // Should not redirect for 403
      expect(window.location.href).toBe('');
    });
  });

  describe('401 Unauthorized status', () => {
    describe('with locationHeader', () => {
      it('should redirect to locationHeader with current path as redirectTo parameter', () => {
        const locationHeader = 'https://nav.no';

        httpErrorHandler(401, mockErrorDispatcher, locationHeader);

        const expectedRedirectUrl = `${locationHeader}?redirectTo=${encodeURIComponent('/test/path?param=value')}`;
        expect(window.location.href).toBe(expectedRedirectUrl);
        expect(mockErrorDispatcher).not.toHaveBeenCalled();
      });

      it('should handle locationHeader that already contains query parameters', () => {
        const locationHeader = 'https://nav.no?existing=param';

        httpErrorHandler(401, mockErrorDispatcher, locationHeader);

        const expectedRedirectUrl = `${locationHeader}&redirectTo=${encodeURIComponent('/test/path?param=value')}`;
        expect(window.location.href).toBe(expectedRedirectUrl);
        expect(mockErrorDispatcher).not.toHaveBeenCalled();
      });

      it('should properly encode complex current paths', () => {
        // Set up complex path with special characters
        Object.defineProperty(window, 'location', {
          value: {
            pathname: '/test/path with spaces/åæø',
            search: '?param=value&other=test with spaces',
            href: '',
          },
          writable: true,
        });

        const locationHeader = 'https://nav.no';

        httpErrorHandler(401, mockErrorDispatcher, locationHeader);

        const currentPath = '/test/path with spaces/åæø?param=value&other=test with spaces';
        const expectedRedirectUrl = `${locationHeader}?redirectTo=${encodeURIComponent(currentPath)}`;
        expect(window.location.href).toBe(expectedRedirectUrl);
      });

      it('should handle empty search parameters', () => {
        Object.defineProperty(window, 'location', {
          value: {
            pathname: '/simple/path',
            search: '',
            href: '',
          },
          writable: true,
        });

        const locationHeader = 'https://nav.no';

        httpErrorHandler(401, mockErrorDispatcher, locationHeader);

        const expectedRedirectUrl = `${locationHeader}?redirectTo=${encodeURIComponent('/simple/path')}`;
        expect(window.location.href).toBe(expectedRedirectUrl);
      });

      it('should handle root path', () => {
        Object.defineProperty(window, 'location', {
          value: {
            pathname: '/',
            search: '',
            href: '',
          },
          writable: true,
        });

        const locationHeader = 'https://nav.no';

        httpErrorHandler(401, mockErrorDispatcher, locationHeader);

        const expectedRedirectUrl = `${locationHeader}?redirectTo=${encodeURIComponent('/')}`;
        expect(window.location.href).toBe(expectedRedirectUrl);
      });
    });

    describe('without locationHeader', () => {
      it('should dispatch REQUEST_UNAUTHORIZED event when no locationHeader provided', () => {
        httpErrorHandler(401, mockErrorDispatcher);

        expect(mockErrorDispatcher).toHaveBeenCalledTimes(1);
        expect(mockErrorDispatcher).toHaveBeenCalledWith({
          type: EventType.REQUEST_UNAUTHORIZED,
        });
        expect(window.location.href).toBe('');
      });
    });
  });

  describe('edge cases and boundary conditions', () => {
    it('should handle complex locationHeader URLs', () => {
      const locationHeader = 'https://subdomain.example.com:8080/auth/login?service=k9&lang=nb';

      httpErrorHandler(401, mockErrorDispatcher, locationHeader);

      const currentPath = encodeURIComponent('/test/path?param=value');
      const expectedRedirectUrl = `${locationHeader}&redirectTo=${currentPath}`;
      expect(window.location.href).toBe(expectedRedirectUrl);
    });

    it('should handle locationHeader with fragment', () => {
      const locationHeader = 'https://nav.no/auth#section';

      httpErrorHandler(401, mockErrorDispatcher, locationHeader);

      const currentPath = encodeURIComponent('/test/path?param=value');
      const expectedRedirectUrl = `${locationHeader}?redirectTo=${currentPath}`;
      expect(window.location.href).toBe(expectedRedirectUrl);
    });
  });
});

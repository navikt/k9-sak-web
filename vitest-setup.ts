import { switchOnTestMode } from '@k9-sak-web/rest-api';
import '@testing-library/jest-dom/vitest';
import { expect } from 'vitest';
import 'vitest-axe/extend-expect';
import * as matchers from 'vitest-axe/matchers';

expect.extend(matchers);

// Provide a minimal window stub for node environment so code referencing window.location works without branching in production code.
const hasDom = typeof window !== 'undefined' && typeof window.location !== 'undefined';
if (!hasDom) {
  // Minimal stub; tests can mutate window.location.host/pathname as needed.
  // Minimal subset of Location properties used in tests
  const locationStub = {
    host: 'localhost',
    pathname: '/k9/web',
    assign: vi.fn(),
    reload: vi.fn(),
  };
  type Listener = EventListener | { handleEvent: (evt: Event) => void };
  const listeners: Record<string, Listener[]> = {};
  const addEventListener = (type: string, cb: EventListenerOrEventListenerObject) => {
    listeners[type] = listeners[type] || [];
    listeners[type].push(cb as Listener);
  };
  const removeEventListener = (type: string, cb: EventListenerOrEventListenerObject) => {
    listeners[type] = (listeners[type] || []).filter(fn => fn !== cb);
  };
  const dispatchEvent = (evt: Event) => {
    (listeners[evt.type] || []).forEach(fn => {
      if (typeof fn === 'function') {
        (fn as EventListener)(evt);
      } else if (fn && typeof fn.handleEvent === 'function') {
        fn.handleEvent(evt);
      }
    });
    return true;
  };
  const fullLocation: Location = {
    ...locationStub,
    hash: '',
    host: locationStub.host,
    hostname: locationStub.host,
    href: `http://${locationStub.host}${locationStub.pathname}`,
    origin: `http://${locationStub.host}`,
    port: '',
    protocol: 'http:',
    search: '',
    ancestorOrigins: {} as any,
    toString: () => `http://${locationStub.host}${locationStub.pathname}`,
    replace: vi.fn(),
  } as Location;
  // @ts-expect-error satisfying minimal window typing for tests
  globalThis.window = {
    location: fullLocation,
    addEventListener,
    removeEventListener,
    dispatchEvent,
    open: vi.fn(),
  };
}

if (typeof window !== 'undefined' && typeof window.URL !== 'undefined') {
  vi.spyOn(window.URL, 'createObjectURL').mockImplementation(() => 'http://fake.url');
  if (!window.scroll) {
    window.scroll = () => {};
  }
  if (!window.scrollTo) {
    window.scrollTo = () => {};
  }
} else {
  // Node environment: Keep native URL constructor; only attach a createObjectURL shim if missing.
  if (typeof URL !== 'undefined' && !('createObjectURL' in URL)) {
    // @ts-expect-error augmenting global URL for tests
    URL.createObjectURL = () => 'http://fake.url';
  }
}

// open is sometimes used; safe to stub globally (will exist in happy-dom, define in node)
if (typeof open === 'undefined') {
  vi.stubGlobal('open', vi.fn());
}

switchOnTestMode();

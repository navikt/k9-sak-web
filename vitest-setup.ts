import { switchOnTestMode } from '@k9-sak-web/rest-api';
import '@testing-library/jest-dom/vitest';
import { expect, vi } from 'vitest';
import 'vitest-axe/extend-expect';
import * as matchers from 'vitest-axe/matchers';

expect.extend(matchers);

vi.spyOn(window.URL, 'createObjectURL').mockImplementation(() => 'http://fake.url');
vi.stubGlobal('open', vi.fn());

// happy-dom compatibility: Polyfill missing window methods
// happy-dom has a lighter implementation than jsdom and may not include all window methods
if (!window.scroll) {
  window.scroll = () => {};
}
if (!window.scrollTo) {
  window.scrollTo = () => {};
}

if (!globalThis.crypto) {
  globalThis.crypto = {} as Crypto;
}

if (!globalThis.crypto.randomUUID) {
  globalThis.crypto.randomUUID = () => {
    // Enkel UUID v4 implementasjon
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }) as `${string}-${string}-${string}-${string}-${string}`;
  };
}

switchOnTestMode();

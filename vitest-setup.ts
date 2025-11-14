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

switchOnTestMode();

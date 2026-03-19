import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

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

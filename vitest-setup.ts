import { switchOnTestMode } from '@k9-sak-web/rest-api';
import '@testing-library/jest-dom/vitest';
import { expect } from 'vitest';
import 'vitest-axe/extend-expect';
import * as matchers from 'vitest-axe/matchers';

expect.extend(matchers);

// vi.spyOn(window.URL, 'createObjectURL').mockImplementation(() => 'http://fake.url');
vi.stubGlobal('open', vi.fn());

switchOnTestMode();

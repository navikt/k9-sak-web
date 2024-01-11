import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import '@testing-library/jest-dom/vitest';
import { switchOnTestMode } from '@k9-sak-web/rest-api';
import 'vitest-axe/extend-expect';
import { expect } from 'vitest';
import * as matchers from 'vitest-axe/matchers';

expect.extend(matchers);

// vi.spyOn(window.URL, 'createObjectURL').mockImplementation(() => 'http://fake.url');
vi.stubGlobal('open', vi.fn());

switchOnTestMode();

Enzyme.configure({ adapter: new Adapter() });

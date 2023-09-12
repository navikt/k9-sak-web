import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import '@testing-library/jest-dom/vitest';
import { switchOnTestMode } from '@k9-sak-web/rest-api';

vi.stubGlobal('URL', { createObjectURL: vi.fn() });

vi.stubGlobal('open', vi.fn());

switchOnTestMode();

Enzyme.configure({ adapter: new Adapter() });

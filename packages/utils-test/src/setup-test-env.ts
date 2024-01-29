import 'raf/polyfill';
import { configure as configureEnzyme } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import configure from '@commercetools/enzyme-extensions';
import ShallowWrapper from 'enzyme/ShallowWrapper';
import { switchOnTestMode } from '@k9-sak-web/rest-api';
import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

configureEnzyme({ adapter: new Adapter() });

configure(ShallowWrapper);

switchOnTestMode();
Object.assign(global, { TextDecoder, TextEncoder });
expect.extend(toHaveNoViolations);

jest.mock('../../sak-app/src/constants', () => ({
  ENVIRONMENT: 'development',
}));

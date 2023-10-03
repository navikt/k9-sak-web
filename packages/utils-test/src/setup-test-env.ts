import 'raf/polyfill';
import { configure as configureEnzyme } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import configure from '@commercetools/enzyme-extensions';
import ShallowWrapper from 'enzyme/ShallowWrapper';
import { switchOnTestMode } from '@k9-sak-web/rest-api';

configureEnzyme({ adapter: new Adapter() });

configure(ShallowWrapper);

switchOnTestMode();

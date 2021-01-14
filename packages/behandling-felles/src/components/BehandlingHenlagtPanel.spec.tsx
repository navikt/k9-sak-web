import React from 'react';
import { shallow } from 'enzyme';

import { FadingPanel } from '@fpsak-frontend/shared-components';

import BehandlingHenlagtPanel from './BehandlingHenlagtPanel';

describe('<BehandlingHenlagtPanel>', () => {
  it('skal rendre komponent', () => {
    const wrapper = shallow(<BehandlingHenlagtPanel />);
    expect(wrapper.find(FadingPanel)).toHaveLength(1);
  });
});

import React from 'react';
import { shallow } from 'enzyme';

import { FadingPanel } from '@fpsak-frontend/shared-components';

import ProsessStegIkkeBehandletPanel from './ProsessStegIkkeBehandletPanel';

describe('<ProsessStegIkkeBehandletPanel>', () => {
  it('skal rendre komponent', () => {
    const wrapper = shallow(<ProsessStegIkkeBehandletPanel />);
    expect(wrapper.find(FadingPanel)).toHaveLength(1);
  });
});

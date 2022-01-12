import React from 'react';
import { shallow } from 'enzyme';

import Home from './Home';

describe('<Home>', () => {
  it('skal rendre komponent', () => {
    const wrapper = shallow(<Home headerHeight={48} />);
    expect(wrapper.find('Routes')).toHaveLength(1);
  });
});

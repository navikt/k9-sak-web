import React from 'react';
import { shallow } from 'enzyme';

import Home from './Home';

describe('<Home>', () => {
  it('skal rendre komponent', () => {
    const wrapper = shallow(<Home headerHeight={48} />);
    expect(wrapper.find('Switch')).toHaveLength(1);
  });
});

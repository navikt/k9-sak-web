import React from 'react';
import { shallow } from 'enzyme';

import DateLabel from './DateLabel';

describe('<DateLabel>', () => {
  it('skal ha en FormattedDate-komponent', () => {
    const wrapper = shallow(<DateLabel dateString="10.10.2017" />);
    expect(wrapper.find('FormattedDate')).toHaveLength(1);
  });

  it('skal sjekke at dato blir formatert korrekt', () => {
    const wrapper = shallow(<DateLabel dateString="10.10.2017" />);

    const div = wrapper.find('FormattedDate');
    expect(div.prop('value')).toEqual(new Date('10.10.2017'));
  });
});

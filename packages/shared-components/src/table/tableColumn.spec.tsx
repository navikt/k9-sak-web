import React from 'react';
import { shallow } from 'enzyme';

import TableColumn from './TableColumn';

describe('<TableColumn>', () => {
  it('skal vise  verdi i kolonne', () => {
    const wrapper = shallow(<TableColumn>testverdi</TableColumn>);

    const col = wrapper.find('td');
    expect(col).toHaveLength(1);
    expect(col.text()).toEqual('testverdi');
  });
});

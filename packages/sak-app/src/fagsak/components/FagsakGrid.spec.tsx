import React from 'react';
import { shallow } from 'enzyme';

import FagsakGrid from './FagsakGrid';

describe('<FagsakGrid>', () => {
  it('skal vise fagsakgrid med underkomponenter', () => {
    const wrapper = shallow(
      <FagsakGrid
        behandlingContent={<div id="behandlingContent" />}
        profileAndNavigationContent={<div id="profileContent" />}
        supportContent={() => <div id="supportContent" />}
        visittkortContent={() => <div id="visittkort" />}
      />,
    );

    expect(wrapper.find('#behandlingContent')).toHaveLength(1);
    expect(wrapper.find('#profileContent')).toHaveLength(1);
    expect(wrapper.find('#supportContent')).toHaveLength(1);
    expect(wrapper.find('#visittkort')).toHaveLength(1);
  });
});

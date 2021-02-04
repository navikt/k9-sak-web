import React from 'react';
import { shallow } from 'enzyme';
import LoadingPanel from './LoadingPanel';

describe('<LoadingPanel>', () => {
  it('skal rendre modal', () => {
    const wrapper = shallow(<LoadingPanel />);

    const spinner = wrapper.find('NavFrontendSpinner');
    expect(spinner).toHaveLength(1);
  });
});

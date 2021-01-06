import React from 'react';
import { shallow } from 'enzyme';
import ErrorPage from './ErrorPage';
import ErrorPageWrapper from './components/ErrorPageWrapper';

describe('<ErrorPage>', () => {
  it('skal rendre ErrorPage korrekt', () => {
    const wrapper = shallow(<ErrorPage />);
    expect(wrapper.find(ErrorPageWrapper)).toHaveLength(1);
  });
});

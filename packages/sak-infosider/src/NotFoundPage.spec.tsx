import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';
import ErrorPageWrapper from './components/ErrorPageWrapper';

describe('<NotFoundPage>', () => {
  it('skal rendre NotFoundPage korrekt', () => {
    const wrapper = shallow(<NotFoundPage />);
    expect(wrapper.find(ErrorPageWrapper)).toHaveLength(1);
    expect(wrapper.find(FormattedMessage)).toHaveLength(1);
    const link = wrapper.find(Link);
    expect(link).toHaveLength(1);
    expect(link.prop('to')).toEqual('/');
  });
});

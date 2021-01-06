import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import UnauthorizedPage from './UnauthorizedPage';
import ErrorPageWrapper from './components/ErrorPageWrapper';

describe('<UnauthorizedPage>', () => {
  it('skal rendre UnauthorizedPage korrekt', () => {
    const wrapper = shallow(<UnauthorizedPage />);
    expect(wrapper.find(ErrorPageWrapper)).toHaveLength(1);
    expect(wrapper.find(FormattedMessage)).toHaveLength(1);
    expect(wrapper.find(Link)).toHaveLength(1);
  });
});

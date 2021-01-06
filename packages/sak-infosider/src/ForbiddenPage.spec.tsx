import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import ForbiddenPage from './ForbiddenPage';
import ErrorPageWrapper from './components/ErrorPageWrapper';

describe('<ForbiddenPage>', () => {
  it('skal rendre ForbiddenPage korrekt', () => {
    const wrapper = shallow(<ForbiddenPage />);
    expect(wrapper.find(ErrorPageWrapper)).toHaveLength(1);
    expect(wrapper.find(FormattedMessage)).toHaveLength(1);
  });
});

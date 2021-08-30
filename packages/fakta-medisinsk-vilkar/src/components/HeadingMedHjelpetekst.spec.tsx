import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import HeadingMedHjelpetekst from './HeadingMedHjelpetekst';

describe('<HeadingMedHjelpetekst', () => {
  it('skal vise én linje med hjelpetekst', () => {
    const wrapper = shallow(<HeadingMedHjelpetekst headingId="test" helpTextId="test" />);
    const button = wrapper.find('button');
    button.simulate('click');
    expect(wrapper.find(FormattedMessage)).toHaveLength(3);
  });
  it('skal vise flere linjer med hjelpetekst', () => {
    const wrapper = shallow(<HeadingMedHjelpetekst headingId="test" helpTextId={['test', 'test2']} />);
    const button = wrapper.find('button');
    button.simulate('click');
    expect(wrapper.find(FormattedMessage)).toHaveLength(4);
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';

import PeriodeInformasjon from './PeriodeInformasjon';

describe('<PeriodeInformasjon>', () => {
  it('skal rendre komponent korrekt', () => {
    const wrapper = shallow(<PeriodeInformasjon fom="2019-10-10" tom="2019-11-10" feilutbetaling={12.123} />);

    expect(wrapper.find(Element).childAt(0).text()).toEqual('10.10.2019 - 10.11.2019');

    const messages = wrapper.find(FormattedMessage);
    expect(messages).toHaveLength(2);
    expect(messages.first().prop('values')).toEqual({
      weeks: 4,
      days: 2,
    });

    expect(wrapper.find('span').childAt(0).text()).toEqual('12');
  });
});

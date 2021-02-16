import React from 'react';
import { shallow } from 'enzyme';

import { FastsattOpptjeningAktivitet } from '@k9-sak-web/types';

import { OpptjeningVilkarViewImpl } from './OpptjeningVilkarView';
import OpptjeningTimeLineLight from './OpptjeningTimeLineLight';

describe('<OpptjeningVilkarView>', () => {
  it('skal vise tidslinje når en har aktiviteter', () => {
    const wrapper = shallow(
      <OpptjeningVilkarViewImpl
        fastsattOpptjeningActivities={[{}] as FastsattOpptjeningAktivitet[]}
        months={1}
        days={2}
        opptjeningFomDate="2017-10-02"
        opptjeningTomDate="2018-02-02"
      />,
    );

    expect(wrapper.find(OpptjeningTimeLineLight)).toHaveLength(1);
  });
});

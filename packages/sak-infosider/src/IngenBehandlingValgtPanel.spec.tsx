import React from 'react';
import { shallow } from 'enzyme';

import { FormattedMessage } from 'react-intl';

import IngenBehandlingValgtPanel from './IngenBehandlingValgtPanel';

describe('<IngenBehandlingValgtPanel>', () => {
  it('skal rendre korrekt melding', () => {
    const wrapper1 = shallow(<IngenBehandlingValgtPanel numBehandlinger={0} />);
    expect(wrapper1.find(FormattedMessage).at(0).prop('id')).toEqual('IngenBehandlingValgtPanel.ZeroBehandlinger');

    const wrapper2 = shallow(<IngenBehandlingValgtPanel numBehandlinger={2} />);
    expect(wrapper2.find(FormattedMessage).at(0).prop('id')).toEqual(
      'IngenBehandlingValgtPanel.PleaseSelectBehandling',
    );
  });
});

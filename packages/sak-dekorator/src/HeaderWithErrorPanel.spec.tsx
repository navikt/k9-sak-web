import React from 'react';
import { shallow } from 'enzyme';
import Header from '@navikt/nap-header';

import HeaderWithErrorPanel from './HeaderWithErrorPanel';

describe('<HeaderWithErrorPanel>', () => {
  it('skal sjekke at navn blir vist', () => {
    const wrapper = shallow(
      <HeaderWithErrorPanel
        navAnsattName="Per"
        removeErrorMessage={() => undefined}
        setSiteHeight={() => undefined}
        getPathToFplos={() => undefined}
      />,
    );
    const header = wrapper.find(Header);
    expect(header.prop('title')).toBe('Pleiepenger, omsorgspenger og frisinn');
  });
});

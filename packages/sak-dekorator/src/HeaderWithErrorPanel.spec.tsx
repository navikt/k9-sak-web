import React from 'react';
import { shallow } from 'enzyme';
import { Header } from '@navikt/k9-react-components';

import HeaderWithErrorPanel from './HeaderWithErrorPanel';

describe('<HeaderWithErrorPanel>', () => {
  it('skal sjekke at navn blir vist', () => {
    const wrapper = shallow(
      <HeaderWithErrorPanel
        navAnsattName="Per"
        removeErrorMessage={() => undefined}
        setSiteHeight={() => undefined}
        getPathToFplos={() => undefined}
        getPathToK9Punsj={() => undefined}
        ainntektPath="test"
        aaregPath="test"
      />,
    );
    const header = wrapper.find(Header);
    expect(header.prop('title')).toBe('Pleiepenger, omsorgspenger og frisinn');
  });
});

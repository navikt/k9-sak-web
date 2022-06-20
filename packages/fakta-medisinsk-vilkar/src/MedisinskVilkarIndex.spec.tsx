import MedisinskVilkarIndex from '@fpsak-frontend/fakta-medisinsk-vilkar';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import { Behandling, Sykdom } from '@k9-sak-web/types';

import MedisinskVilkarForm from './components/MedisinskVilkarForm';

describe('<MedisinskVilkarIndex>', () => {
  it('skal rendre form', () => {
    const behandling: Partial<Behandling> = {
      id: 1,
      versjon: 1,
      sprakkode: 'NO',
    };

    const sykdom: Partial<Sykdom> = {
      legeerklæringer: [],
    };

    const wrapper = shallow(
      <MedisinskVilkarIndex
        behandling={behandling as Behandling}
        submitCallback={sinon.spy()}
        readOnly={false}
        aksjonspunkter={[]}
        harApneAksjonspunkter
        submittable
        sykdom={sykdom as Sykdom}
      />,
    );
    expect(wrapper.find(MedisinskVilkarForm)).toHaveLength(1);
  });
});

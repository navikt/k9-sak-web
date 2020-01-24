import MedisinskVilkarIndex from '@fpsak-frontend/fakta-medisinsk-vilkar';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import MedisinskVilkarPanel from './components/MedisinskVilkarPanel';

describe('<MedisinskVilkarIndex>', () => {
  it('skal rendre form', () => {
    const behandling = {
      id: '1',
      versjon: 1,
      sprakkode: {
        kode: 'NO',
      },
    };

    const wrapper = shallow(
      <MedisinskVilkarIndex
        behandling={behandling}
        submitCallback={sinon.spy()}
        openInfoPanels
        toggleInfoPanelCallback={sinon.spy()}
        shouldOpenDefaultInfoPanels={false}
        readOnly={false}
        aksjonspunkter={[]}
      />,
    );
    expect(wrapper.find(MedisinskVilkarPanel)).has.length(1);
  });
});

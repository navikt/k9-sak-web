import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { EtikettLiten } from 'nav-frontend-typografi';

import ProsessPanelTemplate from './ProsessPanelTemplate';

describe('<ProsessPanelTemplate>', () => {
  it('skal ikke vise lovreferanse når dette ikke finnes', () => {
    const wrapper = shallow(
      <ProsessPanelTemplate
        handleSubmit={sinon.spy()}
        title="Fødsel"
        isAksjonspunktOpen
        formName="testnavn"
        readOnlySubmitButton={false}
        isDirty
        readOnly={false}
        behandlingId={1}
        behandlingVersjon={1}
      >
        <div>test</div>
      </ProsessPanelTemplate>,
    );

    expect(wrapper.find(EtikettLiten)).toHaveLength(0);
  });

  it('skal vise lovreferanse når dette finnes', () => {
    const wrapper = shallow(
      <ProsessPanelTemplate
        handleSubmit={sinon.spy()}
        lovReferanse="test lovReferanse"
        title="Fødsel"
        isAksjonspunktOpen
        formName="testnavn"
        readOnlySubmitButton={false}
        isDirty
        readOnly={false}
        behandlingId={1}
        behandlingVersjon={1}
      >
        <div>test</div>
      </ProsessPanelTemplate>,
    );

    expect(wrapper.find(EtikettLiten)).toHaveLength(1);
  });
});

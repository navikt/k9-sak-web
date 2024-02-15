import React from 'react';

import sinon from 'sinon';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';

import { FaktaBegrunnelseTextField } from '@k9-sak-web/fakta-felles';
import shallowWithIntl, { intlMock } from '../../i18n';
import { RegistrereVergeInfoPanelImpl } from './RegistrereVergeInfoPanel';

describe('<RegistrereVergeInfoPanel>', () => {
  it('skal vise faktapanel og form for registrere verge', () => {
    const wrapper = shallowWithIntl(
      <RegistrereVergeInfoPanelImpl
        {...reduxFormPropsMock}
        intl={intlMock}
        openInfoPanels={['verge']}
        toggleInfoPanelCallback={sinon.spy()}
        hasOpenAksjonspunkter
        readOnly={false}
        aksjonspunkt={{
          kode: 5030,
          id: 100001,
          definisjon: { kode: '5030', navn: 'VERGE' },
          status: { kode: 'OPPR', navn: 'Opprettet', kodeverk: 'AKSJONSPUNKT_STATUS' },
          kanLoses: true,
          erAktivt: true,
        }}
        vergetyper={[{}]}
        behandlingId={1}
        behandlingVersjon={1}
        alleMerknaderFraBeslutter={{}}
      />,
    );

    const panel = wrapper.find(FaktaBegrunnelseTextField);
    expect(panel).to.have.length(1);
  });
});

import React from 'react';
import { expect } from 'chai';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { VedtakAksjonspunktPanelImpl } from './VedtakAksjonspunktPanel';
import VedtakHelpTextPanel from './VedtakHelpTextPanel';
import shallowWithIntl, { intlMock } from '../../../i18n';

describe('<VedtakAksjonspunktPanel>', () => {
  it('skal rendre komponent korrekt', () => {
    const aksjonspunktKoder = [];
    const wrapper = shallowWithIntl(
      <VedtakAksjonspunktPanelImpl
        intl={intlMock}
        behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
        readOnly={false}
        aksjonspunktKoder={aksjonspunktKoder}
        isBehandlingReadOnly={false}
      />,
    );

    expect(wrapper.find(VedtakHelpTextPanel)).to.have.length(1);
  });
});

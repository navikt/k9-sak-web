import React from 'react';
import sinon from 'sinon';

import { OkAvbrytModal } from '@fpsak-frontend/shared-components';

import shallowWithIntl from '../i18n/index';
import MenyApneForEndringerIndex from './MenyApneForEndringerIndex';

describe('<MenyApneForEndringerIndex>', () => {
  it('skal vise modal og velge å åpne behandling for endringer', () => {
    const apneForEndringerCallback = sinon.spy();
    const lukkModalCallback = sinon.spy();

    const wrapper = shallowWithIntl(
      <MenyApneForEndringerIndex
        behandlingId={3}
        behandlingVersjon={1}
        apneBehandlingForEndringer={apneForEndringerCallback}
        lukkModal={lukkModalCallback}
      />,
    );

    const modal = wrapper.find(OkAvbrytModal);
    expect(modal).toHaveLength(1);

    modal.prop('submit')();

    const kall = apneForEndringerCallback.getCalls();
    expect(kall).toHaveLength(1);
    expect(kall[0].args).toHaveLength(1);
    expect(kall[0].args[0]).toEqual({
      behandlingId: 3,
      behandlingVersjon: 1,
    });
  });
});

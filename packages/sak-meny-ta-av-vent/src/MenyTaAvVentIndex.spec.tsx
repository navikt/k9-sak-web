import React from 'react';
import sinon from 'sinon';

import { OkAvbrytModal } from '@fpsak-frontend/shared-components';

import shallowWithIntl from '../i18n/index';
import MenyTaAvVentIndex from './MenyTaAvVentIndex';

describe('<MenyTaAvVentIndex>', () => {
  it('skal vise modal og velge å åpne ta behandling av vent', () => {
    const resumeBehandlingCallback = sinon.spy();
    const lukkModalCallback = sinon.spy();

    const wrapper = shallowWithIntl(
      <MenyTaAvVentIndex
        behandlingId={3}
        behandlingVersjon={1}
        taBehandlingAvVent={resumeBehandlingCallback}
        lukkModal={lukkModalCallback}
      />,
    );

    const modal = wrapper.find(OkAvbrytModal);
    expect(modal).toHaveLength(1);

    modal.prop('submit')();

    const kall = resumeBehandlingCallback.getCalls();
    expect(kall).toHaveLength(1);
    expect(kall[0].args).toHaveLength(1);
    expect(kall[0].args[0]).toEqual({
      behandlingId: 3,
      behandlingVersjon: 1,
    });
  });
});

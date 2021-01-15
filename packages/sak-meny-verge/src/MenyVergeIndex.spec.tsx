import React from 'react';
import sinon from 'sinon';

import { OkAvbrytModal } from '@fpsak-frontend/shared-components';

import shallowWithIntl from '../i18n/index';
import MenyVergeIndex from './MenyVergeIndex';

describe('<MenyVergeIndex>', () => {
  it('skal vise modal for opprett og så velge å opprette verge', () => {
    const opprettVergeCallback = sinon.spy();
    const lukkModalCallback = sinon.spy();

    const wrapper = shallowWithIntl(
      <MenyVergeIndex opprettVerge={opprettVergeCallback} lukkModal={lukkModalCallback} />,
    );

    const modal = wrapper.find(OkAvbrytModal);
    expect(modal).toHaveLength(1);
    expect(modal.prop('text')).toEqual('Opprett verge/fullmektig?');

    modal.prop('submit')();

    const kall = opprettVergeCallback.getCalls();
    expect(kall).toHaveLength(1);

    const lukkKall = lukkModalCallback.getCalls();
    expect(lukkKall).toHaveLength(1);
  });

  it('skal vise modal for fjerne og så velge å fjerne verge', () => {
    const fjernVergeCallback = sinon.spy();
    const lukkModalCallback = sinon.spy();

    const wrapper = shallowWithIntl(<MenyVergeIndex fjernVerge={fjernVergeCallback} lukkModal={lukkModalCallback} />);

    const modal = wrapper.find(OkAvbrytModal);
    expect(modal).toHaveLength(1);
    expect(modal.prop('text')).toEqual('Fjern verge/fullmektig?');

    modal.prop('submit')();

    const kall = fjernVergeCallback.getCalls();
    expect(kall).toHaveLength(1);

    const lukkKall = lukkModalCallback.getCalls();
    expect(lukkKall).toHaveLength(1);
  });
});

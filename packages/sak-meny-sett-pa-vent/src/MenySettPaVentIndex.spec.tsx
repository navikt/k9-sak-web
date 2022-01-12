import React from 'react';
import sinon from 'sinon';

import SettPaVentModalIndex from '@k9-sak-web/modal-sett-pa-vent';

import shallowWithIntl from '../i18n/index';
import MenySettPaVentIndex from './MenySettPaVentIndex';

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useHistory: () => ({
    push: jest.fn(),
  }),
  useNavigate: () => jest.fn(),
}));

describe('<MenySettPaVentIndex>', () => {
  it('skal vise modal og velge å åpne ta behandling av vent', () => {
    const setBehandlingOnHoldCallback = sinon.spy();
    const lukkModalCallback = sinon.spy();

    const wrapper = shallowWithIntl(
      <MenySettPaVentIndex
        behandlingId={3}
        behandlingVersjon={1}
        settBehandlingPaVent={setBehandlingOnHoldCallback}
        ventearsaker={[]}
        lukkModal={lukkModalCallback}
        erTilbakekreving={false}
      />,
    );

    const modal = wrapper.find(SettPaVentModalIndex);
    expect(modal).toHaveLength(1);

    modal.prop('submitCallback')({
      frist: '20-12-2020',
      ventearsak: 'test',
    });

    const kall = setBehandlingOnHoldCallback.getCalls();
    expect(kall).toHaveLength(1);
    expect(kall[0].args).toHaveLength(1);
    expect(kall[0].args[0]).toEqual({
      behandlingId: 3,
      behandlingVersjon: 1,
      frist: '20-12-2020',
      ventearsak: 'test',
    });
  });
});

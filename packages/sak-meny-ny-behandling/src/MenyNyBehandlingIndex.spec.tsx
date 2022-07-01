import React from 'react';
import sinon from 'sinon';

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import shallowWithIntl from '../i18n/index';
import NyBehandlingModal from './components/NyBehandlingModal';
import MenyNyBehandlingIndex from './MenyNyBehandlingIndex';

describe('<MenyNyBehandlingIndex>', () => {
  it('skal vise modal og så henlegge behandling', () => {
    const lagNyBehandlingCallback = sinon.stub().resolves();
    const lukkModalCallback = sinon.spy();

    const behandlingOppretting = [
      {
        behandlingType: behandlingType.FORSTEGANGSSOKNAD,
        kanOppretteBehandling: true,
      },
      {
        behandlingType: behandlingType.REVURDERING,
        kanOppretteBehandling: true,
      },
    ];

    const wrapper = shallowWithIntl(
      <MenyNyBehandlingIndex
        ytelseType={fagsakYtelseType.FORELDREPENGER}
        saksnummer="123"
        behandlingId={3}
        behandlingVersjon={1}
        behandlingType={behandlingType.FORSTEGANGSSOKNAD}
        lagNyBehandling={lagNyBehandlingCallback}
        behandlingOppretting={behandlingOppretting}
        behandlingstyper={[]}
        tilbakekrevingRevurderingArsaker={[]}
        revurderingArsaker={[]}
        kanTilbakekrevingOpprettes={{
          kanBehandlingOpprettes: false,
          kanRevurderingOpprettes: false,
        }}
        uuidForSistLukkede="2323"
        erTilbakekrevingAktivert
        sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
        sjekkOmTilbakekrevingRevurderingKanOpprettes={sinon.spy()}
        lukkModal={lukkModalCallback}
      />,
    );

    const modal = wrapper.find(NyBehandlingModal);
    expect(modal).toHaveLength(1);
    modal.prop('submitCallback')({
      behandlingType: behandlingType.FORSTEGANGSSOKNAD,
      fagsakYtelseType: fagsakYtelseType.FORELDREPENGER,
    });

    const kall = lagNyBehandlingCallback.getCalls();
    expect(kall).toHaveLength(1);
    expect(kall[0].args).toHaveLength(2);
    expect(kall[0].args[0]).toBe('BT-002');
    expect(kall[0].args[1]).toEqual({
      saksnummer: '123',
      behandlingType: behandlingType.FORSTEGANGSSOKNAD,
      fagsakYtelseType: fagsakYtelseType.FORELDREPENGER,
    });

    expect(lukkModalCallback.getCalls()).toHaveLength(1);
  });
});

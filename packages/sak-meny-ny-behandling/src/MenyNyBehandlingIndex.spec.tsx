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
        behandlingType: {
          kode: behandlingType.FORSTEGANGSSOKNAD,
          kodeverk: '',
        },
        kanOppretteBehandling: true,
      },
      {
        behandlingType: {
          kode: behandlingType.REVURDERING,
          kodeverk: '',
        },
        kanOppretteBehandling: true,
      },
    ];

    const wrapper = shallowWithIntl(
      <MenyNyBehandlingIndex
        ytelseType={{
          kode: fagsakYtelseType.FORELDREPENGER,
          kodeverk: 'FAGSAK_YTELSE_TYPE',
        }}
        saksnummer="123"
        behandlingId={3}
        behandlingVersjon={1}
        behandlingType={{
          kode: behandlingType.FORSTEGANGSSOKNAD,
          kodeverk: 'BEHANDLING_TYPE',
        }}
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
      fagsakYtelseType: {
        kode: fagsakYtelseType.FORELDREPENGER,
        kodeverk: '',
      },
    });

    const kall = lagNyBehandlingCallback.getCalls();
    expect(kall).toHaveLength(1);
    expect(kall[0].args).toHaveLength(2);
    expect(kall[0].args[0]).toBe(false);
    expect(kall[0].args[1]).toEqual({
      saksnummer: '123',
      behandlingType: behandlingType.FORSTEGANGSSOKNAD,
      fagsakYtelseType: {
        kode: fagsakYtelseType.FORELDREPENGER,
        kodeverk: '',
      },
    });

    expect(lukkModalCallback.getCalls()).toHaveLength(1);
  });
});

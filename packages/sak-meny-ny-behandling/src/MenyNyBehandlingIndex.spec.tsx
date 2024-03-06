import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import sinon from 'sinon';
import messages from '../i18n/nb_NO.json';
import MenyNyBehandlingIndex from './MenyNyBehandlingIndex';

describe('<MenyNyBehandlingIndex>', () => {
  it('skal vise modal og så lage ny behandling', async () => {
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

    renderWithIntlAndReduxForm(
      <MenyNyBehandlingIndex
        ytelseType={fagsakYtelseType.FORELDREPENGER}
        saksnummer="123"
        behandlingId={3}
        behandlingVersjon={1}
        behandlingType={behandlingType.FORSTEGANGSSOKNAD}
        lagNyBehandling={lagNyBehandlingCallback}
        behandlingOppretting={behandlingOppretting}
        behandlingstyper={[
          {
            kode: behandlingType.FORSTEGANGSSOKNAD,
            kodeverk: 'BEHANDLING_TYPE',
            navn: 'Førstegangssøknad',
          },
        ]}
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
      { messages },
    );
    await act(async () => {
      await userEvent.selectOptions(screen.getByRole('combobox'), 'BT-002');
      await userEvent.click(screen.getByRole('button', { name: 'OK' }));
    });

    const kall = lagNyBehandlingCallback.getCalls();
    expect(kall).toHaveLength(1);
    expect(kall[0].args).toHaveLength(2);
    expect(kall[0].args[0]).toBe('BT-002');
    expect(kall[0].args[1]).toEqual({
      eksternUuid: '2323',
      saksnummer: '123',
      behandlingType: behandlingType.FORSTEGANGSSOKNAD,
      fagsakYtelseType: fagsakYtelseType.FORELDREPENGER,
    });

    expect(lukkModalCallback.getCalls()).toHaveLength(1);
  });
});

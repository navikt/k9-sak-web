import behandlingType from '@k9-sak-web/kodeverk/src/behandlingType';
import fagsakYtelseType from '@k9-sak-web/kodeverk/src/fagsakYtelseType';
import { renderWithIntlAndReduxForm } from '@k9-sak-web/utils-test/test-utils';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import messages from '../i18n/nb_NO.json';
import MenyNyBehandlingIndex from './MenyNyBehandlingIndex';

describe('<MenyNyBehandlingIndex>', () => {
  it('skal vise modal og så lage ny behandling', async () => {
    const lagNyBehandlingCallback = vi.fn().mockImplementation(() => Promise.resolve());
    const lukkModalCallback = vi.fn();

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

    renderWithIntlAndReduxForm(
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
        sjekkOmTilbakekrevingKanOpprettes={vi.fn()}
        sjekkOmTilbakekrevingRevurderingKanOpprettes={vi.fn()}
        lukkModal={lukkModalCallback}
      />,
      { messages },
    );
    await act(async () => {
      await userEvent.selectOptions(screen.getByRole('combobox'), 'BT-002');
      await userEvent.click(screen.getByRole('button', { name: 'OK' }));
    });

    const kall = lagNyBehandlingCallback.mock.calls;
    expect(kall).toHaveLength(1);
    expect(kall[0]).toHaveLength(2);
    expect(kall[0][0]).toBe('BT-002');
    expect(kall[0][1]).toEqual({
      eksternUuid: '2323',
      saksnummer: '123',
      behandlingType: behandlingType.FORSTEGANGSSOKNAD,
      fagsakYtelseType: {
        kode: fagsakYtelseType.FORELDREPENGER,
        kodeverk: 'FAGSAK_YTELSE_TYPE',
      },
    });

    expect(lukkModalCallback.mock.calls).toHaveLength(1);
  });
});

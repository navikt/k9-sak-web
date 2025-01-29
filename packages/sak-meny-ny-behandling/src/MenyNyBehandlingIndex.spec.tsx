import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
        ytelseType={fagsakYtelsesType.FORELDREPENGER}
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
    );
    await act(async () => {
      await userEvent.selectOptions(screen.getByRole('combobox'), 'BT-002');
      await userEvent.click(screen.getByRole('button', { name: 'Opprett behandling' }));
    });

    const kall = lagNyBehandlingCallback.mock.calls;
    expect(kall).toHaveLength(1);
    expect(kall[0]).toHaveLength(2);
    expect(kall[0][0]).toBe('BT-002');
    expect(kall[0][1]).toEqual({
      eksternUuid: '2323',
      saksnummer: '123',
      behandlingType: behandlingType.FORSTEGANGSSOKNAD,
      fagsakYtelseType: fagsakYtelsesType.FORELDREPENGER,
    });

    expect(lukkModalCallback.mock.calls).toHaveLength(1);
  });
});

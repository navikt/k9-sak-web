import { BehandlingDtoSakstype as fagsakYtelseType } from '@k9-sak-web/backend/k9sak/generated';
import { behandlingType as BehandlingTypeK9Sak } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MenyNyBehandlingIndexV2 from './MenyNyBehandlingIndex';

describe('<MenyNyBehandlingIndex>', () => {
  it('skal vise modal og så lage ny behandling', async () => {
    const lagNyBehandlingCallback = vi.fn().mockImplementation(() => Promise.resolve());
    const lukkModalCallback = vi.fn();

    const behandlingOppretting = [
      {
        behandlingType: BehandlingTypeK9Sak.FØRSTEGANGSSØKNAD,
        kanOppretteBehandling: true,
      },
      {
        behandlingType: BehandlingTypeK9Sak.REVURDERING,
        kanOppretteBehandling: true,
      },
    ];

    render(
      <MenyNyBehandlingIndexV2
        ytelseType={fagsakYtelseType.PLEIEPENGER_SYKT_BARN}
        saksnummer="123"
        behandlingId={3}
        behandlingType={BehandlingTypeK9Sak.FØRSTEGANGSSØKNAD}
        lagNyBehandling={lagNyBehandlingCallback}
        behandlingOppretting={behandlingOppretting}
        behandlingstyper={[
          {
            kode: BehandlingTypeK9Sak.FØRSTEGANGSSØKNAD,
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
    expect(kall[0]?.[0]).toBe('BT-002');
    expect(kall[0]?.[1]).toEqual({
      eksternUuid: '2323',
      saksnummer: '123',
      behandlingType: BehandlingTypeK9Sak.FØRSTEGANGSSØKNAD,
      fagsakYtelseType: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
    });

    expect(lukkModalCallback.mock.calls).toHaveLength(1);
  });
});

import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MenyHenleggIndexV2 from './MenyHenleggIndex';

describe('<MenyHenleggIndex>', () => {
  it('skal vise modal og så henlegge behandling', async () => {
    const henleggBehandlingCallback = vi.fn().mockImplementation(() => Promise.resolve());
    const lukkModalCallback = vi.fn();

    render(
      <MenyHenleggIndexV2
        behandlingId={3}
        behandlingVersjon={1}
        henleggBehandling={henleggBehandlingCallback}
        forhandsvisHenleggBehandling={vi.fn()}
        ytelseType={fagsakYtelseType.PLEIEPENGER}
        behandlingType={behandlingType.FORSTEGANGSSOKNAD}
        behandlingResultatTyper={[
          behandlingResultatType.HENLAGT_SOKNAD_TRUKKET,
          behandlingResultatType.HENLAGT_FEILOPPRETTET,
        ]}
        gaaTilSokeside={vi.fn()}
        lukkModal={lukkModalCallback}
        hentMottakere={vi.fn()}
      />,
    );

    expect(screen.getByRole('dialog', { name: 'Behandlingen henlegges' })).toBeInTheDocument();
    await act(async () => {
      await userEvent.selectOptions(screen.getByRole('combobox'), 'HENLAGT_SØKNAD_TRUKKET');
      await userEvent.type(screen.getByRole('textbox', { name: 'Begrunnelse' }), 'Dette er en begrunnelse');
      await userEvent.click(screen.getByRole('button', { name: 'Henlegg behandling' }));
    });

    const kall = henleggBehandlingCallback.mock.calls;
    expect(kall).toHaveLength(1);
    expect(kall[0]).toHaveLength(1);
    expect(kall[0]?.[0]).toEqual({
      behandlingId: 3,
      behandlingVersjon: 1,
      årsakKode: 'HENLAGT_SØKNAD_TRUKKET',
      begrunnelse: 'Dette er en begrunnelse',
      valgtMottaker: null,
    });
  });
});

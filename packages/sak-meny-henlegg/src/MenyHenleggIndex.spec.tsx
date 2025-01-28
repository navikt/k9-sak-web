import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import messages from '../i18n/nb_NO.json';
import MenyHenleggIndex from './MenyHenleggIndex';

describe('<MenyHenleggIndex>', () => {
  it('skal vise modal og så henlegge behandling', async () => {
    const henleggBehandlingCallback = vi.fn().mockImplementation(() => Promise.resolve());
    const lukkModalCallback = vi.fn();

    renderWithIntlAndReduxForm(
      <MenyHenleggIndex
        behandlingId={3}
        behandlingVersjon={1}
        henleggBehandling={henleggBehandlingCallback}
        forhandsvisHenleggBehandling={vi.fn()}
        ytelseType={fagsakYtelsesType.FORELDREPENGER}
        behandlingType={{
          kode: behandlingType.FORSTEGANGSSOKNAD,
          kodeverk: 'BEHANDLING_TYPE',
        }}
        behandlingUuid="2323"
        behandlingResultatTyper={[
          {
            kode: behandlingResultatType.HENLAGT_SOKNAD_TRUKKET,
            kodeverk: 'BEHANDLING_RESULTAT_TYPE',
            navn: 'test',
          },
          {
            kode: behandlingResultatType.HENLAGT_FEILOPPRETTET,
            kodeverk: 'BEHANDLING_RESULTAT_TYPE',
            navn: 'test',
          },
        ]}
        gaaTilSokeside={vi.fn()}
        lukkModal={lukkModalCallback}
        hentMottakere={vi.fn()}
      />,
      { messages },
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
    expect(kall[0][0]).toEqual({
      behandlingId: 3,
      behandlingVersjon: 1,
      årsakKode: 'HENLAGT_SØKNAD_TRUKKET',
      begrunnelse: 'Dette er en begrunnelse',
      valgtMottaker: null,
    });
  });
});

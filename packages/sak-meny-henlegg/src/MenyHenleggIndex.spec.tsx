import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import sinon from 'sinon';
import messages from '../i18n/nb_NO.json';
import MenyHenleggIndex from './MenyHenleggIndex';

describe('<MenyHenleggIndex>', () => {
  it('skal vise modal og så henlegge behandling', async () => {
    const henleggBehandlingCallback = sinon.stub().resolves();
    const lukkModalCallback = sinon.spy();

    renderWithIntlAndReduxForm(
      <MenyHenleggIndex
        behandlingId={3}
        behandlingVersjon={1}
        henleggBehandling={henleggBehandlingCallback}
        forhandsvisHenleggBehandling={sinon.spy()}
        ytelseType={{
          kode: fagsakYtelseType.FORELDREPENGER,
          kodeverk: 'FAGSAK_YTELSE_TYPE',
        }}
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
        gaaTilSokeside={sinon.spy()}
        lukkModal={lukkModalCallback}
        hentMottakere={sinon.spy()}
      />,
      { messages },
    );

    expect(screen.getByRole('dialog', { name: 'Behandlingen henlegges' })).toBeInTheDocument();
    await act(async () => {
      await userEvent.selectOptions(screen.getByRole('combobox'), 'HENLAGT_SØKNAD_TRUKKET');
      await userEvent.type(screen.getByRole('textbox', { name: 'Begrunnelse' }), 'Dette er en begrunnelse');
      await userEvent.click(screen.getByRole('button', { name: 'Henlegg behandling' }));
    });

    const kall = henleggBehandlingCallback.getCalls();
    expect(kall).toHaveLength(1);
    expect(kall[0].args).toHaveLength(1);
    expect(kall[0].args[0]).toEqual({
      behandlingId: 3,
      behandlingVersjon: 1,
      årsakKode: 'HENLAGT_SØKNAD_TRUKKET',
      begrunnelse: 'Dette er en begrunnelse',
      valgtMottaker: null,
    });
  });
});

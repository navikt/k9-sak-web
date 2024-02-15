import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import sinon from 'sinon';
import { intlMock } from '../../i18n/index';
import messages from '../../i18n/nb_NO.json';
import { HenleggBehandlingModalImpl, getHenleggArsaker } from './HenleggBehandlingModal';

describe('<HenleggBehandlingModal>', () => {
  const ytelseType = {
    kode: fagsakYtelseType.FORELDREPENGER,
    kodeverk: 'FAGSAK_YTELSE_TYPE',
  };

  const behandlingResultatTyper = [
    {
      kode: behandlingResultatType.HENLAGT_KLAGE_TRUKKET,
      kodeverk: 'BEHANDLING_RESULT_TYPE',
      navn: '',
    },
    {
      kode: behandlingResultatType.HENLAGT_FEILOPPRETTET,
      kodeverk: 'BEHANDLING_RESULT_TYPE',
      navn: '',
    },
    {
      kode: behandlingResultatType.HENLAGT_FEILOPPRETTET_MED_BREV,
      kodeverk: 'BEHANDLING_RESULT_TYPE',
      navn: '',
    },
    {
      kode: behandlingResultatType.HENLAGT_FEILOPPRETTET_UTEN_BREV,
      kodeverk: 'BEHANDLING_RESULT_TYPE',
      navn: '',
    },
    {
      kode: behandlingResultatType.HENLAGT_INNSYN_TRUKKET,
      kodeverk: 'BEHANDLING_RESULT_TYPE',
      navn: '',
    },
    {
      kode: behandlingResultatType.HENLAGT_SOKNAD_TRUKKET,
      kodeverk: 'BEHANDLING_RESULT_TYPE',
      navn: '',
    },
  ];

  it('skal rendre åpen modal', () => {
    renderWithIntlAndReduxForm(
      <HenleggBehandlingModalImpl
        {...reduxFormPropsMock}
        handleSubmit={sinon.spy()}
        cancelEvent={sinon.spy()}
        previewHenleggBehandling={sinon.spy()}
        årsakKode={behandlingResultatType.HENLAGT_FEILOPPRETTET}
        begrunnelse="Dette er en begrunnelse"
        intl={intlMock}
        showLink={false}
        ytelseType={ytelseType}
        behandlingUuid="123"
        behandlingId={123}
        behandlingResultatTyper={behandlingResultatTyper}
        behandlingType={{
          kode: behandlingType.FORSTEGANGSSOKNAD,
          kodeverk: '',
        }}
        hentMottakere={sinon.spy()}
      />,
      { messages },
    );

    expect(screen.getByRole('dialog', { name: 'Behandlingen henlegges' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Henlegg behandling' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Henlegg behandling' })).not.toBeDisabled();
    expect(screen.queryByRole('link', { name: 'Forhåndsvis brev' })).not.toBeInTheDocument();
  });

  it('skal vise nedtrekksliste med behandlingsresultat-typer', () => {
    renderWithIntlAndReduxForm(
      <HenleggBehandlingModalImpl
        {...reduxFormPropsMock}
        handleSubmit={sinon.spy()}
        cancelEvent={sinon.spy()}
        previewHenleggBehandling={sinon.spy()}
        årsakKode={behandlingResultatType.HENLAGT_FEILOPPRETTET}
        begrunnelse="Dette er en begrunnelse"
        intl={intlMock}
        showLink
        ytelseType={ytelseType}
        behandlingUuid="123"
        behandlingId={123}
        behandlingResultatTyper={behandlingResultatTyper}
        behandlingType={{
          kode: behandlingType.FORSTEGANGSSOKNAD,
          kodeverk: '',
        }}
        hentMottakere={sinon.spy()}
      />,
      { messages },
    );

    expect(screen.getByRole('combobox', { name: 'Velg årsak' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Velg årsak til henleggelse' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Velg årsak til henleggelse' })).toBeDisabled();
    expect(screen.getByRole('option', { name: 'Søknaden er trukket' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Behandlingen er feilaktig opprettet' })).toBeInTheDocument();
  });

  it('skal bruke behandlingsresultat-typer for klage', () => {
    const behandlingsType = { kode: behandlingType.KLAGE, kodeverk: 'BEHANDLING_TYPE' };
    const resultat = getHenleggArsaker(behandlingResultatTyper, behandlingsType, ytelseType);
    expect(resultat.map(r => r.kode)).toEqual([
      behandlingResultatType.HENLAGT_KLAGE_TRUKKET,
      behandlingResultatType.HENLAGT_FEILOPPRETTET,
    ]);
  });

  it('skal bruke behandlingsresultat-typer for innsyn', () => {
    const behandlingsType = { kode: behandlingType.DOKUMENTINNSYN, kodeverk: 'BEHANDLING_TYPE' };
    const resultat = getHenleggArsaker(behandlingResultatTyper, behandlingsType, ytelseType);
    expect(resultat.map(r => r.kode)).toEqual([
      behandlingResultatType.HENLAGT_INNSYN_TRUKKET,
      behandlingResultatType.HENLAGT_FEILOPPRETTET,
    ]);
  });

  it('skal bruke behandlingsresultat-typer for tilbakekreving', () => {
    const behandlingsType = { kode: behandlingType.TILBAKEKREVING, kodeverk: 'BEHANDLING_TYPE' };
    const resultat = getHenleggArsaker(behandlingResultatTyper, behandlingsType, ytelseType);
    expect(resultat.map(r => r.kode)).toEqual([behandlingResultatType.HENLAGT_FEILOPPRETTET]);
  });

  it('skal bruke behandlingsresultat-typer for tilbakekreving revurdering', () => {
    const behandlingsType = { kode: behandlingType.TILBAKEKREVING_REVURDERING, kodeverk: 'BEHANDLING_TYPE' };
    const resultat = getHenleggArsaker(behandlingResultatTyper, behandlingsType, ytelseType);
    expect(resultat.map(r => r.kode)).toEqual([
      behandlingResultatType.HENLAGT_FEILOPPRETTET_MED_BREV,
      behandlingResultatType.HENLAGT_FEILOPPRETTET_UTEN_BREV,
    ]);
  });

  it('skal bruke behandlingsresultat-typer for revudering', () => {
    const behandlingsType = { kode: behandlingType.REVURDERING, kodeverk: 'BEHANDLING_TYPE' };
    const resultat = getHenleggArsaker(behandlingResultatTyper, behandlingsType, ytelseType);
    expect(resultat.map(r => r.kode)).toEqual([
      behandlingResultatType.HENLAGT_SOKNAD_TRUKKET,
      behandlingResultatType.HENLAGT_FEILOPPRETTET,
    ]);
  });

  it('skal bruke behandlingsresultat-typer for førstegangsbehandling', () => {
    const behandlingsType = { kode: behandlingType.FORSTEGANGSSOKNAD, kodeverk: 'BEHANDLING_TYPE' };
    const resultat = getHenleggArsaker(behandlingResultatTyper, behandlingsType, ytelseType);
    expect(resultat.map(r => r.kode)).toEqual([
      behandlingResultatType.HENLAGT_SOKNAD_TRUKKET,
      behandlingResultatType.HENLAGT_FEILOPPRETTET,
    ]);
  });

  it('skal bruke behandlingsresultat-typer for førstegangsbehandling når ytelsestype er Engangsstønad', () => {
    const behandlingsType = { kode: behandlingType.FORSTEGANGSSOKNAD, kodeverk: 'BEHANDLING_TYPE' };
    const resultat = getHenleggArsaker(behandlingResultatTyper, behandlingsType, {
      kode: fagsakYtelseType.ENGANGSSTONAD,
      kodeverk: 'FAGSAK_YTELSE_TYPE',
    });
    expect(resultat.map(r => r.kode)).toEqual([
      behandlingResultatType.HENLAGT_SOKNAD_TRUKKET,
      behandlingResultatType.HENLAGT_FEILOPPRETTET,
    ]);
  });

  it('skal disable knapp for lagring når behandlingsresultat-type og begrunnnelse ikke er valgt', () => {
    renderWithIntlAndReduxForm(
      <HenleggBehandlingModalImpl
        {...reduxFormPropsMock}
        handleSubmit={sinon.spy()}
        cancelEvent={sinon.spy()}
        previewHenleggBehandling={sinon.spy()}
        intl={intlMock}
        showLink
        ytelseType={ytelseType}
        behandlingUuid="123"
        behandlingId={123}
        behandlingResultatTyper={behandlingResultatTyper}
        behandlingType={{
          kode: behandlingType.FORSTEGANGSSOKNAD,
          kodeverk: '',
        }}
        hentMottakere={sinon.spy()}
      />,
      { messages },
    );
    expect(screen.getByRole('button', { name: 'Henlegg behandling' })).toBeDisabled();
  });

  it('skal disable knapp for lagring når behandlingsresultat-type, begrunnnelse og fritekst ikke er valgt for tilbakekreving revurdering', () => {
    renderWithIntlAndReduxForm(
      <HenleggBehandlingModalImpl
        {...reduxFormPropsMock}
        handleSubmit={sinon.spy()}
        cancelEvent={sinon.spy()}
        previewHenleggBehandling={sinon.spy()}
        intl={intlMock}
        showLink
        ytelseType={ytelseType}
        behandlingUuid="123"
        behandlingId={123}
        behandlingResultatTyper={behandlingResultatTyper}
        behandlingType={{
          kode: behandlingType.FORSTEGANGSSOKNAD,
          kodeverk: '',
        }}
        hentMottakere={sinon.spy()}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Henlegg behandling' })).toBeDisabled();
  });

  it('skal bruke submit-callback når en trykker lagre', async () => {
    const submitEventCallback = sinon.spy();
    renderWithIntlAndReduxForm(
      <HenleggBehandlingModalImpl
        {...reduxFormPropsMock}
        handleSubmit={submitEventCallback}
        cancelEvent={sinon.spy()}
        previewHenleggBehandling={sinon.spy()}
        årsakKode={behandlingResultatType.HENLAGT_FEILOPPRETTET}
        begrunnelse="Dette er en begrunnelse"
        intl={intlMock}
        showLink
        ytelseType={ytelseType}
        behandlingUuid="123"
        behandlingId={123}
        behandlingResultatTyper={behandlingResultatTyper}
        behandlingType={{
          kode: behandlingType.FORSTEGANGSSOKNAD,
          kodeverk: '',
        }}
        hentMottakere={sinon.spy()}
      />,
      { messages },
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Henlegg behandling' }));
    });
    expect(submitEventCallback.called).toBe(true);
  });

  it('skal avbryte redigering ved trykk på avbryt-knapp', async () => {
    const cancelEventCallback = sinon.spy();
    renderWithIntlAndReduxForm(
      <HenleggBehandlingModalImpl
        {...reduxFormPropsMock}
        handleSubmit={sinon.spy()}
        cancelEvent={cancelEventCallback}
        previewHenleggBehandling={sinon.spy()}
        årsakKode={behandlingResultatType.HENLAGT_FEILOPPRETTET}
        begrunnelse="Dette er en begrunnelse"
        intl={intlMock}
        showLink
        ytelseType={ytelseType}
        behandlingUuid="123"
        behandlingId={123}
        behandlingResultatTyper={behandlingResultatTyper}
        behandlingType={{
          kode: behandlingType.FORSTEGANGSSOKNAD,
          kodeverk: '',
        }}
        hentMottakere={sinon.spy()}
      />,
      { messages },
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Avbryt' }));
    });
    expect(cancelEventCallback.called).toBe(true);
  });

  it('skal vise forhåndvisningslenke når søknad om henleggelse er trukket', async () => {
    const previewEventCallback = sinon.spy();
    renderWithIntlAndReduxForm(
      <HenleggBehandlingModalImpl
        {...reduxFormPropsMock}
        handleSubmit={sinon.spy()}
        cancelEvent={sinon.spy()}
        previewHenleggBehandling={previewEventCallback}
        årsakKode={behandlingResultatType.HENLAGT_SOKNAD_TRUKKET}
        begrunnelse="Dette er en begrunnelse"
        intl={intlMock}
        showLink
        ytelseType={ytelseType}
        behandlingUuid="123"
        behandlingId={123}
        behandlingResultatTyper={behandlingResultatTyper}
        behandlingType={{
          kode: behandlingType.FORSTEGANGSSOKNAD,
          kodeverk: '',
        }}
        hentMottakere={sinon.spy()}
      />,
      { messages },
    );

    expect(screen.getByRole('link', { name: 'Forhåndsvis brev' })).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByRole('link', { name: 'Forhåndsvis brev' }));
    });
    expect(previewEventCallback.called).toBe(true);
  });

  it('skal vise forhåndvisningslenke når tilbakekreving revurdering henlagt ved feilaktig opprettet med henleggelsesbrev', async () => {
    const previewEventCallback = sinon.spy();
    renderWithIntlAndReduxForm(
      <HenleggBehandlingModalImpl
        {...reduxFormPropsMock}
        handleSubmit={sinon.spy()}
        cancelEvent={sinon.spy()}
        previewHenleggBehandling={previewEventCallback}
        årsakKode={behandlingResultatType.HENLAGT_FEILOPPRETTET_MED_BREV}
        begrunnelse="Dette er en begrunnelse"
        fritekst="Dette er en friteskt"
        intl={intlMock}
        showLink
        ytelseType={ytelseType}
        behandlingUuid="123"
        behandlingId={123}
        behandlingResultatTyper={behandlingResultatTyper}
        behandlingType={{
          kode: behandlingType.FORSTEGANGSSOKNAD,
          kodeverk: '',
        }}
        hentMottakere={sinon.spy()}
      />,
      { messages },
    );

    expect(screen.getByRole('link', { name: 'Forhåndsvis brev' })).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByRole('link', { name: 'Forhåndsvis brev' }));
    });
    expect(previewEventCallback.called).toBe(true);
  });
});

import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { intlWithMessages } from '@fpsak-frontend/utils-test/intl-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import messages from '../../i18n/nb_NO.json';
import { HenleggBehandlingModal, getHenleggArsaker } from './HenleggBehandlingModal';

const intlMock = intlWithMessages(messages);

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
      <HenleggBehandlingModal
        {...reduxFormPropsMock}
        handleSubmit={vi.fn().mockImplementation(() => Promise.resolve())}
        cancelEvent={vi.fn()}
        previewHenleggBehandling={vi.fn()}
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
        hentMottakere={vi.fn()}
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
      <HenleggBehandlingModal
        {...reduxFormPropsMock}
        handleSubmit={vi.fn().mockImplementation(() => Promise.resolve())}
        cancelEvent={vi.fn()}
        previewHenleggBehandling={vi.fn()}
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
        hentMottakere={vi.fn()}
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
      <HenleggBehandlingModal
        {...reduxFormPropsMock}
        handleSubmit={vi.fn().mockImplementation(() => Promise.resolve())}
        cancelEvent={vi.fn()}
        previewHenleggBehandling={vi.fn()}
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
        hentMottakere={vi.fn()}
      />,
      { messages },
    );
    expect(screen.getByRole('button', { name: 'Henlegg behandling' })).toBeDisabled();
  });

  it('skal disable knapp for lagring når behandlingsresultat-type, begrunnnelse og fritekst ikke er valgt for tilbakekreving revurdering', () => {
    renderWithIntlAndReduxForm(
      <HenleggBehandlingModal
        {...reduxFormPropsMock}
        handleSubmit={vi.fn().mockImplementation(() => Promise.resolve())}
        cancelEvent={vi.fn()}
        previewHenleggBehandling={vi.fn()}
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
        hentMottakere={vi.fn()}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Henlegg behandling' })).toBeDisabled();
  });

  it('skal bruke submit-callback når en trykker lagre', async () => {
    const submitEventCallback = vi.fn();
    renderWithIntlAndReduxForm(
      <HenleggBehandlingModal
        {...reduxFormPropsMock}
        handleSubmit={submitEventCallback}
        cancelEvent={vi.fn()}
        previewHenleggBehandling={vi.fn()}
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
        hentMottakere={vi.fn()}
      />,
      { messages },
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Henlegg behandling' }));
    });
    expect(submitEventCallback.mock.calls.length).toBeGreaterThan(0);
  });

  it('skal avbryte redigering ved trykk på avbryt-knapp', async () => {
    const cancelEventCallback = vi.fn();
    renderWithIntlAndReduxForm(
      <HenleggBehandlingModal
        {...reduxFormPropsMock}
        handleSubmit={vi.fn().mockImplementation(() => Promise.resolve())}
        cancelEvent={cancelEventCallback}
        previewHenleggBehandling={vi.fn()}
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
        hentMottakere={vi.fn()}
      />,
      { messages },
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Avbryt' }));
    });
    expect(cancelEventCallback.mock.calls.length).toBeGreaterThan(0);
  });

  it('skal vise forhåndvisningslenke når søknad om henleggelse er trukket', async () => {
    const previewEventCallback = vi.fn();
    renderWithIntlAndReduxForm(
      <HenleggBehandlingModal
        {...reduxFormPropsMock}
        handleSubmit={vi.fn().mockImplementation(() => Promise.resolve())}
        cancelEvent={vi.fn()}
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
        hentMottakere={vi.fn()}
      />,
      { messages },
    );

    expect(screen.getByTestId('previewLink')).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByTestId('previewLink'));
    });
    expect(previewEventCallback.mock.calls.length).toBeGreaterThan(0);
  });

  it('skal vise forhåndvisningslenke når tilbakekreving revurdering henlagt ved feilaktig opprettet med henleggelsesbrev', async () => {
    const previewEventCallback = vi.fn();
    renderWithIntlAndReduxForm(
      <HenleggBehandlingModal
        {...reduxFormPropsMock}
        handleSubmit={vi.fn().mockImplementation(() => Promise.resolve())}
        cancelEvent={vi.fn()}
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
        hentMottakere={vi.fn()}
      />,
      { messages },
    );

    expect(screen.getByTestId('previewLink')).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByTestId('previewLink'));
    });
    expect(previewEventCallback.mock.calls.length).toBeGreaterThan(0);
  });
});

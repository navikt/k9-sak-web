import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
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
import {
  NyBehandlingModal,
  getBehandlingAarsaker,
  getBehandlingTyper,
  getEnabledBehandlingstyper,
} from './NyBehandlingModal';

describe('<NyBehandlingModal>', () => {
  const submitEventCallback = sinon.spy();
  const cancelEventCallback = sinon.spy();

  const ytelseType = {
    kode: fagsakYtelseType.FORELDREPENGER,
    kodeverk: '',
  };

  it('skal rendre komponent korrekt', () => {
    const behandlingstyper = [
      { kode: behandlingType.FORSTEGANGSSOKNAD, navn: 'FØRSTEGANGSSØKNAD', kodeverk: 'BEHANDLING_TYPE' },
    ];
    renderWithIntlAndReduxForm(
      <NyBehandlingModal
        {...reduxFormPropsMock}
        handleSubmit={submitEventCallback}
        cancelEvent={cancelEventCallback}
        intl={intlMock}
        behandlingTyper={behandlingstyper}
        behandlingstyper={behandlingstyper}
        behandlingArsakTyper={[
          { kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE, navn: 'FEIL_I_LOVANDVENDELSE', kodeverk: 'ARSAK' },
        ]}
        enabledBehandlingstyper={behandlingstyper}
        erTilbakekrevingAktivert={false}
        saksnummer={123}
        sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
        sjekkOmTilbakekrevingRevurderingKanOpprettes={sinon.spy()}
        ytelseType={ytelseType}
        submitCallback={sinon.spy()}
        behandlingOppretting={[
          {
            behandlingType: {
              kode: behandlingType.FORSTEGANGSSOKNAD,
              kodeverk: '',
            },
            kanOppretteBehandling: true,
          },
        ]}
        tilbakekrevingRevurderingArsaker={[]}
        revurderingArsaker={[]}
        kanTilbakekrevingOpprettes={{
          kanBehandlingOpprettes: true,
          kanRevurderingOpprettes: true,
        }}
        valgtBehandlingTypeKode={behandlingType.FORSTEGANGSSOKNAD}
        erTilbakekreving={false}
      />,
      { messages },
    );

    expect(screen.getByRole('dialog', { name: 'Ny behandling' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    expect(screen.getAllByRole('combobox').length).toBe(2);
  });

  it('skal bruke submit-callback når en trykker lagre', async () => {
    const behandlingstyper = [
      { kode: behandlingType.FORSTEGANGSSOKNAD, navn: 'FØRSTEGANGSSØKNAD', kodeverk: 'BEHANDLING_TYPE' },
    ];
    renderWithIntlAndReduxForm(
      <NyBehandlingModal
        {...reduxFormPropsMock}
        handleSubmit={submitEventCallback}
        cancelEvent={sinon.spy()}
        intl={intlMock}
        behandlingTyper={behandlingstyper}
        behandlingstyper={behandlingstyper}
        behandlingArsakTyper={[
          { kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE, navn: 'FEIL_I_LOVANDVENDELSE', kodeverk: 'ARSAK' },
        ]}
        enabledBehandlingstyper={behandlingstyper}
        sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
        sjekkOmTilbakekrevingRevurderingKanOpprettes={sinon.spy()}
        erTilbakekrevingAktivert={false}
        saksnummer={123}
        ytelseType={ytelseType}
        submitCallback={sinon.spy()}
        behandlingOppretting={[
          {
            behandlingType: {
              kode: behandlingType.FORSTEGANGSSOKNAD,
              kodeverk: '',
            },
            kanOppretteBehandling: true,
          },
        ]}
        tilbakekrevingRevurderingArsaker={[]}
        revurderingArsaker={[]}
        kanTilbakekrevingOpprettes={{
          kanBehandlingOpprettes: true,
          kanRevurderingOpprettes: true,
        }}
        valgtBehandlingTypeKode={behandlingType.FORSTEGANGSSOKNAD}
        erTilbakekreving={false}
      />,
      { messages },
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'OK' }));
    });
    expect(submitEventCallback.called).toBe(true);
  });

  it('skal lukke modal ved klikk på avbryt-knapp', async () => {
    const behandlingstyper = [
      { kode: behandlingType.FORSTEGANGSSOKNAD, navn: 'FØRSTEGANGSSØKNAD', kodeverk: 'BEHANDLING_TYPE' },
    ];
    renderWithIntlAndReduxForm(
      <NyBehandlingModal
        {...reduxFormPropsMock}
        handleSubmit={submitEventCallback}
        cancelEvent={cancelEventCallback}
        intl={intlMock}
        behandlingTyper={behandlingstyper}
        behandlingstyper={behandlingstyper}
        behandlingArsakTyper={[
          { kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE, navn: 'FEIL_I_LOVANDVENDELSE', kodeverk: 'ARSAK' },
        ]}
        enabledBehandlingstyper={behandlingstyper}
        erTilbakekrevingAktivert={false}
        sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
        sjekkOmTilbakekrevingRevurderingKanOpprettes={sinon.spy()}
        saksnummer={123}
        ytelseType={ytelseType}
        submitCallback={sinon.spy()}
        behandlingOppretting={[
          {
            behandlingType: {
              kode: behandlingType.FORSTEGANGSSOKNAD,
              kodeverk: '',
            },
            kanOppretteBehandling: true,
          },
        ]}
        tilbakekrevingRevurderingArsaker={[]}
        revurderingArsaker={[]}
        kanTilbakekrevingOpprettes={{
          kanBehandlingOpprettes: true,
          kanRevurderingOpprettes: true,
        }}
        valgtBehandlingTypeKode={behandlingType.FORSTEGANGSSOKNAD}
        erTilbakekreving={false}
      />,
      { messages },
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Avbryt' }));
    });
    expect(cancelEventCallback).toHaveProperty('callCount', 1);
  });

  it('skal vise checkbox for behandling etter klage når førstegangsbehandling er valgt', () => {
    const behandlingstyper = [
      { kode: behandlingType.FORSTEGANGSSOKNAD, navn: 'FØRSTEGANGSSØKNAD', kodeverk: 'BEHANDLING_TYPE' },
    ];
    renderWithIntlAndReduxForm(
      <NyBehandlingModal
        {...reduxFormPropsMock}
        handleSubmit={submitEventCallback}
        cancelEvent={cancelEventCallback}
        intl={intlMock}
        behandlingTyper={behandlingstyper}
        behandlingstyper={behandlingstyper}
        behandlingArsakTyper={[
          { kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE, navn: 'FEIL_I_LOVANDVENDELSE', kodeverk: 'ARSAK' },
        ]}
        enabledBehandlingstyper={behandlingstyper}
        sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
        sjekkOmTilbakekrevingRevurderingKanOpprettes={sinon.spy()}
        erTilbakekrevingAktivert={false}
        saksnummer={123}
        ytelseType={ytelseType}
        submitCallback={sinon.spy()}
        behandlingOppretting={[
          {
            behandlingType: {
              kode: behandlingType.FORSTEGANGSSOKNAD,
              kodeverk: '',
            },
            kanOppretteBehandling: true,
          },
        ]}
        tilbakekrevingRevurderingArsaker={[]}
        revurderingArsaker={[]}
        kanTilbakekrevingOpprettes={{
          kanBehandlingOpprettes: true,
          kanRevurderingOpprettes: true,
        }}
        valgtBehandlingTypeKode={behandlingType.FORSTEGANGSSOKNAD}
        erTilbakekreving={false}
      />,
      { messages },
    );
    expect(
      screen.getByRole('checkbox', { name: 'Behandlingen opprettes som et resultat av klagebehandling' }),
    ).toBeInTheDocument();
  });

  it('skal ikke vise checkbox for behandling etter klage når dokumentinnsyn er valgt', () => {
    const behandlingstyper = [
      { kode: behandlingType.DOKUMENTINNSYN, navn: 'DOKUMENTINNSYN', kodeverk: 'BEHANDLING_TYPE' },
    ];
    renderWithIntlAndReduxForm(
      <NyBehandlingModal
        {...reduxFormPropsMock}
        handleSubmit={submitEventCallback}
        cancelEvent={cancelEventCallback}
        intl={intlMock}
        behandlingTyper={behandlingstyper}
        behandlingstyper={behandlingstyper}
        behandlingArsakTyper={[
          { kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE, navn: 'FEIL_I_LOVANDVENDELSE', kodeverk: 'ARSAK' },
        ]}
        enabledBehandlingstyper={behandlingstyper}
        sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
        sjekkOmTilbakekrevingRevurderingKanOpprettes={sinon.spy()}
        erTilbakekrevingAktivert={false}
        saksnummer={123}
        ytelseType={ytelseType}
        submitCallback={sinon.spy()}
        behandlingOppretting={[
          {
            behandlingType: {
              kode: behandlingType.FORSTEGANGSSOKNAD,
              kodeverk: '',
            },
            kanOppretteBehandling: true,
          },
        ]}
        tilbakekrevingRevurderingArsaker={[]}
        revurderingArsaker={[]}
        kanTilbakekrevingOpprettes={{
          kanBehandlingOpprettes: true,
          kanRevurderingOpprettes: true,
        }}
        valgtBehandlingTypeKode={behandlingType.DOKUMENTINNSYN}
        erTilbakekreving={false}
      />,
      { messages },
    );

    expect(
      screen.queryByRole('checkbox', { name: 'Behandlingen opprettes som et resultat av klagebehandling' }),
    ).not.toBeInTheDocument();
  });

  it('skal vise dropdown for revuderingsårsaker når revurdering er valgt', () => {
    const behandlingstyper = [{ kode: behandlingType.REVURDERING, navn: 'REVURDERING', kodeverk: 'BEHANDLING_TYPE' }];
    renderWithIntlAndReduxForm(
      <NyBehandlingModal
        {...reduxFormPropsMock}
        handleSubmit={submitEventCallback}
        cancelEvent={cancelEventCallback}
        intl={intlMock}
        behandlingTyper={behandlingstyper}
        behandlingstyper={behandlingstyper}
        behandlingArsakTyper={[
          { kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE, navn: 'FEIL_I_LOVANDVENDELSE', kodeverk: 'ARSAK' },
        ]}
        enabledBehandlingstyper={behandlingstyper}
        sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
        sjekkOmTilbakekrevingRevurderingKanOpprettes={sinon.spy()}
        erTilbakekrevingAktivert={false}
        saksnummer={123}
        ytelseType={ytelseType}
        submitCallback={sinon.spy()}
        behandlingOppretting={[
          {
            behandlingType: {
              kode: behandlingType.FORSTEGANGSSOKNAD,
              kodeverk: '',
            },
            kanOppretteBehandling: true,
          },
        ]}
        tilbakekrevingRevurderingArsaker={[]}
        revurderingArsaker={[]}
        kanTilbakekrevingOpprettes={{
          kanBehandlingOpprettes: true,
          kanRevurderingOpprettes: true,
        }}
        valgtBehandlingTypeKode={behandlingType.REVURDERING}
        erTilbakekreving={false}
      />,
      { messages },
    );
    expect(screen.getAllByRole('combobox').length).toBe(2);
    expect(screen.getByRole('option', { name: 'Revurderingsbehandling' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'FEIL_I_LOVANDVENDELSE' })).toBeInTheDocument();
  });

  it('skal ikke vise dropdown for revuderingsårsaker når dokumentinnsyn er valgt', () => {
    const behandlingstyper = [
      { kode: behandlingType.DOKUMENTINNSYN, navn: 'DOKUMENTINNSYN', kodeverk: 'BEHANDLING_TYPE' },
    ];
    renderWithIntlAndReduxForm(
      <NyBehandlingModal
        {...reduxFormPropsMock}
        handleSubmit={submitEventCallback}
        cancelEvent={cancelEventCallback}
        intl={intlMock}
        behandlingTyper={behandlingstyper}
        behandlingstyper={behandlingstyper}
        behandlingArsakTyper={[]}
        enabledBehandlingstyper={behandlingstyper}
        sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
        sjekkOmTilbakekrevingRevurderingKanOpprettes={sinon.spy()}
        erTilbakekrevingAktivert={false}
        saksnummer={123}
        ytelseType={ytelseType}
        submitCallback={sinon.spy()}
        behandlingOppretting={[
          {
            behandlingType: {
              kode: behandlingType.FORSTEGANGSSOKNAD,
              kodeverk: '',
            },
            kanOppretteBehandling: true,
          },
        ]}
        tilbakekrevingRevurderingArsaker={[]}
        revurderingArsaker={[]}
        kanTilbakekrevingOpprettes={{
          kanBehandlingOpprettes: true,
          kanRevurderingOpprettes: true,
        }}
        valgtBehandlingTypeKode={behandlingType.DOKUMENTINNSYN}
        erTilbakekreving={false}
      />,
      { messages },
    );

    expect(screen.getAllByRole('combobox').length).toBe(1);
    expect(screen.getByRole('option', { name: 'DOKUMENTINNSYN' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Revurderingsbehandling' })).not.toBeInTheDocument();
  });

  it('skal finne filtrerte behandlingsårsaker når det er valgt behandlingstype TILBAKEKREVING_REVURDERING', () => {
    const behandlingArsakerFpTilbake = [
      {
        kode: behandlingArsakType.RE_KLAGE_KA,
        navn: 'RE_KLAGE_KA',
        kodeverk: '',
      },
      {
        kode: behandlingArsakType.RE_KLAGE_NFP,
        navn: 'RE_KLAGE_KA',
        kodeverk: '',
      },
      {
        kode: behandlingArsakType.RE_VILKÅR,
        navn: 'Nye opplysninger om vilkårsvurdering',
        kodeverk: '',
      },
      {
        kode: behandlingArsakType.RE_FORELDELSE,
        navn: 'Nye opplysninger om foreldelse',
        kodeverk: '',
      },
      {
        kode: behandlingArsakType.RE_FEILUTBETALT_BELØP_REDUSERT,
        navn: 'Feilutbetalt beløp helt eller delvis bortfalt',
        kodeverk: '',
      },
    ];
    const bType = behandlingType.TILBAKEKREVING_REVURDERING;

    const behandlingArsakerFpSak = [];

    const res = getBehandlingAarsaker.resultFunc(behandlingArsakerFpSak, behandlingArsakerFpTilbake, bType);

    expect(res).toEqual(expect.arrayContaining([behandlingArsakerFpTilbake[3], behandlingArsakerFpTilbake[2]]));
  });

  it('skal finne filtrerte behandlingsårsaker når det er valgt behandlingstype REVURDERING', () => {
    const behandlingArsakerFpSak = [
      {
        kode: behandlingArsakType.ANNET,
        navn: 'annet',
        kodeverk: '',
      },
      {
        kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE,
        navn: 'feil i lovandvendelse',
        kodeverk: '',
      },
      {
        kode: behandlingArsakType.FEIL_ELLER_ENDRET_FAKTA,
        navn: 'feil eller endret fakta',
        kodeverk: '',
      },
      {
        kode: behandlingArsakType.FEIL_REGELVERKSFORSTAELSE,
        navn: 'feil regelverksforstaelse',
        kodeverk: '',
      },
      {
        kode: behandlingArsakType.FEIL_PROSESSUELL,
        navn: 'feil prosessuell',
        kodeverk: '',
      },
    ];
    const bType = behandlingType.REVURDERING;
    const behandlingArsakerFpTilbake = [];

    const res = getBehandlingAarsaker.resultFunc(behandlingArsakerFpSak, behandlingArsakerFpTilbake, bType);

    expect(res).toEqual(
      expect.arrayContaining([
        behandlingArsakerFpSak[0],
        behandlingArsakerFpSak[2],
        behandlingArsakerFpSak[1],
        behandlingArsakerFpSak[4],
        behandlingArsakerFpSak[3],
      ]),
    );
  });

  it('skal finne filtrere behandlingstyper for kun fpsak', () => {
    const kodeverkFpSak = [
      {
        kode: behandlingType.TILBAKEKREVING,
        navn: 'tilbakekreving',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: behandlingType.REVURDERING,
        navn: 'revurdering',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'forstegangssoknad',
        kodeverk: 'BEHANDLING_TYPE',
      },
    ];

    const res = getBehandlingTyper.resultFunc(kodeverkFpSak);

    expect(res).toEqual(expect.arrayContaining([kodeverkFpSak[2], kodeverkFpSak[1]]));
  });

  it('skal filtrere bort tilbakekreving når denne ikke kan lages', () => {
    const behandlingstyper = [
      {
        kode: behandlingType.TILBAKEKREVING,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: behandlingType.TILBAKEKREVING_REVURDERING,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: behandlingType.REVURDERING,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: behandlingType.KLAGE,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
    ];

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
      {
        behandlingType: {
          kode: behandlingType.KLAGE,
          kodeverk: '',
        },
        kanOppretteBehandling: true,
      },
    ];
    const kanTilbakekrevingOpprettes = {
      kanBehandlingOpprettes: false,
      kanRevurderingOpprettes: true,
    };

    const res = getEnabledBehandlingstyper.resultFunc(
      behandlingstyper,
      behandlingOppretting,
      kanTilbakekrevingOpprettes,
    );

    expect(res).toEqual([behandlingstyper[2], behandlingstyper[3], behandlingstyper[4], behandlingstyper[1]]);
  });

  it('skal filtrere bort tilbakekreving-revurdering når denne ikke kan lages', () => {
    const behandlingstyper = [
      {
        kode: behandlingType.TILBAKEKREVING,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: behandlingType.TILBAKEKREVING_REVURDERING,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: behandlingType.REVURDERING,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: behandlingType.KLAGE,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
    ];

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
      {
        behandlingType: {
          kode: behandlingType.KLAGE,
          kodeverk: '',
        },
        kanOppretteBehandling: true,
      },
    ];
    const kanTilbakekrevingOpprettes = {
      kanBehandlingOpprettes: true,
      kanRevurderingOpprettes: false,
    };

    const res = getEnabledBehandlingstyper.resultFunc(
      behandlingstyper,
      behandlingOppretting,
      kanTilbakekrevingOpprettes,
    );

    expect(res).toEqual([behandlingstyper[2], behandlingstyper[3], behandlingstyper[4], behandlingstyper[0]]);
  });

  it('skal filtrere bort førstegangsbehandling når denne ikke kan lages', () => {
    const behandlingstyper = [
      {
        kode: behandlingType.TILBAKEKREVING,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: behandlingType.TILBAKEKREVING_REVURDERING,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: behandlingType.REVURDERING,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: behandlingType.KLAGE,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
    ];

    const behandlingOppretting = [
      {
        behandlingType: {
          kode: behandlingType.FORSTEGANGSSOKNAD,
          kodeverk: '',
        },
        kanOppretteBehandling: false,
      },
      {
        behandlingType: {
          kode: behandlingType.REVURDERING,
          kodeverk: '',
        },
        kanOppretteBehandling: true,
      },
      {
        behandlingType: {
          kode: behandlingType.KLAGE,
          kodeverk: '',
        },
        kanOppretteBehandling: true,
      },
    ];
    const kanTilbakekrevingOpprettes = {
      kanBehandlingOpprettes: true,
      kanRevurderingOpprettes: true,
    };

    const res = getEnabledBehandlingstyper.resultFunc(
      behandlingstyper,
      behandlingOppretting,
      kanTilbakekrevingOpprettes,
    );

    expect(res).toEqual([behandlingstyper[3], behandlingstyper[4], behandlingstyper[0], behandlingstyper[1]]);
  });

  it('skal filtrere bort revurdering når denne ikke kan lages', () => {
    const behandlingstyper = [
      {
        kode: behandlingType.TILBAKEKREVING,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: behandlingType.TILBAKEKREVING_REVURDERING,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
      {
        kode: behandlingType.REVURDERING,
        navn: '',
        kodeverk: 'BEHANDLING_TYPE',
      },
    ];

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
        kanOppretteBehandling: false,
      },
      {
        behandlingType: {
          kode: behandlingType.KLAGE,
          kodeverk: '',
        },
        kanOppretteBehandling: true,
      },
    ];

    const kanTilbakekrevingOpprettes = {
      kanBehandlingOpprettes: true,
      kanRevurderingOpprettes: true,
    };

    const res = getEnabledBehandlingstyper.resultFunc(
      behandlingstyper,
      behandlingOppretting,
      kanTilbakekrevingOpprettes,
    );

    expect(res).toEqual([behandlingstyper[2], behandlingstyper[0], behandlingstyper[1]]);
  });
});

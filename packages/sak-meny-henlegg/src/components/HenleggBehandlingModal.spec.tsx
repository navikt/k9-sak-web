import React from 'react';
import sinon from 'sinon';
import Modal from 'nav-frontend-modal';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import { getHenleggArsaker, HenleggBehandlingModalImpl } from './HenleggBehandlingModal';
import shallowWithIntl, { intlMock } from '../../i18n/index';

describe('<HenleggBehandlingModal>', () => {
  const ytelseType = fagsakYtelseType.FORELDREPENGER;

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
    const wrapper = shallowWithIntl(
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
        behandlingType={behandlingType.FORSTEGANGSSOKNAD}
        hentMottakere={sinon.spy()}
      />,
    );

    const modal = wrapper.find(Modal);
    expect(modal).toHaveLength(1);
    expect(modal.prop('isOpen')).toBe(true);
    expect(modal.prop('closeButton')).toBe(false);
    expect(modal.prop('contentLabel')).toEqual('Behandlingen henlegges');

    const button = wrapper.find('Hovedknapp');
    expect(button).toHaveLength(1);
    expect(button.prop('disabled')).toBe(false);

    const previewLink = wrapper.find('a');
    expect(previewLink).toHaveLength(0);
  });

  it('skal vise nedtrekksliste med behandlingsresultat-typer', () => {
    const wrapper = shallowWithIntl(
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
        behandlingType={behandlingType.FORSTEGANGSSOKNAD}
        hentMottakere={sinon.spy()}
      />,
    );

    const selectField = wrapper.find('SelectField');
    expect(selectField).toHaveLength(1);
    expect(selectField.prop('placeholder')).toEqual('Velg årsak til henleggelse');
    const values = selectField.prop('selectValues');
    expect(values).toHaveLength(2);
    expect(values[0].props.value).toEqual(behandlingResultatType.HENLAGT_SOKNAD_TRUKKET);
    expect(values[1].props.value).toEqual(behandlingResultatType.HENLAGT_FEILOPPRETTET);
  });

  it('skal bruke behandlingsresultat-typer for klage', () => {
    const behandlingsType = behandlingType.KLAGE;
    const resultat = getHenleggArsaker(behandlingResultatTyper, behandlingsType, ytelseType);
    expect(resultat.map(r => r.kode)).toEqual([
      behandlingResultatType.HENLAGT_KLAGE_TRUKKET,
      behandlingResultatType.HENLAGT_FEILOPPRETTET,
    ]);
  });

  it('skal bruke behandlingsresultat-typer for innsyn', () => {
    const behandlingsType = behandlingType.DOKUMENTINNSYN;
    const resultat = getHenleggArsaker(behandlingResultatTyper, behandlingsType, ytelseType);
    expect(resultat.map(r => r.kode)).toEqual([
      behandlingResultatType.HENLAGT_INNSYN_TRUKKET,
      behandlingResultatType.HENLAGT_FEILOPPRETTET,
    ]);
  });

  it('skal bruke behandlingsresultat-typer for tilbakekreving', () => {
    const behandlingsType = behandlingType.TILBAKEKREVING;
    const resultat = getHenleggArsaker(behandlingResultatTyper, behandlingsType, ytelseType);
    expect(resultat.map(r => r.kode)).toEqual([behandlingResultatType.HENLAGT_FEILOPPRETTET]);
  });

  it('skal bruke behandlingsresultat-typer for tilbakekreving revurdering', () => {
    const behandlingsType = behandlingType.TILBAKEKREVING_REVURDERING;
    const resultat = getHenleggArsaker(behandlingResultatTyper, behandlingsType, ytelseType);
    expect(resultat.map(r => r.kode)).toEqual([
      behandlingResultatType.HENLAGT_FEILOPPRETTET_MED_BREV,
      behandlingResultatType.HENLAGT_FEILOPPRETTET_UTEN_BREV,
    ]);
  });

  it('skal bruke behandlingsresultat-typer for revudering', () => {
    const behandlingsType = behandlingType.REVURDERING;
    const resultat = getHenleggArsaker(behandlingResultatTyper, behandlingsType, ytelseType);
    expect(resultat.map(r => r.kode)).toEqual([
      behandlingResultatType.HENLAGT_SOKNAD_TRUKKET,
      behandlingResultatType.HENLAGT_FEILOPPRETTET,
    ]);
  });

  it('skal bruke behandlingsresultat-typer for førstegangsbehandling', () => {
    const behandlingsType = behandlingType.FORSTEGANGSSOKNAD;
    const resultat = getHenleggArsaker(behandlingResultatTyper, behandlingsType, ytelseType);
    expect(resultat.map(r => r.kode)).toEqual([
      behandlingResultatType.HENLAGT_SOKNAD_TRUKKET,
      behandlingResultatType.HENLAGT_FEILOPPRETTET,
    ]);
  });

  it('skal bruke behandlingsresultat-typer for førstegangsbehandling når ytelsestype er Engangsstønad', () => {
    const behandlingsType = behandlingType.FORSTEGANGSSOKNAD;
    const resultat = getHenleggArsaker(behandlingResultatTyper, behandlingsType, fagsakYtelseType.ENGANGSSTONAD);
    expect(resultat.map(r => r.kode)).toEqual([
      behandlingResultatType.HENLAGT_SOKNAD_TRUKKET,
      behandlingResultatType.HENLAGT_FEILOPPRETTET,
    ]);
  });

  it('skal disable knapp for lagring når behandlingsresultat-type og begrunnnelse ikke er valgt', () => {
    const wrapper = shallowWithIntl(
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
        behandlingType={behandlingType.FORSTEGANGSSOKNAD}
        hentMottakere={sinon.spy()}
      />,
    );

    const button = wrapper.find('Hovedknapp');
    expect(button.prop('disabled')).toBe(true);
  });

  it('skal disable knapp for lagring når behandlingsresultat-type, begrunnnelse og fritekst ikke er valgt for tilbakekreving revurdering', () => {
    const wrapper = shallowWithIntl(
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
        behandlingType={behandlingType.FORSTEGANGSSOKNAD}
        hentMottakere={sinon.spy()}
      />,
    );

    const button = wrapper.find('Hovedknapp');
    expect(button.prop('disabled')).toBe(true);
  });

  it('skal bruke submit-callback når en trykker lagre', () => {
    const submitEventCallback = sinon.spy();
    const wrapper = shallowWithIntl(
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
        behandlingType={behandlingType.FORSTEGANGSSOKNAD}
        hentMottakere={sinon.spy()}
      />,
    );

    const form = wrapper.find('form');
    form.simulate('submit', {
      preventDefault() {
        return undefined;
      },
    });
    expect(submitEventCallback.called).toBe(true);
  });

  it('skal avbryte redigering ved trykk på avbryt-knapp', () => {
    const cancelEventCallback = sinon.spy();
    const wrapper = shallowWithIntl(
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
        behandlingType={behandlingType.FORSTEGANGSSOKNAD}
        hentMottakere={sinon.spy()}
      />,
    );

    const avbrytKnapp = wrapper.find('Knapp');
    expect(avbrytKnapp).toHaveLength(1);
    expect(avbrytKnapp.prop('mini')).toBe(true);

    avbrytKnapp.simulate('click');
    expect(cancelEventCallback.called).toBe(true);
  });

  it('skal vise forhåndvisningslenke når søknad om henleggelse er trukket', () => {
    const previewEventCallback = sinon.spy();
    const wrapper = shallowWithIntl(
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
        behandlingType={behandlingType.FORSTEGANGSSOKNAD}
        hentMottakere={sinon.spy()}
      />,
    );

    const previewLink = wrapper.find('a');
    expect(previewLink).toHaveLength(1);
    expect(previewLink.text()).toEqual('Forhåndsvis brev');

    expect(previewEventCallback.called).toBe(false);
    previewLink.simulate('click', { preventDefault: sinon.spy() });
    expect(previewEventCallback.called).toBe(true);
  });

  it('skal vise forhåndvisningslenke når tilbakekreving revurdering henlagt ved feilaktig opprettet med henleggelsesbrev', () => {
    const previewEventCallback = sinon.spy();
    const wrapper = shallowWithIntl(
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
        behandlingType={behandlingType.FORSTEGANGSSOKNAD}
        hentMottakere={sinon.spy()}
      />,
    );

    const previewLink = wrapper.find('a');
    expect(previewLink).toHaveLength(1);
    expect(previewLink.text()).toEqual('Forhåndsvis brev');

    expect(previewEventCallback.called).toBe(false);
    previewLink.simulate('click', { preventDefault: sinon.spy() });
    expect(previewEventCallback.called).toBe(true);
  });
});

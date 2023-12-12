import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import {
  FatterVedtakStatusModal,
  IverksetterVedtakStatusModal,
  ProsessStegContainer,
  ProsessStegPanel,
} from '@k9-sak-web/behandling-felles';
import { Behandling, Fagsak, Soknad } from '@k9-sak-web/types';

import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { PleiepengerBehandlingApiKeys, requestPleiepengerApi } from '../data/pleiepengerBehandlingApi';
import FetchedData from '../types/FetchedData';
import PleiepengerProsess from './PleiepengerProsess';

describe('<PleiepengerProsess>', () => {
  const fagsak = {
    saksnummer: '123456',
    sakstype: { kode: fagsakYtelseType.FORELDREPENGER, kodeverk: 'test' },
    status: { kode: fagsakStatus.UNDER_BEHANDLING, kodeverk: 'test' },
  } as Fagsak;

  const fagsakPerson = {
    alder: 30,
    personstatusType: { kode: personstatusType.BOSATT, kodeverk: 'test' },
    erDod: false,
    erKvinne: true,
    navn: 'Espen Utvikler',
    personnummer: '12345',
  };
  const behandling = {
    id: 1,
    versjon: 2,
    status: { kode: behandlingStatus.BEHANDLING_UTREDES, kodeverk: 'test' },
    type: { kode: behandlingType.FORSTEGANGSSOKNAD, kodeverk: 'test' },
    behandlingPaaVent: false,
    taskStatus: {
      readOnly: false,
    },
    behandlingHenlagt: false,
    links: [],
  };
  const rettigheter = {
    writeAccess: {
      isEnabled: true,
      employeeHasAccess: true,
    },
    kanOverstyreAccess: {
      isEnabled: true,
      employeeHasAccess: true,
    },
  };
  const aksjonspunkter = [
    {
      definisjon: { kode: aksjonspunktCodes.AUTOMATISK_MARKERING_AV_UTENLANDSSAK, kodeverk: 'test' },
      status: { kode: aksjonspunktStatus.OPPRETTET, kodeverk: 'test' },
      kanLoses: true,
      erAktivt: true,
    },
  ];
  const vilkar = [
    {
      vilkarType: { kode: vilkarType.SOKERSOPPLYSNINGSPLIKT, kodeverk: 'test' },
      overstyrbar: true,
      perioder: [
        {
          merknadParametere: {},
          vilkarStatus: { kode: vilkarUtfallType.IKKE_VURDERT, kodeverk: 'test' },
          periode: { fom: '2020-12-30', tom: '2021-02-28' },
        },
      ],
    },
    {
      vilkarType: { kode: vilkarType.BEREGNINGSGRUNNLAGVILKARET, kodeverk: 'test' },
      overstyrbar: true,
      perioder: [
        {
          merknadParametere: {},
          vilkarStatus: { kode: vilkarUtfallType.IKKE_VURDERT, kodeverk: 'test' },
          periode: { fom: '2020-12-30', tom: '2021-02-28' },
        },
      ],
    },
    {
      vilkarType: { kode: vilkarType.MEDLEMSKAPSVILKARET, kodeverk: 'test' },
      overstyrbar: true,
      perioder: [
        {
          merknadParametere: {},
          vilkarStatus: { kode: vilkarUtfallType.IKKE_VURDERT, kodeverk: 'test' },
          periode: { fom: '2020-12-30', tom: '2021-02-28' },
        },
      ],
    },
    {
      vilkarType: { kode: vilkarType.MEDISINSKEVILKÅR_UNDER_18_ÅR, kodeverk: 'test' },
      overstyrbar: true,
      perioder: [
        {
          merknadParametere: {},
          vilkarStatus: { kode: vilkarUtfallType.IKKE_VURDERT, kodeverk: 'test' },
          periode: { fom: '2020-12-30', tom: '2021-02-28' },
        },
      ],
    },
    {
      vilkarType: { kode: vilkarType.OPPTJENINGSVILKARET, kodeverk: 'test' },
      overstyrbar: true,
      perioder: [
        {
          merknadParametere: {},
          vilkarStatus: { kode: vilkarUtfallType.IKKE_VURDERT, kodeverk: 'test' },
          periode: { fom: '2020-12-30', tom: '2021-02-28' },
        },
      ],
    },
    {
      vilkarType: { kode: vilkarType.OMSORGENFORVILKARET, kodeverk: 'test' },
      overstyrbar: true,
      perioder: [
        {
          merknadParametere: {},
          vilkarStatus: { kode: vilkarUtfallType.IKKE_VURDERT, kodeverk: 'test' },
          periode: { fom: '2020-12-30', tom: '2021-02-28' },
        },
      ],
    },
    {
      vilkarType: { kode: vilkarType.SOKNADSFRISTVILKARET, kodeverk: 'test' },
      overstyrbar: true,
      perioder: [
        {
          merknadParametere: {},
          vilkarStatus: { kode: vilkarUtfallType.IKKE_VURDERT, kodeverk: 'test' },
          periode: { fom: '2020-12-30', tom: '2021-02-28' },
        },
      ],
    },
  ];

  const soknad = {
    fodselsdatoer: {
      0: '2019-01-01',
    } as Record<number, string>,
    antallBarn: 1,
    soknadType: {
      kode: soknadType.FODSEL,
      kodeverk: 'test',
    },
  } as Soknad;

  const arbeidsgiverOpplysningerPerId = {
    123: {
      erPrivatPerson: false,
      identifikator: 'testId',
      navn: 'testNavn',
      arbeidsforholdreferanser: [],
    },
  };

  const fetchedData: Partial<FetchedData> = {
    aksjonspunkter,
    vilkar,
    soknad,
  };

  it('skal vise alle aktuelle prosessSteg i meny', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const wrapper = shallow(
      <PleiepengerProsess
        data={fetchedData as FetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{
          [kodeverkTyper.AVSLAGSARSAK]: [],
        }}
        rettigheter={rettigheter}
        valgtProsessSteg="inngangsvilkar"
        valgtFaktaSteg="arbeidsforhold"
        hasFetchError={false}
        oppdaterBehandlingVersjon={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        opneSokeside={sinon.spy()}
        setBehandling={sinon.spy()}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={{}}
        setBeregningErBehandlet={() => {}}
        lagreOverstyringUttak={sinon.spy()}
      />,
    );

    const meny = wrapper.find(ProsessStegContainer);
    expect(meny.prop('formaterteProsessStegPaneler')).toEqual([
      {
        labelId: 'Behandlingspunkt.Inngangsvilkar',
        isActive: true,
        isDisabled: false,
        isFinished: false,
        type: 'default',
        usePartialStatus: false,
      },
      {
        labelId: 'Behandlingspunkt.MedisinskVilkar',
        isActive: false,
        isDisabled: false,
        isFinished: false,
        type: 'default',
        usePartialStatus: false,
      },
      {
        labelId: 'Behandlingspunkt.InngangsvilkarForts',
        isActive: false,
        isDisabled: false,
        isFinished: false,
        type: 'default',
        usePartialStatus: false,
      },
      {
        labelId: 'Behandlingspunkt.Beregning',
        isActive: false,
        isDisabled: false,
        isFinished: false,
        type: 'default',
        usePartialStatus: false,
      },
      {
        labelId: 'Behandlingspunkt.Uttak',
        isActive: false,
        isDisabled: false,
        isFinished: false,
        type: 'default',
        usePartialStatus: false,
      },
      {
        labelId: 'Behandlingspunkt.TilkjentYtelse',
        isActive: false,
        isDisabled: false,
        isFinished: false,
        type: 'default',
        usePartialStatus: false,
      },
      {
        labelId: 'Behandlingspunkt.Avregning',
        isActive: false,
        isDisabled: false,
        isFinished: false,
        type: 'default',
        usePartialStatus: false,
      },
      {
        labelId: 'Behandlingspunkt.Vedtak',
        isActive: false,
        isDisabled: false,
        isFinished: false,
        type: 'default',
        usePartialStatus: false,
      },
    ]);
  });

  it('skal sette nytt valgt prosessSteg ved trykk i meny', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const wrapper = shallow(
      <PleiepengerProsess
        data={fetchedData as FetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{
          [kodeverkTyper.AVSLAGSARSAK]: [],
        }}
        rettigheter={rettigheter}
        valgtProsessSteg="default"
        valgtFaktaSteg="default"
        hasFetchError={false}
        oppdaterBehandlingVersjon={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        opneSokeside={sinon.spy()}
        setBehandling={sinon.spy()}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={{}}
        setBeregningErBehandlet={() => {}}
        lagreOverstyringUttak={sinon.spy()}
      />,
    );

    const meny = wrapper.find(ProsessStegContainer);

    meny.prop('velgProsessStegPanelCallback')(2);

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0].args).toHaveLength(2);
    expect(opppdaterKall[0].args[0]).toEqual('opptjening');
    expect(opppdaterKall[0].args[1]).toEqual('default');
  });

  it('skal vise fatter vedtak modal etter lagring når aksjonspunkt er FORESLA_VEDTAK og så lukke denne og gå til søkeside', async () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const vedtakAksjonspunkter = [
      {
        definisjon: { kode: aksjonspunktCodes.FORESLA_VEDTAK, kodeverk: 'test' },
        status: { kode: aksjonspunktStatus.OPPRETTET, kodeverk: 'test' },
        kanLoses: true,
        erAktivt: true,
      },
    ];
    const vedtakBehandling = {
      ...behandling,
      status: { kode: behandlingStatus.FATTER_VEDTAK, kodeverk: 'test' },
    };

    requestPleiepengerApi.mock(PleiepengerBehandlingApiKeys.DOKUMENTDATA_LAGRE, undefined);

    const opneSokeside = sinon.spy();

    const customFetchedData: Partial<FetchedData> = {
      aksjonspunkter: vedtakAksjonspunkter,
      vilkar,
      soknad,
    };

    const wrapper = shallow(
      <PleiepengerProsess
        data={customFetchedData as FetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={vedtakBehandling as Behandling}
        alleKodeverk={{
          [kodeverkTyper.AVSLAGSARSAK]: [],
        }}
        rettigheter={rettigheter}
        valgtProsessSteg="default"
        valgtFaktaSteg="default"
        hasFetchError={false}
        oppdaterBehandlingVersjon={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        opneSokeside={opneSokeside}
        setBehandling={sinon.spy()}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={{}}
        setBeregningErBehandlet={() => {}}
        lagreOverstyringUttak={sinon.spy()}
      />,
    );

    const modal = wrapper.find(FatterVedtakStatusModal);
    expect(modal.prop('visModal')).toBe(false);

    const panel = wrapper.find(ProsessStegPanel);
    (
      await panel.prop('lagringSideeffekterCallback')([
        { kode: aksjonspunktCodes.FORESLA_VEDTAK, isVedtakSubmission: true },
      ])
    )();

    const oppdatertModal = wrapper.find(FatterVedtakStatusModal);
    expect(oppdatertModal.prop('visModal')).toBe(true);

    oppdatertModal.prop('lukkModal')();

    const opppdaterKall = opneSokeside.getCalls();
    expect(opppdaterKall).toHaveLength(1);
  });

  it('skal vise iverksetter vedtak modal etter lagring når aksjonspunkt er FATTER_VEDTAK og så lukke denne og gå til søkeside', async () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const vedtakAksjonspunkter = [
      {
        definisjon: { kode: aksjonspunktCodes.FATTER_VEDTAK, kodeverk: 'test' },
        status: { kode: aksjonspunktStatus.OPPRETTET, kodeverk: 'test' },
        kanLoses: true,
        erAktivt: true,
      },
    ];

    requestPleiepengerApi.mock(PleiepengerBehandlingApiKeys.DOKUMENTDATA_LAGRE, undefined);

    const opneSokeside = sinon.spy();

    const customFetchedData: Partial<FetchedData> = {
      aksjonspunkter: vedtakAksjonspunkter,
      vilkar,
      soknad,
    };

    const wrapper = shallow(
      <PleiepengerProsess
        data={customFetchedData as FetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{
          [kodeverkTyper.AVSLAGSARSAK]: [],
        }}
        rettigheter={rettigheter}
        valgtProsessSteg="default"
        valgtFaktaSteg="default"
        hasFetchError={false}
        oppdaterBehandlingVersjon={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        opneSokeside={opneSokeside}
        setBehandling={sinon.spy()}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={{}}
        setBeregningErBehandlet={() => {}}
        lagreOverstyringUttak={sinon.spy()}
      />,
    );

    const modal = wrapper.find(IverksetterVedtakStatusModal);
    expect(modal.prop('visModal')).toBe(false);

    const panel = wrapper.find(ProsessStegPanel);
    (
      await panel.prop('lagringSideeffekterCallback')([
        { kode: aksjonspunktCodes.FATTER_VEDTAK, isVedtakSubmission: true },
      ])
    )();

    const oppdatertModal = wrapper.find(IverksetterVedtakStatusModal);
    expect(oppdatertModal.prop('visModal')).toBe(true);

    oppdatertModal.prop('lukkModal')();

    const opppdaterKall = opneSokeside.getCalls();
    expect(opppdaterKall).toHaveLength(1);
  });

  it('skal gå til søkeside når en har revurderingsaksjonspunkt', async () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const vedtakAksjonspunkter = [
      {
        definisjon: { kode: aksjonspunktCodes.VARSEL_REVURDERING_MANUELL, kodeverk: 'test' },
        status: { kode: aksjonspunktStatus.OPPRETTET, kodeverk: 'test' },
        kanLoses: true,
        erAktivt: true,
      },
    ];

    const opneSokeside = sinon.spy();

    const customFetchedData: Partial<FetchedData> = {
      aksjonspunkter: vedtakAksjonspunkter,
      vilkar,
      soknad,
    };

    const wrapper = shallow(
      <PleiepengerProsess
        data={customFetchedData as FetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{
          [kodeverkTyper.AVSLAGSARSAK]: [],
        }}
        rettigheter={rettigheter}
        valgtProsessSteg="default"
        valgtFaktaSteg="default"
        hasFetchError={false}
        oppdaterBehandlingVersjon={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        opneSokeside={opneSokeside}
        setBehandling={sinon.spy()}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={{}}
        setBeregningErBehandlet={() => {}}
        lagreOverstyringUttak={sinon.spy()}
      />,
    );

    const panel = wrapper.find(ProsessStegPanel);
    (
      await panel.prop('lagringSideeffekterCallback')([
        { kode: aksjonspunktCodes.VARSEL_REVURDERING_MANUELL, sendVarsel: true },
      ])
    )();

    const opppdaterKall = opneSokeside.getCalls();
    expect(opppdaterKall).toHaveLength(1);
  });

  it('skal gå til neste panel i prosess etter løst aksjonspunkt', async () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const wrapper = shallow(
      <PleiepengerProsess
        data={fetchedData as FetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{
          [kodeverkTyper.AVSLAGSARSAK]: [],
        }}
        rettigheter={rettigheter}
        valgtProsessSteg="default"
        valgtFaktaSteg="default"
        hasFetchError={false}
        oppdaterBehandlingVersjon={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        opneSokeside={sinon.spy()}
        setBehandling={sinon.spy()}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={{}}
        setBeregningErBehandlet={() => {}}
        lagreOverstyringUttak={sinon.spy()}
      />,
    );

    const panel = wrapper.find(ProsessStegPanel);
    (
      await panel.prop('lagringSideeffekterCallback')([
        { kode: aksjonspunktCodes.SVANGERSKAPSVILKARET, sendVarsel: true },
      ])
    )();

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0].args).toHaveLength(2);
    expect(opppdaterKall[0].args[0]).toEqual('default');
    expect(opppdaterKall[0].args[1]).toEqual('default');
  });

  it('skal legge til forhåndsvisningsfunksjon i prosess-steget til vedtak', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    requestPleiepengerApi.mock(PleiepengerBehandlingApiKeys.PREVIEW_MESSAGE, undefined);
    const wrapper = shallow(
      <PleiepengerProsess
        data={fetchedData as FetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{
          [kodeverkTyper.AVSLAGSARSAK]: [],
        }}
        rettigheter={rettigheter}
        valgtProsessSteg="vedtak"
        valgtFaktaSteg="default"
        hasFetchError={false}
        oppdaterBehandlingVersjon={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        opneSokeside={sinon.spy()}
        setBehandling={sinon.spy()}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={{}}
        setBeregningErBehandlet={() => {}}
        lagreOverstyringUttak={sinon.spy()}
      />,
    );

    const panel = wrapper.find(ProsessStegPanel);
    expect(panel.prop('valgtProsessSteg').getUrlKode()).toEqual('vedtak');
    const forhandsvisCallback = panel.prop('valgtProsessSteg').getDelPaneler()[0].getKomponentData().previewCallback;
    expect(forhandsvisCallback).not.toBeNull();

    forhandsvisCallback({ param: 'test' });

    const requestData = requestPleiepengerApi.getRequestMockData(PleiepengerBehandlingApiKeys.PREVIEW_MESSAGE);
    expect(requestData).toHaveLength(1);
    expect(requestData[0].params).toEqual({
      aktørId: undefined,
      avsenderApplikasjon: 'K9SAK',
      eksternReferanse: undefined,
      param: 'test',
      saksnummer: '123456',
      ytelseType: fagsak.sakstype,
    });
  });

  it('skal legge til forhåndsvisningsfunksjon i prosess-steget til simulering', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    requestPleiepengerApi.mock(PleiepengerBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE, undefined);
    const wrapper = shallow(
      <PleiepengerProsess
        data={fetchedData as FetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{
          [kodeverkTyper.AVSLAGSARSAK]: [],
        }}
        rettigheter={rettigheter}
        valgtProsessSteg="simulering"
        valgtFaktaSteg="default"
        hasFetchError={false}
        oppdaterBehandlingVersjon={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        opneSokeside={sinon.spy()}
        setBehandling={sinon.spy()}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={{}}
        setBeregningErBehandlet={() => {}}
        lagreOverstyringUttak={sinon.spy()}
      />,
    );

    const panel = wrapper.find(ProsessStegPanel);
    expect(panel.prop('valgtProsessSteg').getUrlKode()).toEqual('simulering');
    const forhandsvisCallback = panel
      .prop('valgtProsessSteg')
      .getDelPaneler()[0]
      .getKomponentData().previewFptilbakeCallback;
    expect(forhandsvisCallback).not.toBeNull();

    forhandsvisCallback({ param: 'test' });

    const requestData = requestPleiepengerApi.getRequestMockData(
      PleiepengerBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE,
    );
    expect(requestData).toHaveLength(1);
    expect(requestData[0].params).toEqual({
      behandlingUuid: undefined,
      brevmalkode: undefined,
      fagsakYtelseType: fagsak.sakstype,
      mottaker: {
        param: 'test',
      },
      saksnummer: undefined,
      varseltekst: '',
    });
  });
});

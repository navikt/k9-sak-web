import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import {
  FatterVedtakStatusModal,
  IverksetterVedtakStatusModal,
  ProsessStegContainer,
  ProsessStegPanel,
} from '@k9-sak-web/behandling-felles';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { Behandling } from '@k9-sak-web/types';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import { requestUtvidetRettApi, UtvidetRettBehandlingApiKeys } from '../../data/utvidetRettBehandlingApi';
import FetchedData from '../../types/fetchedDataTsType';
import UtvidetRettProsess from '../UtvidetRettProsess';
import utvidetRettTestData from './utvidetRettTestData';

const { aksjonspunkter, arbeidsgiverOpplysningerPerId, behandling, fagsak, fagsakPerson, rettigheter, vilkar, soknad } =
  utvidetRettTestData;

describe('<UtvidetRettProsess>', () => {
  const fetchedData: Partial<FetchedData> = {
    aksjonspunkter,
    vilkar,
    rammevedtak: [],
    soknad,
  };

  it('skal vise alle aktuelle prosessSteg i meny', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const wrapper = shallow(
      <UtvidetRettProsess
        data={fetchedData as FetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling}
        alleKodeverk={{}}
        rettigheter={rettigheter}
        valgtProsessSteg="inngangsvilkar"
        valgtFaktaSteg="uttak"
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        oppdaterBehandlingVersjon={sinon.spy()}
        opneSokeside={sinon.spy()}
        hasFetchError={false}
        apentFaktaPanelInfo={{ urlCode: 'default', textCode: 'default' }}
        setBehandling={sinon.spy()}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={{}}
      />,
    );

    const meny = wrapper.find(ProsessStegContainer);
    const formaterteProsessStegPaneler = meny.prop('formaterteProsessStegPaneler');
    expect(formaterteProsessStegPaneler).toEqual([
      {
        labelId: 'Behandlingspunkt.OmsorgenFor',
        isActive: true,
        isDisabled: false,
        isFinished: false,
        usePartialStatus: false,
        type: 'default',
      },
      {
        labelId: 'Behandlingspunkt.UtvidetRett',
        isActive: false,
        isDisabled: false,
        isFinished: false,
        usePartialStatus: false,
        type: 'default',
      },
      {
        labelId: 'Behandlingspunkt.Vedtak',
        isActive: false,
        isDisabled: false,
        isFinished: false,
        usePartialStatus: false,
        type: 'default',
      },
    ]);
  });

  it('skal sette nytt valgt prosessSteg ved trykk i meny', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const wrapper = shallow(
      <UtvidetRettProsess
        data={fetchedData as FetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling}
        alleKodeverk={{}}
        rettigheter={rettigheter}
        valgtProsessSteg="inngangsvilkar"
        valgtFaktaSteg="default"
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        oppdaterBehandlingVersjon={sinon.spy()}
        opneSokeside={sinon.spy()}
        hasFetchError={false}
        apentFaktaPanelInfo={{ urlCode: 'default', textCode: 'default' }}
        setBehandling={sinon.spy()}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={{}}
      />,
    );

    const meny = wrapper.find(ProsessStegContainer);

    meny.prop('velgProsessStegPanelCallback')(1);

    const oppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(oppdaterKall).toHaveLength(1);
    expect(oppdaterKall[0].args[0]).toEqual('utvidet_rett');
  });

  it('skal vise fatter vedtak modal etter lagring når aksjonspunkt er FORESLA_VEDTAK og så lukke denne og gå til søkeside', async () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const vedtakAksjonspunkter = [
      {
        definisjon: aksjonspunktCodes.FORESLA_VEDTAK,
        status: aksjonspunktStatus.OPPRETTET,
        kanLoses: true,
        erAktivt: true,
      },
    ];

    const vedtakBehandling = {
      ...behandling,
      status: behandlingStatus.FATTER_VEDTAK,
    };

    requestUtvidetRettApi.mock(UtvidetRettBehandlingApiKeys.DOKUMENTDATA_LAGRE, undefined);

    const opneSokeside = sinon.spy();

    const customFetchedData: Partial<FetchedData> = {
      aksjonspunkter: vedtakAksjonspunkter,
      vilkar,
      soknad,
    };

    const wrapper = shallow(
      <UtvidetRettProsess
        data={customFetchedData as FetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={vedtakBehandling as Behandling}
        alleKodeverk={{
          [kodeverkTyper.AVSLAGSARSAK]: [],
        }}
        rettigheter={rettigheter}
        valgtProsessSteg="vedtak"
        valgtFaktaSteg="default"
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        oppdaterBehandlingVersjon={sinon.spy()}
        opneSokeside={opneSokeside}
        hasFetchError={false}
        apentFaktaPanelInfo={{ urlCode: 'vedtak', textCode: 'vedtak' }}
        setBehandling={sinon.spy()}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={{}}
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

  it('skal vise fatter vedtak modal etter lagring når aksjonspunkt er FATTER_VEDTAK og så lukke denne og gå til søkeside', async () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const vedtakAksjonspunkter = [
      {
        definisjon: aksjonspunktCodes.FATTER_VEDTAK,
        status: aksjonspunktStatus.OPPRETTET,
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
      <UtvidetRettProsess
        data={customFetchedData as FetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{
          [kodeverkTyper.AVSLAGSARSAK]: [],
        }}
        rettigheter={rettigheter}
        valgtProsessSteg="vedtak"
        valgtFaktaSteg="default"
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        oppdaterBehandlingVersjon={sinon.spy()}
        opneSokeside={opneSokeside}
        hasFetchError={false}
        apentFaktaPanelInfo={{ urlCode: 'vedtak', textCode: 'vedtak' }}
        setBehandling={sinon.spy()}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={{}}
      />,
    );

    const modal = wrapper.find(FatterVedtakStatusModal);
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

    const oppdatereKall = opneSokeside.getCalls();
    expect(oppdatereKall).toHaveLength(1);
  });

  it('skal gå til neste panel i prosess etter løst aksjonspunkt', async () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const wrapper = shallow(
      <UtvidetRettProsess
        data={fetchedData as FetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        rettigheter={rettigheter}
        valgtProsessSteg="inngangsvilkar"
        valgtFaktaSteg="default"
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        oppdaterBehandlingVersjon={sinon.spy()}
        opneSokeside={sinon.spy()}
        hasFetchError={false}
        apentFaktaPanelInfo={{ urlCode: 'default', textCode: 'default' }}
        setBehandling={sinon.spy()}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={{}}
      />,
    );

    const panel = wrapper.find(ProsessStegPanel);
    (await panel.prop('lagringSideeffekterCallback')([{ kode: aksjonspunktCodes.UTVIDET_RETT, sendVarsel: true }]))();

    const oppdatereKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(oppdatereKall).toHaveLength(1);
    expect(oppdatereKall[0].args).toHaveLength(2);
    expect(oppdatereKall[0].args[0]).toEqual('default');
    expect(oppdatereKall[0].args[1]).toEqual('default');
  });

  it('skal legge til forhåndsvisningsfunksjon i prosess-steget til vedtak', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    requestUtvidetRettApi.mock(UtvidetRettBehandlingApiKeys.PREVIEW_MESSAGE, undefined);
    const wrapper = shallow(
      <UtvidetRettProsess
        data={fetchedData as FetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        rettigheter={rettigheter}
        valgtProsessSteg="vedtak"
        valgtFaktaSteg="default"
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        oppdaterBehandlingVersjon={sinon.spy()}
        opneSokeside={sinon.spy()}
        hasFetchError={false}
        apentFaktaPanelInfo={{ urlCode: 'default', textCode: 'default' }}
        setBehandling={sinon.spy()}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={{}}
      />,
    );

    const panel = wrapper.find(ProsessStegPanel);
    expect(panel.prop('valgtProsessSteg').getUrlKode()).toEqual('vedtak');
    const forhandsvisCallback = panel.prop('valgtProsessSteg').getDelPaneler()[0].getKomponentData().previewCallback;
    expect(forhandsvisCallback).not.toBeNull();

    forhandsvisCallback({ param: 'test' });

    const requestData = requestUtvidetRettApi.getRequestMockData(UtvidetRettBehandlingApiKeys.PREVIEW_MESSAGE);
    expect(requestData).toHaveLength(1);
    expect(requestData[0].params).toEqual({
      aktørId: undefined,
      avsenderApplikasjon: 'K9SAK',
      eksternReferanse: undefined,
      param: 'test',
      saksnummer: '111111',
      ytelseType: fagsak.sakstype,
    });
  });
});

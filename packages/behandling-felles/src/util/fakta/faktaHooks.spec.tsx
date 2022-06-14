/* eslint-disable class-methods-use-this */
import React from 'react';
import { IntlShape } from 'react-intl';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { Behandling, Fagsak } from '@k9-sak-web/types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import ArbeidsforholdFaktaIndex from '@fpsak-frontend/fakta-arbeidsforhold';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import FaktaPanelDef from './FaktaPanelDef';
import faktaHooks from './faktaHooks';
import FaktaPanelUtledet from './FaktaPanelUtledet';
import { DEFAULT_FAKTA_KODE } from './faktaUtils';

const HookWrapper = ({ callback }) => <div {...callback()} />;

const testHook = callback => shallow(<HookWrapper callback={callback} />);

describe('<faktaHooks>', () => {
  const fagsak = {
    saksnummer: '123456',
    sakstype: fagsakYtelseType.FORELDREPENGER,
    status: fagsakStatus.UNDER_BEHANDLING,
  } as Fagsak;
  const behandling = {
    id: 1,
    versjon: 2,
    status: behandlingStatus.BEHANDLING_UTREDES,
    type: behandlingType.FORSTEGANGSSOKNAD,
    behandlingPaaVent: false,
    taskStatus: {
      readOnly: false,
    },
    behandlingHenlagt: false,
    links: [],
  };

  class TestFaktaPanelDef extends FaktaPanelDef {
    getUrlKode = () => faktaPanelCodes.ARBEIDSFORHOLD;

    getTekstKode = () => 'ArbeidsforholdInfoPanel.Title';

    getAksjonspunktKoder = () => [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD];

    getKomponent = props => <ArbeidsforholdFaktaIndex {...props} />;

    getOverstyrVisningAvKomponent = ({ personopplysninger }) => personopplysninger;

    getData = ({ personopplysninger, arbeidsforhold }) => ({ personopplysninger, arbeidsforhold });
  }

  it('skal utlede faktapaneler og valgt panel', () => {
    const panelDef = new TestFaktaPanelDef();
    const ekstraPanelData = {
      personopplysninger: 'test_personopplysninger',
      arbeidsforhold: 'test_arbeidsforhold',
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
        definisjon: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
        status: aksjonspunktStatus.OPPRETTET,
        kanLoses: true,
        erAktivt: true,
      },
    ];
    const valgtFaktaSteg = 'default';
    const intl = { formatMessage: data => data.id } as IntlShape;

    const wrapper = testHook(() =>
      faktaHooks.useFaktaPaneler(
        [panelDef],
        ekstraPanelData,
        behandling as Behandling,
        rettigheter,
        aksjonspunkter,
        valgtFaktaSteg,
        intl,
      ),
    );
    const [faktaPaneler, valgtPanel, formaterteFaktaPaneler] = Object.values(wrapper.find('div').props()).reduce(
      (acc, value) => [...acc, value],
      [],
    );

    expect(faktaPaneler[0].getPanelDef()).toEqual(panelDef);
    expect(faktaPaneler[0].getHarApneAksjonspunkter()).toBe(true);
    expect(faktaPaneler[0].getKomponentData(rettigheter, ekstraPanelData, false)).toEqual({
      aksjonspunkter: [aksjonspunkter[0]],
      readOnly: false,
      submittable: true,
      harApneAksjonspunkter: true,
      alleMerknaderFraBeslutter: {
        [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD]: { notAccepted: undefined },
      },
      personopplysninger: ekstraPanelData.personopplysninger,
      arbeidsforhold: ekstraPanelData.arbeidsforhold,
    });

    expect(valgtPanel.getUrlKode()).toEqual(faktaPaneler[0].getUrlKode());
    expect(formaterteFaktaPaneler).toEqual([
      {
        erAktiv: true,
        harAksjonspunkt: true,
        tekst: 'ArbeidsforholdInfoPanel.Title',
      },
    ]);
  });

  it('skal bruke callbacks for å velge faktapanel og for å lagre', () => {
    const aksjonspunkter = [
      {
        definisjon: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
        status: aksjonspunktStatus.OPPRETTET,
        kanLoses: true,
        erAktivt: true,
      },
    ];

    const panelDef = new TestFaktaPanelDef();

    const panelUtledet = new FaktaPanelUtledet(panelDef, aksjonspunkter, behandling);

    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const lagreAksjonspunkter = sinon.stub();
    lagreAksjonspunkter.returns(Promise.resolve());
    const overstyringApCodes = [];
    const valgtProsessSteg = 'default';

    const wrapper = testHook(() =>
      faktaHooks.useCallbacks(
        [panelUtledet],
        fagsak,
        behandling as Behandling,
        oppdaterProsessStegOgFaktaPanelIUrl,
        valgtProsessSteg,
        overstyringApCodes,
        lagreAksjonspunkter,
      ),
    );
    const [velgFaktaPanelCallback, bekreftAksjonspunktCallback] = Object.values(wrapper.find('div').props()).reduce(
      (acc, value) => [...acc, value],
      [],
    );

    velgFaktaPanelCallback(0);

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0].args).toHaveLength(2);
    expect(opppdaterKall[0].args[0]).toEqual(DEFAULT_FAKTA_KODE);
    expect(opppdaterKall[0].args[1]).toEqual('arbeidsforhold');

    const aksjonspunkterSomSkalLagres = [
      {
        kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
      },
    ];
    bekreftAksjonspunktCallback(aksjonspunkterSomSkalLagres);

    const requestKall = lagreAksjonspunkter.getCalls();
    expect(requestKall).toHaveLength(1);
    expect(requestKall[0].args).toHaveLength(2);
    expect(requestKall[0].args[0]).toEqual({
      saksnummer: fagsak.saksnummer,
      behandlingId: behandling.id,
      behandlingVersjon: behandling.versjon,
      bekreftedeAksjonspunktDtoer: [
        {
          '@type': aksjonspunkter[0].definisjon,
          kode: aksjonspunkter[0].definisjon,
        },
      ],
    });
  });
});

/* eslint-disable class-methods-use-this */
import ArbeidsforholdFaktaIndex from '@fpsak-frontend/fakta-arbeidsforhold';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { Behandling } from '@k9-sak-web/types';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import FaktaPanelDef from './FaktaPanelDef';
import FaktaPanelUtledet from './FaktaPanelUtledet';
import faktaHooks from './faktaHooks';
import { DEFAULT_FAKTA_KODE } from './faktaUtils';

describe('<faktaHooks>', () => {
  const fagsak = {
    saksnummer: '123456',
    sakstype: fagsakYtelsesType.OMP,
    status: fagsakStatus.UNDER_BEHANDLING,
  };
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

    const { result } = renderHook(() =>
      faktaHooks.useFaktaPaneler(
        [panelDef],
        ekstraPanelData,
        behandling as Behandling,
        rettigheter,
        aksjonspunkter,
        valgtFaktaSteg,
      ),
    );
    const faktaPanel = result.current[0][0];
    const valgtPanel = result.current[1];
    const formaterteFaktaPaneler = result.current[2];

    expect(faktaPanel.faktaPanelDef).toEqual(panelDef);
    expect(faktaPanel.getHarApneAksjonspunkter()).toBe(true);
    expect(faktaPanel.getKomponentData(rettigheter, ekstraPanelData, false)).toEqual({
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

    expect(valgtPanel.getUrlKode()).toEqual(faktaPanel.getUrlKode());
    expect(formaterteFaktaPaneler).toEqual([
      {
        erAktiv: true,
        harAksjonspunkt: true,
        tekstKode: 'ArbeidsforholdInfoPanel.Title',
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

    const oppdaterProsessStegOgFaktaPanelIUrl = vi.fn();
    const lagreAksjonspunkter = vi.fn().mockImplementation(() => Promise.resolve());

    const overstyringApCodes = [];
    const valgtProsessSteg = 'default';

    const { result } = renderHook(() =>
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
    const velgFaktaPanelCallback = result.current[0];
    const bekreftAksjonspunktCallback = result.current[1];

    velgFaktaPanelCallback(0);

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.mock.calls;
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0]).toHaveLength(2);
    expect(opppdaterKall[0][0]).toEqual(DEFAULT_FAKTA_KODE);
    expect(opppdaterKall[0][1]).toEqual('arbeidsforhold');

    const aksjonspunkterSomSkalLagres = [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD];
    bekreftAksjonspunktCallback(aksjonspunkterSomSkalLagres);

    const requestKall = lagreAksjonspunkter.mock.calls;
    expect(requestKall).toHaveLength(1);
    expect(requestKall[0]).toHaveLength(2);
    expect(requestKall[0][0]).toEqual({
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

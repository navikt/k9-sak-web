import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import { ProsessStegContainer } from '@k9-sak-web/behandling-felles';
import { Behandling, Fagsak, KlageVurdering } from '@k9-sak-web/types';

import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import KlageProsess from './KlageProsess';

describe('<KlageProsess>', () => {
  const fagsak = {
    saksnummer: '123456',
    sakstype: fagsakYtelseType.FORELDREPENGER,
    status: fagsakStatus.UNDER_BEHANDLING,
  } as Fagsak;

  const fagsakPerson = {
    alder: 30,
    personstatusType: personstatusType.BOSATT,
    erDod: false,
    erKvinne: true,
    navn: 'Espen Utvikler',
    personnummer: '12345',
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
      definisjon: aksjonspunktCodes.AUTOMATISK_MARKERING_AV_UTENLANDSSAK,
      status: aksjonspunktStatus.OPPRETTET,
      kanLoses: true,
      erAktivt: true,
    },
  ];
  const klageVurdering = {
    klageVurderingResultatNK: {
      klageVurdertAv: 'Espen Utvikler',
      godkjentAvMedunderskriver: false,
    },
    klageVurderingResultatNFP: {
      klageVurdertAv: 'Espen Utvikler',
      godkjentAvMedunderskriver: false,
    },
    klageFormkravResultatKA: {
      avvistArsaker: [],
    },
    klageFormkravResultatNFP: {
      avvistArsaker: [],
    },
  } as KlageVurdering;

  // it('skal vise alle aktuelle prosessSteg i meny', () => {
  //   const wrapper = shallow(
  //     <KlageProsess
  //       data={{ aksjonspunkter, klageVurdering }}
  //       fagsak={fagsak}
  //       fagsakPerson={fagsakPerson}
  //       behandling={behandling as Behandling}
  //       alleKodeverk={{}}
  //       arbeidsgiverOpplysningerPerId={{}}
  //       alleBehandlinger={[]}
  //       rettigheter={rettigheter}
  //       valgtProsessSteg="default"
  //       oppdaterBehandlingVersjon={sinon.spy()}
  //       oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
  //       opneSokeside={sinon.spy()}
  //       setBehandling={sinon.spy()}
  //       featureToggles={{}}
  //     />,
  //   );

  //   const meny = wrapper.find(ProsessStegContainer);
  //   expect(meny.prop('formaterteProsessStegPaneler')).toEqual([
  //     {
  //       isActive: false,
  //       isDisabled: false,
  //       isFinished: false,
  //       labelId: 'Behandlingspunkt.FormkravKlageNFP',
  //       type: 'default',
  //       usePartialStatus: false,
  //     },
  //     {
  //       isActive: false,
  //       isDisabled: false,
  //       isFinished: false,
  //       labelId: 'Behandlingspunkt.CheckKlageNFP',
  //       type: 'default',
  //       usePartialStatus: false,
  //     },
  //     {
  //       isActive: false,
  //       isDisabled: false,
  //       isFinished: false,
  //       labelId: 'Behandlingspunkt.ResultatKlage',
  //       type: 'default',
  //       usePartialStatus: false,
  //     },
  //   ]);
  // });

  it('skal vise alle aktuelle prosessSteg i meny (frisinn)', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const wrapper = shallow(
      <KlageProsess
        data={{ aksjonspunkter, klageVurdering }}
        fagsak={{ ...fagsak, sakstype: fagsakYtelseType.FRISINN }}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        arbeidsgiverOpplysningerPerId={{}}
        alleBehandlinger={[]}
        rettigheter={rettigheter}
        valgtProsessSteg="default"
        oppdaterBehandlingVersjon={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        opneSokeside={sinon.spy()}
        setBehandling={sinon.spy()}
        featureToggles={{}}
      />,
    );

    const meny = wrapper.find(ProsessStegContainer);
    expect(meny.prop('formaterteProsessStegPaneler')).toEqual([
      {
        isActive: false,
        isDisabled: false,
        isFinished: false,
        labelId: 'Behandlingspunkt.FormkravKlageNFP',
        type: 'default',
        usePartialStatus: false,
      },
      {
        isActive: false,
        isDisabled: false,
        isFinished: false,
        labelId: 'Behandlingspunkt.CheckKlageNFP',
        type: 'default',
        usePartialStatus: false,
      },
      {
        isActive: false,
        isDisabled: false,
        isFinished: false,
        labelId: 'Behandlingspunkt.FormkravKlageKA',
        type: 'default',
        usePartialStatus: false,
      },
      {
        isActive: false,
        isDisabled: false,
        isFinished: false,
        labelId: 'Behandlingspunkt.CheckKlageNK',
        type: 'default',
        usePartialStatus: false,
      },
      {
        isActive: false,
        isDisabled: false,
        isFinished: false,
        labelId: 'Behandlingspunkt.ResultatKlage',
        type: 'default',
        usePartialStatus: false,
      },
    ]);
  });

  it('skal sette nytt valgt prosessSteg ved trykk i meny (frisinn)', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const wrapper = shallow(
      <KlageProsess
        data={{ aksjonspunkter, klageVurdering }}
        fagsak={{ ...fagsak, sakstype: fagsakYtelseType.FRISINN }}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        arbeidsgiverOpplysningerPerId={{}}
        alleBehandlinger={[]}
        rettigheter={rettigheter}
        valgtProsessSteg="default"
        oppdaterBehandlingVersjon={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        opneSokeside={sinon.spy()}
        setBehandling={sinon.spy()}
        featureToggles={{}}
      />,
    );

    const meny = wrapper.find(ProsessStegContainer);

    meny.prop('velgProsessStegPanelCallback')(2);

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0].args).toHaveLength(2);
    expect(opppdaterKall[0].args[0]).toEqual('formkrav_klage_nav_klageinstans');
  });

  // it('skal sette nytt valgt prosessSteg ved trykk i meny', () => {
  //   const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
  //   const wrapper = shallow(
  //     <KlageProsess
  //       data={{ aksjonspunkter, klageVurdering }}
  //       fagsak={fagsak}
  //       fagsakPerson={fagsakPerson}
  //       behandling={behandling as Behandling}
  //       alleKodeverk={{}}
  //       arbeidsgiverOpplysningerPerId={{}}
  //       alleBehandlinger={[]}
  //       rettigheter={rettigheter}
  //       valgtProsessSteg="default"
  //       oppdaterBehandlingVersjon={sinon.spy()}
  //       oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
  //       opneSokeside={sinon.spy()}
  //       setBehandling={sinon.spy()}
  //       featureToggles={{}}
  //     />,
  //   );

  //   const meny = wrapper.find(ProsessStegContainer);

  //   meny.prop('velgProsessStegPanelCallback')(2);

  //   const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
  //   expect(opppdaterKall).toHaveLength(1);
  //   expect(opppdaterKall[0].args).toHaveLength(2);
  //   expect(opppdaterKall[0].args[0]).toEqual('resultat');
  // });
});

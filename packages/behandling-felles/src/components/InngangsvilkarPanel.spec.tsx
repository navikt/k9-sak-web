/* eslint-disable class-methods-use-this */
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { FormattedMessage } from 'react-intl';
import { Column } from 'nav-frontend-grid';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Behandling } from '@k9-sak-web/types';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { AksjonspunktHelpTextHTML } from '@fpsak-frontend/shared-components';

import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import { ProsessStegDef, ProsessStegPanelDef } from '../util/prosessSteg/ProsessStegDef';
import { ProsessStegPanelUtledet } from '../util/prosessSteg/ProsessStegUtledet';
import InngangsvilkarPanel from './InngangsvilkarPanel';

describe('<InngangsvilkarPanel>', () => {
  const behandling = {
    id: 1,
    versjon: 1,
    status: behandlingStatus.BEHANDLING_UTREDES,
    type: behandlingType.FORSTEGANGSSOKNAD,
    behandlingPaaVent: false,
    behandlingHenlagt: false,
    links: [],
  };

  const kanOverstyreAccess = { isEnabled: false, employeeHasAccess: false };

  const aksjonspunkter = [
    {
      definisjon: aksjonspunktCodes.AVKLAR_AKTIVITETER,
      status: aksjonspunktStatus.OPPRETTET,
      kanLoses: true,
      erAktivt: true,
    },
  ];

  const lagPanelDef = (id, aksjonspunktKoder, aksjonspunktTekstKoder) => {
    class PanelDef extends ProsessStegPanelDef {
      getId = () => id;

      getKomponent = props => <div {...props} />;

      getAksjonspunktKoder = () => aksjonspunktKoder;

      getAksjonspunktTekstkoder = () => aksjonspunktTekstKoder;
    }
    return new PanelDef();
  };

  const lagStegDef = (urlKode, panelDef) => {
    class StegPanelDef extends ProsessStegDef {
      getUrlKode = () => urlKode;

      getTekstKode = () => urlKode;

      getPanelDefinisjoner = () => [panelDef];
    }
    return new StegPanelDef();
  };

  it('skal vise inngangsvilkår-panel med fødsel, medlemskap og opptjening', () => {
    const isReadOnlyCheck = () => false;
    const toggleOverstyring = () => undefined;

    const fodselPanelDef = lagPanelDef('FODSEL', [aksjonspunktCodes.AVKLAR_AKTIVITETER], ['FODSEL.TEKST']);
    const fodselStegDef = lagStegDef('FODSEL', fodselPanelDef);
    const utledetFodselDelPanel = new ProsessStegPanelUtledet(
      fodselStegDef,
      fodselPanelDef,
      isReadOnlyCheck,
      aksjonspunkter,
      [],
      {},
      toggleOverstyring,
      kanOverstyreAccess,
      [],
    );

    const medlemskapPanelDef = lagPanelDef('MEDLSEMSKAP', [], ['MEDLSEMSKAP.TEKST']);
    const medlemskapStegDef = lagStegDef('MEDLSEMSKAP', medlemskapPanelDef);
    const utledetMedlemskapDelPanel = new ProsessStegPanelUtledet(
      medlemskapStegDef,
      medlemskapPanelDef,
      isReadOnlyCheck,
      [],
      [],
      {},
      toggleOverstyring,
      kanOverstyreAccess,
      [],
    );

    const opptjeningPanelDef = lagPanelDef('OPPTJENING', [], ['OPPTJENING.TEKST']);
    const opptjeningStegDef = lagStegDef('OPPTJENING', opptjeningPanelDef);
    const utledetOpptjeningDelPanel = new ProsessStegPanelUtledet(
      opptjeningStegDef,
      opptjeningPanelDef,
      isReadOnlyCheck,
      [],
      [],
      {},
      toggleOverstyring,
      kanOverstyreAccess,
      [],
    );

    const prosessStegData = [utledetFodselDelPanel, utledetMedlemskapDelPanel, utledetOpptjeningDelPanel];

    const wrapper = shallow(
      <InngangsvilkarPanel
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        prosessStegData={prosessStegData}
        submitCallback={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        useMultipleRestApi={() => ({ data: undefined, state: RestApiState.SUCCESS })}
      />,
    );

    const helpText = wrapper.find(AksjonspunktHelpTextHTML);
    expect(helpText).toHaveLength(1);
    const text = wrapper.find(FormattedMessage);
    expect(text).toHaveLength(1);
    expect(text.prop('id')).toEqual(['FODSEL.TEKST']);

    const columns = wrapper.find(Column);
    expect(columns).toHaveLength(2);
    const column1children = columns.first().children();
    expect(column1children).toHaveLength(2);
    const column2children = columns.last().children();
    expect(column2children).toHaveLength(1);
  });

  it('skal vise aksjonspunkt-hjelpetekst med lenke for avventing av fakta-aksjonspunkt', () => {
    const isReadOnlyCheck = () => false;
    const toggleOverstyring = () => undefined;

    const fodselPanelDef = lagPanelDef('FODSEL', [aksjonspunktCodes.AVKLAR_AKTIVITETER], ['FODSEL.TEKST']);
    const fodselStegDef = lagStegDef('FODSEL', fodselPanelDef);
    const utledetFodselDelPanel = new ProsessStegPanelUtledet(
      fodselStegDef,
      fodselPanelDef,
      isReadOnlyCheck,
      aksjonspunkter,
      [],
      {},
      toggleOverstyring,
      kanOverstyreAccess,
      [],
    );

    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();

    const wrapper = shallow(
      <InngangsvilkarPanel
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        prosessStegData={[utledetFodselDelPanel]}
        submitCallback={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        apentFaktaPanelInfo={{
          urlCode: 'MEDLEMSKAP',
          textCode: 'FAKTA_APENT',
        }}
        useMultipleRestApi={() => ({ data: undefined, state: RestApiState.SUCCESS })}
      />,
    );

    const helpText = wrapper.find(AksjonspunktHelpTextHTML);
    expect(helpText).toHaveLength(1);
    const text = wrapper.find(FormattedMessage);
    expect(text).toHaveLength(2);
    expect(text.first().prop('id')).toEqual('InngangsvilkarPanel.AvventerAvklaringAv');
    expect(text.last().prop('id')).toEqual('FAKTA_APENT');

    const lenke = wrapper.find('a');
    lenke.simulate('click', { preventDefault: () => undefined });

    const oppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(oppdaterKall).toHaveLength(1);
    expect(oppdaterKall[0].args).toHaveLength(2);
    expect(oppdaterKall[0].args[0]).toBeUndefined();
    expect(oppdaterKall[0].args[1]).toEqual('MEDLEMSKAP');
  });
});

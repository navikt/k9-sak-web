import React from 'react';
import sinon from 'sinon';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { SideMenuWrapper } from '@k9-sak-web/behandling-felles';
import { Behandling } from '@k9-sak-web/types';
import FaktaRammevedtakIndex from '@k9-sak-web/fakta-barn-og-overfoeringsdager';
import UtvidetRettFakta from '../UtvidetRettFakta';
import FetchedData from '../../types/fetchedDataTsType';
import utvidetRettTestData from './utvidetRettTestData';

const { aksjonspunkter, behandling, fagsak, fagsakPerson, rettigheter, vilkar, rammevedtak } = utvidetRettTestData;

describe('<UtvidetRettFakta>', () => {
  it('skal rendre faktapaneler og sidemeny korrekt', () => {
    const fetchedData: Partial<FetchedData> = {
      aksjonspunkter,
      vilkar,
      rammevedtak,
    };

    const wrapper = shallowWithIntl(
      <UtvidetRettFakta.WrappedComponent
        intl={intlMock}
        data={fetchedData as FetchedData}
        behandling={behandling as Behandling}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        rettigheter={rettigheter}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        valgtFaktaSteg="default"
        valgtProsessSteg="default"
        hasFetchError={false}
        setApentFaktaPanel={sinon.spy()}
        setBehandling={sinon.spy()}
        featureToggles={{}}
        arbeidsgiverOpplysningerPerId={{}}
      />,
    );

    const panel = wrapper.find(SideMenuWrapper);
    expect(panel.prop('paneler')[0].tekst).toEqual('Registrerte rammemeldinger');
    expect(panel.prop('paneler')[1].tekst).toEqual('Barn');
    expect(panel.prop('paneler')).toEqual([
      {
        erAktiv: true,
        harAksjonspunkt: false,
        tekst: 'Registrerte rammemeldinger',
      },
      {
        erAktiv: false,
        harAksjonspunkt: false,
        tekst: 'Barn',
      },
    ]);
  });

  it('skal oppdatere url ved valg av faktapanel', () => {
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const fetchedData: Partial<FetchedData> = {
      aksjonspunkter,
      vilkar,
      rammevedtak,
    };

    const wrapper = shallowWithIntl(
      <UtvidetRettFakta.WrappedComponent
        intl={intlMock}
        data={fetchedData as FetchedData}
        behandling={behandling as Behandling}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        rettigheter={rettigheter}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        valgtFaktaSteg="default"
        valgtProsessSteg="default"
        hasFetchError={false}
        setApentFaktaPanel={sinon.spy()}
        setBehandling={sinon.spy()}
        featureToggles={{}}
        arbeidsgiverOpplysningerPerId={{}}
      />,
    );

    const panel = wrapper.find(SideMenuWrapper);

    panel.prop('onClick')(1);
    const calls = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(calls).toHaveLength(1);
    const { args } = calls[0];
    expect(args).toHaveLength(2);
    expect(args[0]).toEqual('default');
    expect(args[1]).toEqual('barn');
  });

  it('skal rendre faktapanel korrekt', () => {
    const fetchedData: Partial<FetchedData> = {
      aksjonspunkter,
      vilkar,
      rammevedtak,
    };

    const wrapper = shallowWithIntl(
      <UtvidetRettFakta.WrappedComponent
        intl={intlMock}
        data={fetchedData as FetchedData}
        behandling={behandling as Behandling}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        rettigheter={rettigheter}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        valgtFaktaSteg="default"
        valgtProsessSteg="default"
        hasFetchError={false}
        setApentFaktaPanel={sinon.spy()}
        setBehandling={sinon.spy()}
        featureToggles={{}}
        arbeidsgiverOpplysningerPerId={{}}
      />,
    );

    const registrerteRammemeldingerPanel = wrapper.find(FaktaRammevedtakIndex);
    expect(registrerteRammemeldingerPanel.prop('readOnly')).toBe(false);
    expect(registrerteRammemeldingerPanel.prop('submittable')).toBe(true);
    expect(registrerteRammemeldingerPanel.prop('harApneAksjonspunkter')).toBe(false);
  });
});

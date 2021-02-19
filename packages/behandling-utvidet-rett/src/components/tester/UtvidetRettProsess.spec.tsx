import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { Behandling } from '@k9-sak-web/types';
import { ProsessStegContainer } from '@k9-sak-web/behandling-felles';

import utvidetRettTestData from './DataTilTester';
import FetchedData from '../../types/fetchedDataTsType';
import UtvidetRettProsess from '../UtvidetRettProsess';

const {
  aksjonspunkter,
  arbeidsgiverOpplysningerPerId,
  behandling,
  fagsak,
  fagsakPerson,
  forbrukteDager,
  rettigheter,
  vilkar,
} = utvidetRettTestData;

describe('<UtvidetRettProsess>', () => {
  const fetchedData: Partial<FetchedData> = {
    aksjonspunkter,
    vilkar,
    forbrukteDager,
  };

  it('skal vise alle aktuelle prosessSteg i meny', () => {
    const wrapper = shallow(
      <UtvidetRettProsess
        data={fetchedData}
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
        apentFaktaPanelInfo={sinon.spy()}
        setBehandling={sinon.spy()}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={{}}
      />,
    );

    const meny = wrapper.find(ProsessStegContainer);
    const formaterteProsessStegPaneler = meny.prop('formaterteProsessStegPaneler');

    expect(formaterteProsessStegPaneler).toEqual([
      {
        labelId: 'Behandlingspunkt.Inngangsvilkar',
        isActive: true,
        isDisabled: false,
        isFinished: true,
        usePartialStatus: false,
        type: 'success',
      },
      {
        labelId: 'Behandlingspunkt.UtvidetRett',
        isActive: false,
        isDisabled: false,
        isFinished: true,
        usePartialStatus: false,
        type: 'success',
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
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const wrapper = shallow(
      <UtvidetRettProsess
        data={fetchedData as FetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{}}
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
      />,
    );

    const meny = wrapper.find(ProsessStegContainer);

    console.log(meny.prop('velgProsessStegPanelCallback')(2));
    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    console.log(opppdaterKall);
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0].args).toHaveLength(2);
    expect(opppdaterKall[0].args[0]).toEqual('uttak');
    expect(opppdaterKall[0].args[1]).toEqual('default');
  });
});

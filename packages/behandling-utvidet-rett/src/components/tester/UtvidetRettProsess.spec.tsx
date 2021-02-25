import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { ProsessStegContainer } from '@k9-sak-web/behandling-felles';
import utvidetRettTestData from './utvidetRettTestData';
import FetchedData from '../../types/fetchedDataTsType';
import UtvidetRettProsess from '../UtvidetRettProsess';

const {
  aksjonspunkter,
  arbeidsgiverOpplysningerPerId,
  behandling,
  fagsak,
  fagsakPerson,
  rettigheter,
  vilkar,
  rammevedtak,
  soknad,
} = utvidetRettTestData;

describe('<UtvidetRettProsess>', () => {
  const fetchedData: Partial<FetchedData> = {
    aksjonspunkter,
    vilkar,
    rammevedtak,
    soknad,
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
});

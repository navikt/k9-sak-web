import React from 'react';
import { shallow } from 'enzyme';
import { Select as NavSelect } from 'nav-frontend-skjema';
import Lenke from 'nav-frontend-lenker';
import RelatertFagsak from './RelatertFagsak';

describe('<RelatertFagsak>', () => {
  const relaterteFagsakerEnSøker = {
    relaterteSøkere: [
      { søkerIdent: '17499944012', søkerNavn: 'SJØLØVE ANINE', saksnummer: '5YD0i', åpenBehandling: true },
    ],
  };

  const relaterteFagsakerFlereSøkere = {
    relaterteSøkere: [
      { søkerIdent: '12345678910', søkerNavn: 'Sjøløve Anine', saksnummer: '5YD0i', åpenBehandling: true },
      { søkerIdent: '10987654321', søkerNavn: 'Kreps Svein', saksnummer: '5YD1W', åpenBehandling: true },
    ],
  };

  it('skal vise relatert søker dersom bare én relatert søker', () => {
    const wrapper = shallow(<RelatertFagsak relaterteFagsakerResponse={relaterteFagsakerEnSøker} />);

    expect(wrapper.find(NavSelect)).toHaveLength(0);
    const lenke = wrapper.find(Lenke);
    const { søkerNavn } = relaterteFagsakerEnSøker.relaterteSøkere[0];
    expect(lenke.childAt(0).childAt(0).text()).toEqual(søkerNavn);
  });

  it('skal vise select dersom flere relaterte søkere', () => {
    const wrapper = shallow(<RelatertFagsak relaterteFagsakerResponse={relaterteFagsakerFlereSøkere} />);

    expect(wrapper.find(NavSelect)).toHaveLength(1);
    expect(wrapper.find('option')).toHaveLength(2);

    const lenke = wrapper.find(Lenke);
    expect(lenke.childAt(0).text()).toEqual('Åpne sak');
  });
});

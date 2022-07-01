import React from 'react';
import { shallow } from 'enzyme';
import { Normaltekst } from 'nav-frontend-typografi';
import Faresignaler from './Faresignaler';

const mockRisikoklassifisering = (medlSignaler, iaySignaler) => ({
  kontrollresultat: 'HOY',
  medlFaresignaler: {
    faresignaler: medlSignaler,
  },
  iayFaresignaler: {
    faresignaler: iaySignaler,
  },
});

describe('<Faresignaler>', () => {
  it('skal teste at komponent mountes korrekt når vi har faresignaler i medl kategorien', () => {
    const wrapper = shallow(
      <Faresignaler
        risikoklassifisering={mockRisikoklassifisering(['Dette er en grunn', 'Dette er en annen grunn'], undefined)}
      />,
    );
    const formattedMessage = wrapper.find('MemoizedFormattedMessage');
    expect(formattedMessage).toHaveLength(1);
    expect(formattedMessage.prop('id')).toEqual('Risikopanel.Panel.Medlemskap');

    const normaltekst = wrapper.find(Normaltekst);
    expect(normaltekst).toHaveLength(2);
    expect(normaltekst.children().at(0).text()).toEqual('Dette er en grunn');
    expect(normaltekst.children().at(1).text()).toEqual('Dette er en annen grunn');
  });

  it('skal teste at komponent mountes korrekt når vi har faresignaler i iay kategorien', () => {
    const wrapper = shallow(
      <Faresignaler
        risikoklassifisering={mockRisikoklassifisering(undefined, ['Dette er en grunn', 'Dette er en annen grunn'])}
      />,
    );
    const formattedMessage = wrapper.find('MemoizedFormattedMessage');
    expect(formattedMessage).toHaveLength(1);
    expect(formattedMessage.prop('id')).toEqual('Risikopanel.Panel.ArbeidsforholdInntekt');

    const normaltekst = wrapper.find(Normaltekst);
    expect(normaltekst).toHaveLength(2);
    expect(normaltekst.children().at(0).text()).toEqual('Dette er en grunn');
    expect(normaltekst.children().at(1).text()).toEqual('Dette er en annen grunn');
  });

  it('skal teste at komponent mountes korrekt når vi har faresignaler i begge kategorier', () => {
    const wrapper = shallow(
      <Faresignaler risikoklassifisering={mockRisikoklassifisering(['Grunn 1', 'Grunn 2'], ['Grunn 3', 'Grunn 4'])} />,
    );
    const formattedMessage = wrapper.find('MemoizedFormattedMessage');
    expect(formattedMessage).toHaveLength(2);

    const normaltekst = wrapper.find(Normaltekst);
    expect(normaltekst).toHaveLength(4);
    expect(normaltekst.children().at(0).text()).toEqual('Grunn 1');
    expect(normaltekst.children().at(1).text()).toEqual('Grunn 2');
    expect(normaltekst.children().at(2).text()).toEqual('Grunn 3');
    expect(normaltekst.children().at(3).text()).toEqual('Grunn 4');
  });
});

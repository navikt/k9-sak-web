import React from 'react';
import { shallow } from 'enzyme';
import Panel from 'nav-frontend-paneler';
import { FormattedMessage } from 'react-intl';
import DeltBosted from './DeltBosted';
import Barn from '../../types/Barn';

it('rendrer delt bosted panel med rett info', () => {
  const periode = {
    fom: '2020-01-01',
    tom: '2020-12-31',
  };

  const barn: Barn = {
    fødselsnummer: '12312312312',
    deltBosted: periode,
    fosterbarn: periode,
  };

  const wrapper = shallow(<DeltBosted barnet={barn} index={0} />);
  expect(wrapper.find(Panel)).toHaveLength(1);

  const elementerMedFormatterTekstId = tekstId =>
    wrapper.find(FormattedMessage).filterWhere(formatert => formatert.prop('id') === tekstId);

  const elementerMedTypeOchText = (nodeType, tekst) =>
    wrapper.findWhere(node => {
      return node.name() === nodeType && node.text() === tekst;
    });

  const deltBostedVisning = elementerMedFormatterTekstId('FaktaRammevedtak.Barn.DeltBosted');
  const fosterbarn = elementerMedFormatterTekstId('FaktaRammevedtak.Barn.Fosterbarn');
  const fodselsnummer = elementerMedTypeOchText('span', barn.fødselsnummer);

  expect(deltBostedVisning).toHaveLength(1);
  expect(fosterbarn).toHaveLength(0);
  expect(fodselsnummer).toHaveLength(1);
});

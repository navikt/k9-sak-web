import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Panel from 'nav-frontend-paneler';
import { FormattedMessage } from 'react-intl';
import BarnVisning from './BarnVisning';
import Barn from '../types/Barn';

it('rendrer panel om barnet med rett info', () => {
  const periode = {
    fom: '2020-01-01',
    tom: '2020-12-31',
  };
  const barn: Barn = {
    fødselsnummer: '12312312312',
    kroniskSykdom: periode,
    fosterbarn: periode,
  };

  const wrapper = shallow(<BarnVisning barnet={barn} index={0} />);

  expect(wrapper.find(Panel)).to.have.length(1);

  const elementerMedFormatterTekstId = tekstId =>
    wrapper.find(FormattedMessage).filterWhere(formatert => formatert.prop('id') === tekstId);

  const kroniskSykdomVisning = elementerMedFormatterTekstId('FaktaRammevedtak.Barn.UtvidetRett');
  const aleneomsorgvisning = elementerMedFormatterTekstId('FaktaRammevedtak.Barn.Aleneomsorg');
  const fosterbarn = elementerMedFormatterTekstId('FaktaRammevedtak.Barn.Fosterbarn');

  expect(kroniskSykdomVisning).to.have.length(1);
  expect(aleneomsorgvisning).to.have.length(0);
  expect(fosterbarn).to.have.length(1);
});

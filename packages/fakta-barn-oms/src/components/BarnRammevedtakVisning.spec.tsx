import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import BarnRammevedtakVisning from './BarnRammevedtakVisning';
import KombinertBarnOgRammevedtak from '../dto/KombinertBarnOgRammevedtak';

it('rendrer panel om barnet med rett info', () => {
  const periode = {
    fom: '2020-01-01',
    tom: '2020-12-31',
  };
  const barn: KombinertBarnOgRammevedtak = {
    personIdent: '',
    rammevedtak: {
      personIdent: '12312312312',
      kroniskSykdom: [periode],
      fosterbarn: periode,
    },
  };

  const wrapper = shallow(<BarnRammevedtakVisning barnet={barn} />);

  const elementerMedFormatterTekstId = tekstId =>
    wrapper.find(FormattedMessage).filterWhere(formatert => formatert.prop('id') === tekstId);

  const kroniskSykdomVisning = elementerMedFormatterTekstId('FaktaRammevedtak.Barn.UtvidetRett');
  const aleneomsorgvisning = elementerMedFormatterTekstId('FaktaRammevedtak.Barn.Aleneomsorg');
  const fosterbarn = elementerMedFormatterTekstId('FaktaRammevedtak.Barn.Fosterbarn');

  expect(kroniskSykdomVisning).toHaveLength(1);
  expect(aleneomsorgvisning).toHaveLength(0);
  expect(fosterbarn).toHaveLength(1);
});

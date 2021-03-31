import React from 'react';
import { shallow } from 'enzyme';
import Panel from 'nav-frontend-paneler';
import { FormattedMessage } from 'react-intl';
import { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import BarnVisning from './BarnVisning';
import KombinertBarnOgRammevedtak from '../dto/KombinertBarnOgRammevedtak';

it('<BarnVisning>', () => {
  const barn: KombinertBarnOgRammevedtak = {
    personIdent: '150915',
    barnRelevantIBehandling: {
      personIdent: '150915',
      fødselsdato: '2013-08-31',
      dødsdato: null,
      harSammeBosted: true,
      barnType: BarnType.VANLIG,
    },
    rammevedtak: {
      personIdent: '150915',
      kroniskSykdom: [
        {
          fom: '2021-03-17',
          tom: '2033-12-31',
        },
        {
          fom: '2033-03-17',
          tom: '2066-12-31',
        },
      ],
    },
  };

  const wrapper = shallow(<BarnVisning barnet={barn} index={0} />);

  expect(wrapper.find(Panel)).toHaveLength(1);

  const elementerMedFormatterTekstId = tekstId =>
    wrapper.find(FormattedMessage).filterWhere(formatert => formatert.prop('id') === tekstId);

  const kroniskSykdomVisning = elementerMedFormatterTekstId('FaktaRammevedtak.Barn.UtvidetRett');
  const aleneomsorgvisning = elementerMedFormatterTekstId('FaktaRammevedtak.Barn.Aleneomsorg');
  const sammaBosted = elementerMedFormatterTekstId('FaktaBarn.BorMedSøker');

  expect(kroniskSykdomVisning).toHaveLength(1);
  expect(sammaBosted).toHaveLength(1);
  expect(aleneomsorgvisning).toHaveLength(0);
});

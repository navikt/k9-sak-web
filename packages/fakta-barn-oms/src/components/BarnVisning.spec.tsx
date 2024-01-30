import React from 'react';
import { shallow } from 'enzyme';
import Panel from 'nav-frontend-paneler';
import { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import moment from 'moment';
import BarnVisning from './BarnVisning';
import KombinertBarnOgRammevedtak from '../dto/KombinertBarnOgRammevedtak';
import BarnRammevedtakVisning from './BarnRammevedtakVisning';
import BarnInformasjonVisning from './BarnInformasjonVisning';

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

  const barnetsAlderVedValgtDato = moment('2014-09-01')
    .diff(barn.barnRelevantIBehandling.fødselsdato, 'years')
    .toString();
  expect(barnetsAlderVedValgtDato).toBe('1');

  const barnetsAlderIdag = moment().diff(barn.barnRelevantIBehandling.fødselsdato, 'years').toString();

  const wrapper = shallow(<BarnVisning barnet={barn} index={0} />);
  expect(wrapper.find('span').text().includes(barn.barnRelevantIBehandling.personIdent)).toBe(true);
  expect(wrapper.find('span').text().includes(barnetsAlderIdag)).toBe(true);

  expect(wrapper.find(Panel)).toHaveLength(1);
  expect(wrapper.find(BarnInformasjonVisning)).toHaveLength(1);
  expect(wrapper.find(BarnRammevedtakVisning)).toHaveLength(1);
});

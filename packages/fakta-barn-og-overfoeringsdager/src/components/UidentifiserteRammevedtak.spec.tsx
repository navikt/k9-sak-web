import React from 'react';
import { expect } from 'chai';
import Rammevedtak, { RammevedtakEnum } from '../dto/Rammevedtak';
import { shallowWithIntl } from '../../i18n/intl-enzyme-test-helper-fakta-rammevedtak';
import UidentifiserteRammevedtak from './UidentifiserteRammevedtak';

describe('<UidentifiserteRammevedtak>', () => {
  const utvidetRettManglendeFnr: Rammevedtak = {
    type: RammevedtakEnum.UTVIDET_RETT,
    gyldigFraOgMed: '2020-01-01',
    gyldigTilOgMed: '2028-12-31',
    fritekst: '@9-6 2 L UTV.OMSD*20/',
  };

  const aleneOmOmsorgenManglendeFnr: Rammevedtak = {
    type: RammevedtakEnum.ALENEOMSORG,
    gyldigFraOgMed: '2020-01-01',
    gyldigTilOgMed: '2020-12-31',
    fritekst: '@9-6 2 L AL.OMSD*10/',
  };

  const fosterbarnManglendeFnr: Rammevedtak = {
    type: RammevedtakEnum.FOSTERBARN,
    gyldigFraOgMed: '2020-01-01',
    gyldigTilOgMed: '2020-12-31',
    fritekst: '@9-6 2 L FOST/',
  };

  it('rendrer uidentifiserte vedtak for gitte kriterier', () => {
    const rammevedtak: Rammevedtak[] = [
      utvidetRettManglendeFnr,
      utvidetRettManglendeFnr,
      utvidetRettManglendeFnr,
      aleneOmOmsorgenManglendeFnr,
      aleneOmOmsorgenManglendeFnr,
      fosterbarnManglendeFnr,
    ];

    const utvidetRett = shallowWithIntl(
      <UidentifiserteRammevedtak rammevedtak={rammevedtak} type={RammevedtakEnum.UTVIDET_RETT} />,
    );
    expect(utvidetRett.find('li')).to.have.length(3);

    const aleneomsorg = shallowWithIntl(
      <UidentifiserteRammevedtak rammevedtak={rammevedtak} type={RammevedtakEnum.ALENEOMSORG} />,
    );
    expect(aleneomsorg.find('li')).to.have.length(2);

    const fosterbarn = shallowWithIntl(
      <UidentifiserteRammevedtak rammevedtak={rammevedtak} type={RammevedtakEnum.FOSTERBARN} />,
    );
    expect(fosterbarn.find('li')).to.have.length(1);
  });
});

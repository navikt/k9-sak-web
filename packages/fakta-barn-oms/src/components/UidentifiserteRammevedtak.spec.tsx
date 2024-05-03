import { Rammevedtak, RammevedtakEnum } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
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

  const rammevedtak: Rammevedtak[] = [
    utvidetRettManglendeFnr,
    utvidetRettManglendeFnr,
    utvidetRettManglendeFnr,
    aleneOmOmsorgenManglendeFnr,
    aleneOmOmsorgenManglendeFnr,
    fosterbarnManglendeFnr,
  ];

  it('rendrer uidentifiserte vedtak for gitte kriterier 1', () => {
    renderWithIntl(<UidentifiserteRammevedtak rammevedtak={rammevedtak} type={RammevedtakEnum.UTVIDET_RETT} />, {
      messages,
    });
    expect(screen.getAllByRole('listitem').length).toBe(3);
  });
  it('rendrer uidentifiserte vedtak for gitte kriterier 2', () => {
    renderWithIntl(<UidentifiserteRammevedtak rammevedtak={rammevedtak} type={RammevedtakEnum.ALENEOMSORG} />, {
      messages,
    });
    expect(screen.getAllByRole('listitem').length).toBe(2);
  });
  it('rendrer uidentifiserte vedtak for gitte kriterier 3', () => {
    renderWithIntl(<UidentifiserteRammevedtak rammevedtak={rammevedtak} type={RammevedtakEnum.FOSTERBARN} />, {
      messages,
    });
    expect(screen.getAllByRole('listitem').length).toBe(1);
  });
});

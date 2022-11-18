import React from 'react';
import { shallow } from 'enzyme';

import { TableColumn, TableRow } from '@fpsak-frontend/shared-components';

import TilbakekrevingVedtakPeriodeTabell from './TilbakekrevingVedtakPeriodeTabell';
import { BeregningResultatPeriode } from '../types/beregningsresultatTilbakekrevingTsType';

describe('<TilbakekrevingVedtakPeriodeTabell>', () => {
  it('skal lage tabell med to perioder og en sum-rad', () => {
    const perioder = [
      {
        periode: {
          fom: '2019-10-10',
          tom: '2019-12-10',
        },
        feilutbetaltBeløp: 15430,
        vurdering: 'SIMP',
        andelAvBeløp: 100,
        renterProsent: 10,
        tilbakekrevingBeløp: 15430,
        tilbakekrevingBeløpEtterSkatt: 14000,
      },
      {
        periode: {
          fom: '2019-05-10',
          tom: '2019-06-10',
        },
        feilutbetaltBeløp: 14000,
        vurdering: 'SIMP',
        andelAvBeløp: 50,
        tilbakekrevingBeløp: 7000,
        tilbakekrevingBeløpEtterSkatt: 6000,
      },
    ] as BeregningResultatPeriode[];
    const getKodeverknavn = () => 'Simpel uaktsomhet';

    const wrapper = shallow(
      <TilbakekrevingVedtakPeriodeTabell perioder={perioder} getKodeverknavn={getKodeverknavn} />,
    );

    const rader = wrapper.find(TableRow);
    expect(rader).toHaveLength(3);

    const kolonnerForPeriode1 = rader.first().find(TableColumn);
    expect(kolonnerForPeriode1).toHaveLength(7);
    expect(kolonnerForPeriode1.at(0).childAt(0).childAt(0).prop('dateStringFom')).toEqual('2019-10-10');
    expect(kolonnerForPeriode1.at(0).childAt(0).childAt(0).prop('dateStringTom')).toEqual('2019-12-10');
    expect(kolonnerForPeriode1.at(1).childAt(0).childAt(0).text()).toEqual('15 430');
    expect(kolonnerForPeriode1.at(2).childAt(0).childAt(0).text()).toEqual('Simpel uaktsomhet');
    expect(kolonnerForPeriode1.at(3).childAt(0).childAt(0).text()).toEqual('100%');
    expect(kolonnerForPeriode1.at(4).childAt(0).childAt(0).text()).toEqual('10%');
    expect(kolonnerForPeriode1.at(5).childAt(0).childAt(0).text()).toEqual('15 430');
    expect(kolonnerForPeriode1.at(6).childAt(0).childAt(0).text()).toEqual('14 000');

    const kolonnerForPeriode2 = rader.at(1).find(TableColumn);
    expect(kolonnerForPeriode2).toHaveLength(7);
    expect(kolonnerForPeriode2.at(0).childAt(0).childAt(0).prop('dateStringFom')).toEqual('2019-05-10');
    expect(kolonnerForPeriode2.at(0).childAt(0).childAt(0).prop('dateStringTom')).toEqual('2019-06-10');
    expect(kolonnerForPeriode2.at(1).childAt(0).childAt(0).text()).toEqual('14 000');
    expect(kolonnerForPeriode2.at(2).childAt(0).childAt(0).text()).toEqual('Simpel uaktsomhet');
    expect(kolonnerForPeriode2.at(3).childAt(0).childAt(0).text()).toEqual('50%');
    expect(kolonnerForPeriode2.at(5).childAt(0).childAt(0).text()).toEqual('7 000');
    expect(kolonnerForPeriode2.at(6).childAt(0).childAt(0).text()).toEqual('6 000');

    const kolonnerForSum = rader.at(2).find(TableColumn);
    expect(kolonnerForSum).toHaveLength(7);
    expect(kolonnerForSum.at(0).childAt(0).childAt(0).prop('id')).toEqual('TilbakekrevingVedtakPeriodeTabell.Sum');
    expect(kolonnerForSum.at(1).childAt(0).childAt(0).text()).toEqual('29 430');
    expect(kolonnerForSum.at(5).childAt(0).childAt(0).text()).toEqual('22 430');
    expect(kolonnerForSum.at(6).childAt(0).childAt(0).text()).toEqual('20 000');
  });
});

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { TimeLineControl } from '@fpsak-frontend/tidslinje';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { PeriodeMedId, TilkjentYtelse } from './TilkjentYtelse';

describe('<TilkjentYtelse>', () => {
  it('skall innehålla korrekt antal felter', () => {
    const wrapper = shallow(
      <TilkjentYtelse
        items={
          [
            {
              id: 1,
              tom: '2018-10-01',
              fom: '2018-02-02',
              andeler: [
                {
                  arbeidsgiver: '973861778',
                  refusjon: 0,
                  sisteUtbetalingsdato: '2018-03-31',
                  tilSoker: 1846,
                  uttak: [
                    {
                      periodeResultatType: 'INNVILGET',
                    },
                  ],
                  utbetalingsgrad: 100,
                },
              ],
              group: 1,
            },
          ] as PeriodeMedId[]
        }
        groups={[]}
        intl={intlMock}
        alleKodeverk={{}}
      />,
    );
    expect(wrapper.find(TimeLineControl)).to.have.length(1);
  });
});

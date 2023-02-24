import React from 'react';
import { shallow } from 'enzyme';

import { TimeLineControl } from '@fpsak-frontend/tidslinje';
import { BeregningsresultatPeriodeAndel } from '@k9-sak-web/types';

import { PeriodeMedId, TilkjentYtelse } from './TilkjentYtelse';

import { intlMock } from '../../i18n';

describe('<TilkjentYtelse>', () => {
  it('skall innehålla korrekt antal felter', () => {
    const wrapper = shallow(
      <TilkjentYtelse
        items={
          [
            {
              tom: '2018-10-01',
              fom: '2018-02-02',
              dagsats: 10000,
              andeler: [
                {
                  inntektskategori: {
                    kode: 'ARBEIDSTAKER',
                    kodeverk: 'INNTEKTSKATEGORI',
                  },
                  aktørId: '',
                  arbeidsforholdType: {
                    kode: '',
                    kodeverk: '',
                  },
                  stillingsprosent: 100,
                  arbeidsgiver: '973861778',
                  arbeidsgiverOrgnr: '',
                  aktivitetStatus: {
                    kode: '',
                    kodeverk: '',
                  },
                  arbeidsforholdId: '',
                  eksternArbeidsforholdId: '',
                  arbeidsgiverNavn: '',
                  refusjon: 0,
                  sisteUtbetalingsdato: '2018-03-31',
                  tilSoker: 1846,
                  uttak: [
                    {
                      stonadskontoType: '',
                      periodeResultatType: 'INNVILGET',
                      gradering: false,
                    },
                  ],
                  utbetalingsgrad: 100,
                } as BeregningsresultatPeriodeAndel,
              ],
            },
          ] as PeriodeMedId[]
        }
        groups={[]}
        intl={intlMock}
        alleKodeverk={{}}
        arbeidsgiverOpplysningerPerId={{}}
      />,
    );
    expect(wrapper.find(TimeLineControl)).toHaveLength(1);
  });
});

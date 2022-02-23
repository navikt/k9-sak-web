import dayjs, { Dayjs } from 'dayjs';
import { PositionedPeriod } from '../../types/types.internal';
import { sisteDato, sistePeriode } from './sort';

const enDato = ({ plussDager = 0 } = {}): Dayjs => dayjs('2020-01-01').add(plussDager, 'day');

const enPosisjonertPeriode = ({ horizontalPosition = 50 } = {}): PositionedPeriod => ({
  id: 'id',
  status: 'suksess',
  start: dayjs(),
  endInclusive: dayjs(),
  width: 123,
  horizontalPosition,
  direction: 'left',
});

test('sisteDato', () => {
  const usortert = [
    enDato({ plussDager: 1 }),
    enDato(),
    enDato({ plussDager: 2 }),
    enDato(),
    enDato({ plussDager: 3 }),
  ];

  const sortert = [enDato({ plussDager: 3 }), enDato({ plussDager: 2 }), enDato({ plussDager: 1 }), enDato(), enDato()];

  expect(usortert.sort(sisteDato)).toEqual(sortert);
});

test('sistePeriode', () => {
  const usortert = [
    enPosisjonertPeriode({ horizontalPosition: 50 }),
    enPosisjonertPeriode({ horizontalPosition: 0 }),
    enPosisjonertPeriode({ horizontalPosition: 12 }),
    enPosisjonertPeriode({ horizontalPosition: 80 }),
    enPosisjonertPeriode({ horizontalPosition: 33 }),
  ];

  const sortert = [
    enPosisjonertPeriode({ horizontalPosition: 0 }),
    enPosisjonertPeriode({ horizontalPosition: 12 }),
    enPosisjonertPeriode({ horizontalPosition: 33 }),
    enPosisjonertPeriode({ horizontalPosition: 50 }),
    enPosisjonertPeriode({ horizontalPosition: 80 }),
  ];
  expect(usortert.sort(sistePeriode)).toEqual(sortert);
});

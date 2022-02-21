import { breddeMellomDatoer, erDelAv, erLike, horizontalPositionAndWidth, overlapper, position } from './calc';
import dayjs from 'dayjs';

const enPeriode = ({ start = dayjs('2020-01-01'), endInclusive = dayjs('2020-01-01') } = {}) => ({
    start,
    endInclusive
});

test('position', () => {
    expect(position(dayjs('2020-01-01'), dayjs('2020-01-01'), dayjs('2020-01-10'))).toEqual(0);
    expect(position(dayjs('2020-01-02'), dayjs('2020-01-01'), dayjs('2020-01-11'))).toEqual(10);
    expect(position(dayjs('2020-01-03'), dayjs('2020-01-01'), dayjs('2020-01-11'))).toEqual(20);
    expect(position(dayjs('2020-01-04'), dayjs('2020-01-01'), dayjs('2020-01-11'))).toEqual(30);
    expect(position(dayjs('2020-01-05'), dayjs('2020-01-01'), dayjs('2020-01-11'))).toEqual(40);
    expect(position(dayjs('2020-01-06'), dayjs('2020-01-01'), dayjs('2020-01-11'))).toEqual(50);
    expect(position(dayjs('2020-01-07'), dayjs('2020-01-01'), dayjs('2020-01-11'))).toEqual(60);
    expect(position(dayjs('2020-01-08'), dayjs('2020-01-01'), dayjs('2020-01-11'))).toEqual(70);
    expect(position(dayjs('2020-01-09'), dayjs('2020-01-01'), dayjs('2020-01-11'))).toEqual(80);
    expect(position(dayjs('2020-01-10'), dayjs('2020-01-01'), dayjs('2020-01-11'))).toEqual(90);
    expect(position(dayjs('2020-01-10'), dayjs('2020-01-01'), dayjs('2020-01-10'))).toEqual(100);
    expect(position(dayjs('2020-01-19'), dayjs('2020-01-01'), dayjs('2020-01-10'))).toEqual(200);
    expect(position(dayjs('2019-12-23'), dayjs('2020-01-01'), dayjs('2020-01-10'))).toEqual(-100);
});

test('horizontalPositionAndWidth', () => {
    expect(
        horizontalPositionAndWidth(dayjs('2020-01-01'), dayjs('2020-01-10'), dayjs('2020-01-01'), dayjs('2020-01-10'))
    ).toEqual({ horizontalPosition: 0, width: 100 });
    expect(
        horizontalPositionAndWidth(dayjs('2020-01-02'), dayjs('2020-01-10'), dayjs('2020-01-01'), dayjs('2020-01-11'))
    ).toEqual({ horizontalPosition: 10, width: 80 });
    expect(
        horizontalPositionAndWidth(dayjs('2020-01-03'), dayjs('2020-01-09'), dayjs('2020-01-01'), dayjs('2020-01-11'))
    ).toEqual({ horizontalPosition: 20, width: 60 });
    expect(
        horizontalPositionAndWidth(dayjs('2020-01-04'), dayjs('2020-01-08'), dayjs('2020-01-01'), dayjs('2020-01-11'))
    ).toEqual({ horizontalPosition: 30, width: 40 });
    expect(
        horizontalPositionAndWidth(dayjs('2020-01-05'), dayjs('2020-01-07'), dayjs('2020-01-01'), dayjs('2020-01-11'))
    ).toEqual({ horizontalPosition: 40, width: 20 });
    expect(
        horizontalPositionAndWidth(dayjs('2020-01-06'), dayjs('2020-01-06'), dayjs('2020-01-01'), dayjs('2020-01-11'))
    ).toEqual({ horizontalPosition: 50, width: 0 });
    expect(
        horizontalPositionAndWidth(dayjs('2020-01-02'), dayjs('2020-01-04'), dayjs('2020-01-01'), dayjs('2020-01-11'))
    ).toEqual({ horizontalPosition: 10, width: 20 });
    expect(
        horizontalPositionAndWidth(dayjs('2020-01-03'), dayjs('2020-01-05'), dayjs('2020-01-01'), dayjs('2020-01-11'))
    ).toEqual({ horizontalPosition: 20, width: 20 });
    expect(
        horizontalPositionAndWidth(dayjs('2020-01-04'), dayjs('2020-01-06'), dayjs('2020-01-01'), dayjs('2020-01-11'))
    ).toEqual({ horizontalPosition: 30, width: 20 });
    expect(
        horizontalPositionAndWidth(dayjs('2020-01-05'), dayjs('2020-01-07'), dayjs('2020-01-01'), dayjs('2020-01-11'))
    ).toEqual({ horizontalPosition: 40, width: 20 });
    expect(
        horizontalPositionAndWidth(dayjs('2020-01-06'), dayjs('2020-01-08'), dayjs('2020-01-01'), dayjs('2020-01-11'))
    ).toEqual({ horizontalPosition: 50, width: 20 });
    expect(
        horizontalPositionAndWidth(dayjs('2020-01-07'), dayjs('2020-01-09'), dayjs('2020-01-01'), dayjs('2020-01-11'))
    ).toEqual({ horizontalPosition: 60, width: 20 });
    expect(
        horizontalPositionAndWidth(dayjs('2020-01-08'), dayjs('2020-01-10'), dayjs('2020-01-01'), dayjs('2020-01-11'))
    ).toEqual({ horizontalPosition: 70, width: 20 });
});

test('breddeMellomDatoer', () => {
    expect(breddeMellomDatoer(dayjs('2020-01-01'), dayjs('2020-01-01'), 100)).toBe(0);
    expect(breddeMellomDatoer(dayjs('2020-01-01'), dayjs('2020-01-02'), 100)).toBe(1);
    expect(breddeMellomDatoer(dayjs('2020-01-01'), dayjs('2020-01-99'), 100)).toBe(97.95833333333333);
});

test('erLike', () => {
    expect(erLike(enPeriode(), enPeriode())).toBeTruthy();
    expect(erLike(enPeriode(), enPeriode({ endInclusive: dayjs('2020-01-02') }))).toBeFalsy();
    expect(
        erLike(
            enPeriode({
                start: dayjs('2021-03-04'),
                endInclusive: dayjs('2021-03-15')
            }),
            enPeriode({ start: dayjs('2021-03-04'), endInclusive: dayjs('2021-03-15') })
        )
    ).toBeTruthy();
});

test('erDelAv', () => {
    expect(erDelAv(enPeriode(), enPeriode())).toBeFalsy();
    expect(
        erDelAv(
            enPeriode({ endInclusive: dayjs('2020-01-04') }),
            enPeriode({ start: dayjs('2020-01-02'), endInclusive: dayjs('2020-01-03') })
        )
    ).toBeTruthy();
    expect(erDelAv(enPeriode(), enPeriode({ endInclusive: dayjs('2020-01-02') }))).toBeFalsy();
});

test('overlapper', () => {
    expect(overlapper(enPeriode(), enPeriode())).toBeTruthy();
    expect(overlapper(enPeriode(), enPeriode({ endInclusive: dayjs('2020-01-02') }))).toBeFalsy();
    expect(
        overlapper(
            enPeriode({
                start: dayjs('2021-03-04'),
                endInclusive: dayjs('2021-03-15')
            }),
            enPeriode({ start: dayjs('2021-03-04'), endInclusive: dayjs('2021-03-15') })
        )
    ).toBeTruthy();
    expect(
        overlapper(
            enPeriode({ endInclusive: dayjs('2020-01-04') }),
            enPeriode({ start: dayjs('2020-01-02'), endInclusive: dayjs('2020-01-03') })
        )
    ).toBeTruthy();
    expect(overlapper(enPeriode(), enPeriode({ endInclusive: dayjs('2020-01-02') }))).toBeFalsy();
});

import dayjs from 'dayjs';
import { horizontalPositionAndWidth, position } from './calc';

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
    horizontalPositionAndWidth(dayjs('2020-01-01'), dayjs('2020-01-10'), dayjs('2020-01-01'), dayjs('2020-01-10')),
  ).toEqual({ horizontalPosition: 0, width: 100 });
  expect(
    horizontalPositionAndWidth(dayjs('2020-01-02'), dayjs('2020-01-10'), dayjs('2020-01-01'), dayjs('2020-01-11')),
  ).toEqual({ horizontalPosition: 10, width: 80 });
  expect(
    horizontalPositionAndWidth(dayjs('2020-01-03'), dayjs('2020-01-09'), dayjs('2020-01-01'), dayjs('2020-01-11')),
  ).toEqual({ horizontalPosition: 20, width: 60 });
  expect(
    horizontalPositionAndWidth(dayjs('2020-01-04'), dayjs('2020-01-08'), dayjs('2020-01-01'), dayjs('2020-01-11')),
  ).toEqual({ horizontalPosition: 30, width: 40 });
  expect(
    horizontalPositionAndWidth(dayjs('2020-01-05'), dayjs('2020-01-07'), dayjs('2020-01-01'), dayjs('2020-01-11')),
  ).toEqual({ horizontalPosition: 40, width: 20 });
  expect(
    horizontalPositionAndWidth(dayjs('2020-01-06'), dayjs('2020-01-06'), dayjs('2020-01-01'), dayjs('2020-01-11')),
  ).toEqual({ horizontalPosition: 50, width: 0 });
  expect(
    horizontalPositionAndWidth(dayjs('2020-01-02'), dayjs('2020-01-04'), dayjs('2020-01-01'), dayjs('2020-01-11')),
  ).toEqual({ horizontalPosition: 10, width: 20 });
  expect(
    horizontalPositionAndWidth(dayjs('2020-01-03'), dayjs('2020-01-05'), dayjs('2020-01-01'), dayjs('2020-01-11')),
  ).toEqual({ horizontalPosition: 20, width: 20 });
  expect(
    horizontalPositionAndWidth(dayjs('2020-01-04'), dayjs('2020-01-06'), dayjs('2020-01-01'), dayjs('2020-01-11')),
  ).toEqual({ horizontalPosition: 30, width: 20 });
  expect(
    horizontalPositionAndWidth(dayjs('2020-01-05'), dayjs('2020-01-07'), dayjs('2020-01-01'), dayjs('2020-01-11')),
  ).toEqual({ horizontalPosition: 40, width: 20 });
  expect(
    horizontalPositionAndWidth(dayjs('2020-01-06'), dayjs('2020-01-08'), dayjs('2020-01-01'), dayjs('2020-01-11')),
  ).toEqual({ horizontalPosition: 50, width: 20 });
  expect(
    horizontalPositionAndWidth(dayjs('2020-01-07'), dayjs('2020-01-09'), dayjs('2020-01-01'), dayjs('2020-01-11')),
  ).toEqual({ horizontalPosition: 60, width: 20 });
  expect(
    horizontalPositionAndWidth(dayjs('2020-01-08'), dayjs('2020-01-10'), dayjs('2020-01-01'), dayjs('2020-01-11')),
  ).toEqual({ horizontalPosition: 70, width: 20 });
});

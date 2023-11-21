import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Dokumenttype } from '../../src/types/Dokument';
import createMockedDokumentelementLinks from './createMockedDokumentelementLinks';

dayjs.extend(utc);

export default [
  {
    id: '1',
    type: Dokumenttype.LEGEERKLÆRING,
    navn: 'Bar.pdf',
    datert: dayjs('2039-01-01').utc(true).toISOString(),
    links: createMockedDokumentelementLinks('1'),
  },
  {
    id: '2',
    type: Dokumenttype.LEGEERKLÆRING,
    navn: 'Baz.pdf',
    datert: dayjs('2039-01-01').utc(true).toISOString(),
    links: createMockedDokumentelementLinks('2'),
  },
];

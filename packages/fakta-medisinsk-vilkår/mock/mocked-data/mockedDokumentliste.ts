import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Dokumenttype } from '../../src/types/Dokument';
import createMockedDokumentelementLinks from './createMockedDokumentelementLinks';

dayjs.extend(utc);

export default [
  {
    id: '1',
    type: Dokumenttype.LEGEERKLÆRING,
    datert: dayjs('2020-01-16').utc(true).toISOString(),
    navn: 'Foobar-lala.pdf',
    benyttet: true,
    annenPartErKilde: false,
    fremhevet: true,
    behandlet: true,
    links: createMockedDokumentelementLinks('1'),
    mottattDato: '2021-03-05',
    mottattTidspunkt: '2021-03-05T10:23:13.309266',
  },
  {
    id: '2',
    type: Dokumenttype.LEGEERKLÆRING,
    datert: dayjs('2020-01-01').utc(true).toISOString(),
    navn: 'Foobar-haha.pdf',
    benyttet: true,
    annenPartErKilde: true,
    fremhevet: true,
    behandlet: true,
    links: createMockedDokumentelementLinks('2'),
    mottattDato: '2021-03-06',
    mottattTidspunkt: '2021-03-06T10:23:13.309267',
  },
];

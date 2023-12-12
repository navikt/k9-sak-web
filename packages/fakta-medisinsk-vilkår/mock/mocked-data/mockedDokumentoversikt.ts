import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Dokumenttype } from '../../src/types/Dokument';
import createMockedDokumentelementLinks from './createMockedDokumentelementLinks';

dayjs.extend(utc);

const mockedDokumentoversikt = {
  dokumenter: [
    {
      id: '2',
      navn: 'Dokument 2',
      type: Dokumenttype.ANDRE_MEDISINSKE_OPPLYSNINGER,
      datert: dayjs('2022-02-10').utc(true).format('YYYY-MM-DD'),
      links: createMockedDokumentelementLinks('2'),
      benyttet: true,
      annenPartErKilde: false,
      fremhevet: false,
      behandlet: true,
      mottattDato: '2021-03-05',
      mottattTidspunkt: '2021-03-05T10:23:13.309267',
      duplikater: ['3'],
      duplikatAvId: null,
      bruktTilMinstEnVurdering: false,
    },
    {
      id: '4',
      navn: 'Dokument 4',
      type: Dokumenttype.MANGLER_MEDISINSKE_OPPLYSNINGER,
      datert: dayjs('2022-02-11').utc(true).format('YYYY-MM-DD'),
      links: createMockedDokumentelementLinks('4'),
      benyttet: true,
      annenPartErKilde: false,
      fremhevet: false,
      behandlet: true,
      mottattDato: '2021-03-05',
      mottattTidspunkt: '2021-03-05T10:23:13.309267',
      duplikater: [],
      duplikatAvId: null,
      bruktTilMinstEnVurdering: false,
    },
    {
      id: '1',
      navn: 'Dokument 1',
      type: Dokumenttype.UKLASSIFISERT,
      datert: dayjs('2022-02-12').utc(true).format('YYYY-MM-DD'),
      links: createMockedDokumentelementLinks('4'),
      benyttet: true,
      annenPartErKilde: false,
      fremhevet: false,
      behandlet: false,
      mottattDato: '2021-03-05',
      mottattTidspunkt: '2021-03-05T10:23:13.309267',
      duplikater: [],
      duplikatAvId: null,
      bruktTilMinstEnVurdering: false,
    },
  ],
};
export default mockedDokumentoversikt;

import { aktivitetStatusType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/AktivitetStatus.js';
import { inntektskategorier } from '@k9-sak-web/backend/k9sak/kodeverk/Inntektskategori.js';
import {
  KodeverkKlageType,
  KodeverkTilbakeType,
  KodeverkType,
  KodeverkTypeV2,
} from '@k9-sak-web/lib/kodeverk/types.js';
import type { ArbeidsgiverOpplysningerPerId } from '../types/arbeidsgiverOpplysningerType';
import type { NyPeriodeFormAndeler } from './manuellePerioder/FormState';
import {
  createArbeidsgiverVisningsnavnForAndel,
  createPrivatarbeidsgiverVisningsnavnForAndel,
  getAktivitet,
  getInntektskategori,
} from './TilkjentYteleseUtils';

describe('TilkjentYteleseUtils', () => {
  const kodeverkNavnFraKodeMock = vi.fn(
    (_: string, kodeverkType: KodeverkType | KodeverkKlageType | KodeverkTilbakeType | KodeverkTypeV2) => {
      if (kodeverkType === KodeverkType.AKTIVITET_STATUS) {
        return 'AktivitetStatus';
      }
      if (kodeverkType === KodeverkType.INNTEKTSKATEGORI) {
        return 'Inntektskategori';
      }
      return '';
    },
  );

  describe('getAktivitet', () => {
    it('should return empty string if aktivitetStatus is undefined', () => {
      expect(getAktivitet(undefined, kodeverkNavnFraKodeMock)).toBe('');
    });

    it('should return empty string if aktivitetStatus is null', () => {
      expect(getAktivitet(undefined, kodeverkNavnFraKodeMock)).toBe('');
    });

    it('should return the correct aktivitet status name', () => {
      expect(getAktivitet(aktivitetStatusType.AT, kodeverkNavnFraKodeMock)).toBe('AktivitetStatus');
    });
  });

  describe('getInntektskategori', () => {
    it('should return empty string if inntektskategori is undefined', () => {
      expect(getInntektskategori(undefined, kodeverkNavnFraKodeMock)).toBe('');
    });

    it('should return the correct inntektskategori name', () => {
      expect(getInntektskategori(inntektskategorier.ARBEIDSTAKER, kodeverkNavnFraKodeMock)).toBe('Inntektskategori');
    });
  });

  describe('createArbeidsgiverVisningsnavnForAndel', () => {
    const arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId = {
      '123456789': { navn: 'Arbeidsgiver AS', personIdentifikator: '123456789', identifikator: '123456789' },
    };

    it('should return empty string if andel is not provided', () => {
      expect(
        createArbeidsgiverVisningsnavnForAndel(undefined, kodeverkNavnFraKodeMock, arbeidsgiverOpplysningerPerId),
      ).toBe('');
    });

    it('should return aktivitet status name if identifikator is not found', () => {
      const andel: NyPeriodeFormAndeler = {
        aktivitetStatus: aktivitetStatusType.AT,
        arbeidsgiverOrgnr: '',
        eksternArbeidsforholdId: '',
        inntektskategori: '-',
        refusjon: 0,
        tilSoker: 0,
        utbetalingsgrad: 0,
      };
      expect(
        createArbeidsgiverVisningsnavnForAndel(andel, kodeverkNavnFraKodeMock, arbeidsgiverOpplysningerPerId),
      ).toBe('AktivitetStatus');
    });

    it('should return arbeidsgiver name with identifikator if found', () => {
      const andel: NyPeriodeFormAndeler = {
        arbeidsgiverOrgnr: '123456789',
        eksternArbeidsforholdId: '',
        inntektskategori: '-',
        refusjon: 0,
        tilSoker: 0,
        utbetalingsgrad: 0,
      };
      expect(
        createArbeidsgiverVisningsnavnForAndel(andel, kodeverkNavnFraKodeMock, arbeidsgiverOpplysningerPerId),
      ).toBe('Arbeidsgiver AS (123456789)');
    });

    it('should return identifikator with end char if navn is not found', () => {
      const andel: NyPeriodeFormAndeler = {
        arbeidsgiverOrgnr: '987654321',
        eksternArbeidsforholdId: '1234',
        inntektskategori: '-',
        refusjon: 0,
        tilSoker: 0,
        utbetalingsgrad: 0,
      };
      expect(
        createArbeidsgiverVisningsnavnForAndel(andel, kodeverkNavnFraKodeMock, arbeidsgiverOpplysningerPerId),
      ).toBe('987654321...1234');
    });
  });

  describe('createPrivatarbeidsgiverVisningsnavnForAndel', () => {
    const arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId = {
      '123456789': { navn: 'Privat Arbeidsgiver', personIdentifikator: '123456789', identifikator: '123456789' },
    };

    it('should return empty string if andel is not provided', () => {
      expect(createPrivatarbeidsgiverVisningsnavnForAndel(undefined, arbeidsgiverOpplysningerPerId)).toBe('');
    });

    it('should return empty string if identifikator is not found', () => {
      const andel: NyPeriodeFormAndeler = {
        arbeidsgiverOrgnr: '',
        eksternArbeidsforholdId: '',
        inntektskategori: '-',
        refusjon: 0,
        tilSoker: 0,
        utbetalingsgrad: 0,
      };
      expect(createPrivatarbeidsgiverVisningsnavnForAndel(andel, arbeidsgiverOpplysningerPerId)).toBe('');
    });

    it('should return arbeidsgiver name with identifikator if found', () => {
      const andel: NyPeriodeFormAndeler & { arbeidsgiverPersonIdent: string } = {
        arbeidsgiverPersonIdent: '123456789',
        arbeidsgiverOrgnr: '',
        eksternArbeidsforholdId: '',
        inntektskategori: '-',
        refusjon: 0,
        tilSoker: 0,
        utbetalingsgrad: 0,
      };
      expect(createPrivatarbeidsgiverVisningsnavnForAndel(andel, arbeidsgiverOpplysningerPerId)).toBe(
        'Privat Arbeidsgiver (123456789)',
      );
    });

    it('should return identifikator with end char if navn is not found', () => {
      const andel: NyPeriodeFormAndeler & { arbeidsgiverPersonIdent: string } = {
        arbeidsgiverPersonIdent: '987654321',
        eksternArbeidsforholdId: '1234',
        arbeidsgiverOrgnr: '',
        inntektskategori: '-',
        refusjon: 0,
        tilSoker: 0,
        utbetalingsgrad: 0,
      };
      expect(createPrivatarbeidsgiverVisningsnavnForAndel(andel, arbeidsgiverOpplysningerPerId)).toBe(
        '987654321...1234',
      );
    });
  });
});

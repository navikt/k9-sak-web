import { Period } from '@fpsak-frontend/utils';
import { byggEndringer, InnleggelsesperiodeRad } from '../innleggelsesperiodeEndringer';

const rad = (
  fom: string,
  tom: string,
  begrunnelse = '',
  opprinnelig?: { fom: string; tom: string } | null,
): InnleggelsesperiodeRad => ({
  period: new Period(fom, tom),
  begrunnelse,
  opprinneligPeriode: opprinnelig ? new Period(opprinnelig.fom, opprinnelig.tom) : null,
});

// En rad som er seedet fra en opprinnelig periode (uendret utgangspunkt).
const seedetRad = (fom: string, tom: string): InnleggelsesperiodeRad => rad(fom, tom, '', { fom, tom });

const slettetRad = (fom: string, tom: string, begrunnelse = ''): InnleggelsesperiodeRad =>
  rad(fom, tom, begrunnelse, { fom, tom });

describe('innleggelsesperiodeEndringer', () => {
  describe('byggEndringer', () => {
    it('gir ingen endringer når listen er uendret', () => {
      const endringer = byggEndringer([seedetRad('2025-01-01', '2025-01-10')], []);
      expect(endringer).toEqual([]);
    });

    it('registrerer en lagt til periode med fraPeriode = null', () => {
      const rader = [seedetRad('2025-01-01', '2025-01-10'), rad('2025-03-01', '2025-03-05', 'Ny innleggelse')];

      const endringer = byggEndringer(rader, []);

      expect(endringer).toEqual([
        { fraPeriode: null, tilPeriode: { fom: '2025-03-01', tom: '2025-03-05' }, begrunnelse: 'Ny innleggelse' },
      ]);
    });

    it('registrerer en fjernet periode med tilPeriode = null og egen begrunnelse', () => {
      const rader = [seedetRad('2025-01-01', '2025-01-10')];
      const slettede = [slettetRad('2025-02-01', '2025-02-05', 'Feilregistrert')];

      const endringer = byggEndringer(rader, slettede);

      expect(endringer).toEqual([
        { fraPeriode: { fom: '2025-02-01', tom: '2025-02-05' }, tilPeriode: null, begrunnelse: 'Feilregistrert' },
      ]);
    });

    it('registrerer flere fjernede perioder med hver sin begrunnelse', () => {
      const slettede = [
        slettetRad('2025-02-01', '2025-02-05', 'Første'),
        slettetRad('2025-03-01', '2025-03-10', 'Andre'),
      ];

      const endringer = byggEndringer([], slettede);

      expect(endringer).toEqual([
        { fraPeriode: { fom: '2025-02-01', tom: '2025-02-05' }, tilPeriode: null, begrunnelse: 'Første' },
        { fraPeriode: { fom: '2025-03-01', tom: '2025-03-10' }, tilPeriode: null, begrunnelse: 'Andre' },
      ]);
    });

    it('registrerer en redigert periode som fraPeriode -> tilPeriode', () => {
      const rader = [rad('2025-01-01', '2025-01-15', 'Forlenget', { fom: '2025-01-01', tom: '2025-01-10' })];

      const endringer = byggEndringer(rader, []);

      expect(endringer).toEqual([
        {
          fraPeriode: { fom: '2025-01-01', tom: '2025-01-10' },
          tilPeriode: { fom: '2025-01-01', tom: '2025-01-15' },
          begrunnelse: 'Forlenget',
        },
      ]);
    });

    it('håndterer lagt til, fjernet og redigert i samme diff', () => {
      const rader = [
        rad('2025-01-01', '2025-01-12', 'Justert', { fom: '2025-01-01', tom: '2025-01-10' }),
        rad('2025-04-01', '2025-04-03', 'Lagt til'),
      ];
      const slettede = [slettetRad('2025-02-01', '2025-02-05', 'Slettet')];

      const endringer = byggEndringer(rader, slettede);

      expect(endringer).toEqual([
        {
          fraPeriode: { fom: '2025-01-01', tom: '2025-01-10' },
          tilPeriode: { fom: '2025-01-01', tom: '2025-01-12' },
          begrunnelse: 'Justert',
        },
        { fraPeriode: null, tilPeriode: { fom: '2025-04-01', tom: '2025-04-03' }, begrunnelse: 'Lagt til' },
        { fraPeriode: { fom: '2025-02-01', tom: '2025-02-05' }, tilPeriode: null, begrunnelse: 'Slettet' },
      ]);
    });
  });
});

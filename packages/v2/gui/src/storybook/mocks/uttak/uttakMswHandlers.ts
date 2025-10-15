import { http, HttpResponse } from 'msw';
import type { k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto as ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { defaultArbeidsgivere } from './uttakStoryMocks.js';

/**
 * Standard MSW handlers for uttak API endpoints.
 * Disse kan brukes direkte i stories eller tilpasses med factory-funksjoner.
 * 
 * @example
 * ```typescript
 * // I en story-fil:
 * parameters: {
 *   msw: {
 *     handlers: [
 *       standardUttakHandlers.arbeidsgivere(),
 *       standardUttakHandlers.inntektsgradering(),
 *     ],
 *   },
 * }
 * ```
 */
export const standardUttakHandlers = {
  /**
   * Handler for arbeidsgiver-endepunktet.
   * Returnerer standard arbeidsgivere hvis ikke annet er spesifisert.
   * 
   * @param arbeidsgivere - Valgfrie arbeidsgivere å returnere (bruker defaultArbeidsgivere hvis ikke oppgitt)
   * @returns MSW handler for arbeidsgiver-endepunktet
   * 
   * @example
   * ```typescript
   * // Bruk standard arbeidsgivere:
   * standardUttakHandlers.arbeidsgivere()
   * 
   * // Bruk egendefinerte arbeidsgivere:
   * standardUttakHandlers.arbeidsgivere(customArbeidsgivere)
   * ```
   */
  arbeidsgivere: (arbeidsgivere?: ArbeidsgiverOversiktDto['arbeidsgivere']) =>
    http.get(/.*arbeidsgiver.*/, ({ request }) => {
      console.log('MSW: arbeidsgiver handler called for URL:', request.url);
      return HttpResponse.json({
        arbeidsgivere: arbeidsgivere ?? defaultArbeidsgivere,
      });
    }),

  /**
   * Handler for inntektsgradering-endepunktet.
   * Returnerer tom liste hvis ikke annet er spesifisert.
   * 
   * @param perioder - Valgfrie inntektsgraderingperioder å returnere (tom liste hvis ikke oppgitt)
   * @returns MSW handler for inntektsgradering-endepunktet
   * 
   * @example
   * ```typescript
   * // Ingen inntektsgradering:
   * standardUttakHandlers.inntektsgradering()
   * 
   * // Med inntektsgradering:
   * standardUttakHandlers.inntektsgradering(inntektsgraderingEnArbeidsgiver.perioder)
   * ```
   */
  inntektsgradering: (perioder: unknown[] = []) =>
    http.get(/.*inntektsgradering.*/, () => {
      return HttpResponse.json({ perioder });
    }),

  /**
   * Handler for overstyrt uttak-endepunktet.
   * Returnerer tom liste av overstyringer hvis ikke annet er spesifisert.
   * 
   * @param arbeidsgivere - Valgfrie arbeidsgivere å returnere (bruker defaultArbeidsgivere hvis ikke oppgitt)
   * @param overstyringer - Valgfrie overstyringer å returnere (tom liste hvis ikke oppgitt)
   * @returns MSW handler for overstyrt uttak-endepunktet
   * 
   * @example
   * ```typescript
   * // Ingen overstyringer:
   * standardUttakHandlers.overstyrtUttak()
   * 
   * // Med overstyringer:
   * standardUttakHandlers.overstyrtUttak(defaultArbeidsgivere, [overstyring1, overstyring2])
   * ```
   */
  overstyrtUttak: (arbeidsgivere?: ArbeidsgiverOversiktDto['arbeidsgivere'], overstyringer: unknown[] = []) =>
    http.get(/overstyrt/, ({ request }) => {
      console.log('MSW: overstyrtUttak handler called for URL:', request.url);
      console.log('MSW: returning overstyringer:', overstyringer);
      return HttpResponse.json({
        arbeidsgiverOversikt: {
          arbeidsgivere: arbeidsgivere ?? defaultArbeidsgivere,
        },
        overstyringer,
      });
    }),

  /**
   * Handler for aksjonspunkt-endepunktet.
   * Logger payload og returnerer suksess-respons.
   * 
   * @param onSubmit - Valgfri callback som kalles med payload når aksjonspunkt submittes
   * @returns MSW handler for aksjonspunkt-endepunktet
   * 
   * @example
   * ```typescript
   * // Med logging:
   * standardUttakHandlers.aksjonspunkt((payload) => {
   *   console.log('Aksjonspunkt submitted:', payload);
   * })
   * 
   * // Med Storybook action:
   * standardUttakHandlers.aksjonspunkt(action('aksjonspunkt:submit'))
   * ```
   */
  aksjonspunkt: (onSubmit?: (payload: unknown) => void) =>
    http.post(/.*\/aksjonspunkt$/, async ({ request }) => {
      const payload = await request.json().catch(() => undefined);
      if (onSubmit) onSubmit(payload);
      return HttpResponse.json({ status: 'OK', mottatt: payload });
    }),

  /**
   * Handler for overstyring av aksjonspunkt.
   * Logger payload og returnerer suksess-respons.
   * 
   * @param onSubmit - Valgfri callback som kalles med payload når overstyring submittes
   * @returns MSW handler for overstyring av aksjonspunkt
   * 
   * @example
   * ```typescript
   * // Med logging:
   * standardUttakHandlers.overstyrAksjonspunkt((payload) => {
   *   console.log('Overstyring submitted:', payload);
   * })
   * 
   * // Med Storybook action:
   * standardUttakHandlers.overstyrAksjonspunkt(action('overstyr-aksjonspunkt:submit'))
   * ```
   */
  overstyrAksjonspunkt: (onSubmit?: (payload: unknown) => void) =>
    http.post(/.*\/aksjonspunkt\/overstyr$/, async ({ request }) => {
      const payload = await request.json().catch(() => undefined);
      if (onSubmit) onSubmit(payload);
      return HttpResponse.json({ status: 'OK', mottatt: payload });
    }),
};

/**
 * Oppretter en handler for overlappende saker med tilpassede perioder.
 * 
 * Denne factory-funksjonen lar deg definere hvilke perioder som har overlapp
 * med andre saker, og hvordan de skal vurderes.
 * 
 * @param perioderMedOverlapp - Array av perioder med overlappende saker
 * @returns MSW handler for overlappende saker-endepunktet
 * 
 * @example
 * ```typescript
 * // Opprett handler med overlappende perioder:
 * createOverlappendeSakerHandler([
 *   {
 *     periode: { fom: '2024-01-01', tom: '2024-01-15' },
 *     skalVurderes: true,
 *     saksnummer: ['SAK123', 'SAK456'],
 *   },
 *   {
 *     periode: { fom: '2024-01-16', tom: '2024-01-31' },
 *     skalVurderes: false,
 *     saksnummer: ['SAK789'],
 *     fastsattUttaksgrad: 50,
 *     saksbehandler: 'Z123456',
 *     vurdertTidspunkt: '2024-01-10T10:00:00',
 *     valg: 'GODKJENT',
 *   },
 * ])
 * ```
 */
export const createOverlappendeSakerHandler = (
  perioderMedOverlapp: Array<{
    periode: { fom: string; tom: string };
    skalVurderes: boolean;
    saksnummer: string[];
    fastsattUttaksgrad?: number;
    saksbehandler?: string;
    vurdertTidspunkt?: string;
    valg?: string;
  }>,
) =>
  http.post(/.*egne-overlappende-saker.*/, () => {
    return HttpResponse.json({ perioderMedOverlapp });
  });

/**
 * Oppretter en handler for overstyrbare aktiviteter med validering.
 * 
 * Denne factory-funksjonen oppretter en handler som validerer at forespurte
 * perioder er innenfor tillatte områder før den returnerer aktiviteter.
 * Dette simulerer backend-validering av hvilke perioder som kan overstyres.
 * 
 * Valideringsregler:
 * - Datoer må være i ISO-format (YYYY-MM-DD)
 * - fom må være før eller lik tom
 * - Perioden må være helt innenfor én av allowedRanges
 * 
 * @param allowedRanges - Gyldige perioder som kan overstyres
 * @param arbeidsgivere - Arbeidsgivere som skal returneres i responsen
 * @returns MSW handler med valideringslogikk
 * 
 * @example
 * ```typescript
 * // Opprett handler som kun tillater overstyring i januar og februar 2024:
 * createOverstyrbareAktiviteterHandler(
 *   [
 *     { fom: '2024-01-01', tom: '2024-01-31' },
 *     { fom: '2024-02-01', tom: '2024-02-28' },
 *   ],
 *   defaultArbeidsgivere
 * )
 * ```
 */
export const createOverstyrbareAktiviteterHandler = (
  allowedRanges: Array<{ fom: string; tom: string }>,
  arbeidsgivere: ArbeidsgiverOversiktDto['arbeidsgivere'],
) =>
  http.post(/.*overstyrbare-aktiviteter.*/, async ({ request }) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body = (await request.json().catch(() => undefined)) as any;
      const fom = body?.fom || body?.periode?.fom || '';
      const tom = body?.tom || body?.periode?.tom || '';
      const isoDato = /^\d{4}-\d{2}-\d{2}$/;

      // Valider format
      if (!isoDato.test(fom) || !isoDato.test(tom)) {
        return HttpResponse.json({
          arbeidsforholdsperioder: [],
          arbeidsgiverOversikt: { arbeidsgivere },
        });
      }

      // Valider rekkefølge
      if (fom > tom) {
        return HttpResponse.json({
          arbeidsforholdsperioder: [],
          arbeidsgiverOversikt: { arbeidsgivere },
        });
      }

      // Må være helt innenfor én av allowedRanges
      const innenfor = allowedRanges.some(r => fom >= r.fom && tom <= r.tom);
      if (!innenfor) {
        return HttpResponse.json({
          arbeidsforholdsperioder: [],
          arbeidsgiverOversikt: { arbeidsgivere },
        });
      }

      // Gyldig -> returner aktivitet
      return HttpResponse.json({
        arbeidsforholdsperioder: [
          {
            type: 'ARBEIDSTAKER',
            orgnr: '123456789',
            arbeidsforholdId: 'aaaaa-bbbbb',
            periode: { fom, tom },
          },
        ],
        arbeidsgiverOversikt: { arbeidsgivere },
      });
    } catch {
      return HttpResponse.json({
        arbeidsforholdsperioder: [],
        arbeidsgiverOversikt: { arbeidsgivere },
      });
    }
  });

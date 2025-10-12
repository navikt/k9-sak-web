export type AuthResult = Readonly<
  | {
      isAuthenticated: boolean;
      popupClosed: boolean;
      aborted: false;
    }
  | {
      aborted: true;
      isAuthenticated: false;
      popupClosed?: undefined;
    }
>;

export const authAbortedResult: AuthResult = { aborted: true, isAuthenticated: false } as const;
export const authSuccessResult: AuthResult = { isAuthenticated: true, popupClosed: true, aborted: false } as const;
export const authSuccessExceptPopupResult: AuthResult = {
  isAuthenticated: true,
  popupClosed: false,
  aborted: false,
} as const;
export const authDeniedResult: AuthResult = { isAuthenticated: false, popupClosed: true, aborted: false } as const;
export const authDeniedExceptPopupResult: AuthResult = {
  isAuthenticated: false,
  popupClosed: false,
  aborted: false,
} as const;

/**
 * AuthFixApi blir sendt inn frå gui kode for å støtte opp om transparent (re-)autentisering når klient gjere kall til
 * server og mangler/har utdatert autentisering.
 * <p>
 *   Når autentisering feiler svare server med 401 respons kode. Klient fanger denne respons, og kaller AuthFixApi.authenticate
 *   med respons som feila.
 * </p>
 * <p>
 *   Kvar instans av AuthFixApi skal berre gjere ein autentiseringsflyt av gangen. Viss det skjer fleire kall til
 *   authenticate medan autentiseringsprosessen pågår skal alle vente på pågåande prosess og få resultatet av denne,
 *   ikkje starte nye.
 * <p>
 */
export interface AuthFixApi {
  /**
   * Viss ingen aktiv autentiseringsflyt i instans: Starter ny autentiseringsflyt basert på info i failedResponse. Ellers
   * returnerast resultat av allereie aktiv autentiseringsflyt.
   *
   * @returns Promise som fullfører når autentiseringsflyt er fullført eller avbrutt.
   */
  authenticate(failedResponse: Response, abortSignal: AbortSignal): Promise<AuthResult>;

  /**
   * Kalles frå request interceptor for å sjekke om den bør vente på autentisering før den fortsetter.
   */
  get needsAuthentication(): boolean;

  /**
   * @returns true Viss autentiseringsflyt pågår
   */
  get isAuthenticating(): boolean;

  /**
   * Venter til evt pågåande autentiseringsprosess er fullført.
   */
  authenticationDone(abortSignal: AbortSignal): Promise<void>;
}

import Link from './LinkTsType';
import type { ErrorNotifier } from './error/ErrorNotifier.js';

/**
 * AbstractRequestApi
 *
 * Denne klassen opprettes med en referanse til et HttpClientApi (for eksempel Axios), context-path og konfig for
 * de enkelte endepunktene. Det blir så satt opp RequestRunner's for endepunktene. Desse kan hentes via metoden @see getRequestRunner.
 */
abstract class AbstractRequestApi {
  public abstract startRequest(endpointName: string, params?: any, isCachingOn?: boolean): any;

  public abstract hasPath(endpointName: string): boolean;

  public abstract setLinks(links: Link[], linkCategory?: string): void;

  public abstract setRequestPendingHandler(requestPendingHandler): void;

  /**
   * @deprecated Bruk setErrorNotifier for ny feilhandtering
   * @param addErrorMessage
   */
  public abstract setAddErrorMessageHandler(addErrorMessage): void;

  /**
   * Erstatter setAddErrorMessageHandler brukt tidlegare, for å få rapportert feil direkte ut og få vist dei i nytt feilhandteringsregime.
   * @param notifier
   */
  public abstract setErrorNotifier(notifier: ErrorNotifier): void;

  public abstract resetCache(): void;

  public abstract isMock(): boolean;

  public abstract mock(endpointName: string, data?: any): void;

  public abstract getRequestMockData(endpointName: string): { params: any }[];

  public abstract setMissingPath(endpointName: string): void;

  public abstract clearMockData(endpointName: string): void;
  public abstract clearAllMockData(): void;
}

export default AbstractRequestApi;

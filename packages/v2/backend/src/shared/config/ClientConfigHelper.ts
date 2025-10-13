import type { AuthFixApi } from '../auth/AuthFixApi.js';
import { generateNavCallidHeader } from '../instrumentation/navCallid.js';
import { jsonSerializerOption } from '../jsonSerializerOption.js';

const { xJsonSerializerOptionHeader, xJsonSerializerOptionValue } = jsonSerializerOption;

/**
 * Felles ressurser for konfigurasjon av genererte typescript klienter før bruk. Slik at vi unngår å duplisere denne koden.
 */
export class ClientConfigHelper {
  #authFixer: AuthFixApi;

  constructor(authFixer: AuthFixApi) {
    this.#authFixer = authFixer;
  }

  // querySerializer settast slik fordi nokre query parametre (feks SaksnummerDto) er definert som klasse med json serialisering satt til object.
  // openapi spesifikasjon seier då at det skal sendast inn objekt som query parameter, og dette blir som standard serialisert til ?saksnummer[saksnummer]=verdi,
  // som feiler på serveren. Ved å sette querySerializer slik blir url istaden ?saksnummer=verdi, som er det serveren forventar. Dette stemmer og med det
  // swagger-ui gjere i disse tilfella.
  get querySerializerConfig() {
    return {
      object: {
        explode: true,
        style: 'form',
      },
      array: {
        explode: true,
        style: 'form',
      },
    } as const;
  }

  get requestInterceptor() {
    const authFixer = this.#authFixer;
    return async (request: Request) => {
      const { headerName, headerValue } = generateNavCallidHeader();
      request.headers.set(headerName, headerValue);
      request.headers.set(xJsonSerializerOptionHeader, xJsonSerializerOptionValue);
      request.headers.set('Accept', 'application/json,*/*;q=0.1'); // Required to get server to return 401 (and not 302) for auth failures.
      // Viss autentisering trengs, vent med å sende nye kall til server sidan dei og berre vil feile.
      if (authFixer.shouldWaitForAuthentication) {
        await authFixer.authenticationDone(request.signal);
      }
      return request;
    };
  }

  // If server responds with 401, try to authenticate with authFixer, then retry the original request if auth succeeds.
  get responseInterceptor() {
    const authFixer = this.#authFixer;
    return async (response: Response, request: Request, fetcher: (request: Request) => ReturnType<typeof fetch>) => {
      if (response.status === 401) {
        const authResult = await authFixer.authenticate(response, request.signal);
        if (authResult.isAuthenticated) {
          // Retry the request that failed with 401, using the fetch implementation supplied by hey-api if it is defined
          return await fetcher(request);
        } else if (authResult.aborted) {
          console.warn(
            `Auth flow aborted, could not automatically authenticate and retry request. This request will fail.`,
          );
        }
      }
      return response;
    };
  }
}

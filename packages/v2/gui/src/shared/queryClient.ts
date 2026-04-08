import { type DefaultOptions, QueryClient } from '@tanstack/react-query';

/**
 * Det er denne funksjon som skal brukast over alt der ein ny QueryClient instans initialiserast. Slik at vi har ein stad
 * å sette felles options.
 *
 * @param defaultOptionsOverride Viss ein trenger å overstyre felles standard (feks fjerne retries i test), sett denne.
 */
export const createQueryClient = (defaultOptionsOverride?: DefaultOptions) =>
  new QueryClient({
    defaultOptions: {
      // Options satt her blir som standard gjeldande for heile k9-sak-web
      queries: {
        refetchOnWindowFocus: false,
      },
      // TODO Juster/sjekk denne for ønska feilhandtering
      mutations: {
        onError: err => {
          throw err;
        },
      },
      // ...Men kan overstyrast med defaultOptionsOverride, feks når query client blir oppretta for tester.
      ...defaultOptionsOverride,
    },
  });

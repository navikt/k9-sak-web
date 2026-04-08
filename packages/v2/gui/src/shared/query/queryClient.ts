import { type DefaultOptions, QueryClient } from '@tanstack/react-query';

/**
 * Det er denne funksjon som skal brukast over alt der ein ny QueryClient instans initialiserast. Slik at vi har ein stad
 * å sette felles options.
 *
 * @param defaultOptionsOverride Viss ein trenger å overstyre felles standard (feks fjerne retries i test), sett denne. Avgrensa til queries og mutations no, utvid viss behov i framtida.
 */
export const createQueryClient = (defaultOptionsOverride?: Pick<DefaultOptions, 'queries' | 'mutations'>) =>
  new QueryClient({
    defaultOptions: {
      // Options satt her blir som standard gjeldande for heile k9-sak-web
      queries: {
        refetchOnWindowFocus: false,
        // ...Men kan overstyrast med defaultOptionsOverride, feks når query client blir oppretta for tester.
        ...defaultOptionsOverride?.queries,
      },
      // TODO Juster/sjekk denne for ønska feilhandtering
      mutations: {
        onError: err => {
          throw err;
        },
        ...defaultOptionsOverride?.mutations,
      },
    },
  });

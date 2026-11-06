import type { EndringsmeldingPsbTilgangDto } from '@k9-sak-web/backend/k9sak/kontrakt/endringsmeldingpsb/EndringsmeldingPsbTilgangDto.js';
import { backendNavn } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';
import type { Decorator } from '@storybook/react-vite';
import { EndringsmeldingPsbTilgangApiContext } from '../../sak/visittkort/endringsmelding-psb/api/EndringsmeldingPsbTilgangApiContext.js';

// Send inn en Error for å simulere at kallet feiler, eller null for tomt svar (204)
export const withFakeEndringsmeldingPsbTilgangApi =
  (svar: EndringsmeldingPsbTilgangDto | null | Error): Decorator =>
  Story => (
    <EndringsmeldingPsbTilgangApiContext
      value={{
        backend: backendNavn.k9sak,
        hentEndringsmeldingPsbTilgang: async () => {
          if (svar instanceof Error) {
            throw svar;
          }
          return svar;
        },
      }}
    >
      <Story />
    </EndringsmeldingPsbTilgangApiContext>
  );

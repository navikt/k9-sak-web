import type { Decorator } from '@storybook/react';
import type { k9_sak_kontrakt_kompletthet_KompletthetsVurderingDto as KompletthetsVurdering } from '@navikt/k9-sak-typescript-client/types';
import type { InntektsmeldingApi } from '../src/api/InntektsmeldingApi.js';
import { InntektsmeldingApiContext } from '../src/api/InntektsmeldingApiContext.js';

export const withFakeInntektsmeldingApi =
  (forBehandlingUuid: string, kompletthetsdata: KompletthetsVurdering): Decorator =>
  Story => {
    const fakeInntekstmeldingBackend: InntektsmeldingApi = {
      hentKompletthetsoversikt(behandlingUuid: string): Promise<KompletthetsVurdering> {
        if (behandlingUuid === forBehandlingUuid) {
          return Promise.resolve(kompletthetsdata);
        } else {
          return Promise.resolve({ tilstand: [] });
        }
      },
    };

    return (
      <InntektsmeldingApiContext value={fakeInntekstmeldingBackend}>
        <Story />
      </InntektsmeldingApiContext>
    );
  };

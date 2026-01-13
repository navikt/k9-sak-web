import type { Decorator } from '@storybook/react';
import type { k9_sak_kontrakt_kompletthet_KompletthetsVurderingDto as KompletthetsVurdering } from '@navikt/k9-sak-typescript-client/types';
import type { InntektsmeldingApi } from '../src/api/InntektsmeldingApi.js';
import { InntektsmeldingApiContext } from '../src/api/InntektsmeldingApiContext.js';
import { ignoreUnusedDeclared } from '../../../storybook/mocks/ignoreUnusedDeclared.js';

export const withFakeInntektsmeldingApi =
  (kompletthetsdata: KompletthetsVurdering): Decorator =>
  Story => {
    const fakeInntekstmeldingBackend: InntektsmeldingApi = {
      hentKompletthetsoversikt(behandlingUuid: string): Promise<KompletthetsVurdering> {
        ignoreUnusedDeclared(behandlingUuid);
        return Promise.resolve(kompletthetsdata);
      },
    };

    return (
      <InntektsmeldingApiContext value={fakeInntekstmeldingBackend}>
        <Story />
      </InntektsmeldingApiContext>
    );
  };

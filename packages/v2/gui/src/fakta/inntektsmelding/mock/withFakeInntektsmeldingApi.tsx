import type { Decorator } from '@storybook/react';
import type { KompletthetsVurderingDto as KompletthetsVurdering } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/KompletthetsVurderingDto.js';
import type { InntektsmeldingApi } from '../api/InntektsmeldingApi.js';
import { InntektsmeldingApiContext } from '../api/InntektsmeldingApiContext.js';

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

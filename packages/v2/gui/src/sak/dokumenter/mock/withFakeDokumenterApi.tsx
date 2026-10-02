import type { Decorator } from '@storybook/react';
import type { VurderingPerPeriode } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/inntektsmelding/VurderingPerPeriode.js';
import type { DokumenterApi } from '../api/DokumenterApi.js';
import { DokumenterApiContext } from '../api/DokumenterApiContext.js';
import { backendNavn } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export const withFakeDokumenterApi =
  (vurderingerAvMottatteInntektsmeldinger: VurderingPerPeriode = { vurderinger: [] }): Decorator =>
  Story => {
    const fakeDokumenterApi: DokumenterApi = {
      backend: backendNavn.k9sak,
      hentVurderingerAvMottatteInntektsmeldinger: () => Promise.resolve(vurderingerAvMottatteInntektsmeldinger),
    };

    return (
      <DokumenterApiContext value={fakeDokumenterApi}>
        <Story />
      </DokumenterApiContext>
    );
  };

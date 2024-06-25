import { action } from '@storybook/addon-actions';
import React from 'react';

import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import alleKodeverk from '@k9-sak-web/gui/storybook/mocks/alleKodeverk.json';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import { BehandlingType } from '@k9-sak-web/lib/types/index.js';
import VedtakProsessIndex from './VedtakProsessIndex';

const behandling = {
  id: 1,
  versjon: 1,
  type: behandlingType.FORSTEGANGSSOKNAD,
  status: behandlingStatus.BEHANDLING_UTREDES,
  sprakkode: 'NO',
  behandlingsresultat: {
    vedtaksbrev: 'FRITEKST',
    type: behandlingResultatType.IKKE_FASTSATT,
  },
  behandlingPaaVent: false,
  behandlingHenlagt: false,
  behandlingArsaker: [
    {
      behandlingArsakType: klageBehandlingArsakType.ETTER_KLAGE,
    },
  ],
};

export default {
  title: 'prosess/prosess-vedtak',
};

export const visSjekkTilbakekreving = args => {
  const aksjonspunkt5085 = {
    aksjonspunktType: 'MANU', // AKSJONSPUNKT_TYPE
    begrunnelse: null,
    besluttersBegrunnelse: null,
    definisjon: '5085', // AKSJONSPUNKT_DEF
    erAktivt: true,
    fristTid: null,
    kanLoses: true,
    status: 'OPPR', // AKSJONSPUNKT_STATUS
    toTrinnsBehandling: false,
    toTrinnsBehandlingGodkjent: null,
    vilkarType: null,
    vurderPaNyttArsaker: null,
    venteårsak: '-', // VENT_AARSAK
  };

  return (
    <KodeverkProvider
      behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
      kodeverk={alleKodeverkV2}
      klageKodeverk={{}}
      tilbakeKodeverk={{}}
    >
      <VedtakProsessIndex
        behandling={{
          ...behandling,
          type: behandlingType.SOKNAD,
          behandlingsresultat: {
            vedtaksbrev: {
              kode: 'FRITEKST',
            },
            type: behandlingResultatType.IKKE_FASTSATT,
          },
        }}
        vilkar={[]}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[aksjonspunkt5085]}
        previewCallback={action('button-click')}
        submitCallback={action('button-click')}
        alleKodeverk={alleKodeverk}
        {...args}
      />
    </KodeverkProvider>
  );
};

visSjekkTilbakekreving.args = {
  sendVarselOmRevurdering: false,
  employeeHasAccess: false,
  isReadOnly: false,
};

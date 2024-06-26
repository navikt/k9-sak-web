import { action } from '@storybook/addon-actions';
import React from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import avslagsarsakCodes from '@fpsak-frontend/kodeverk/src/avslagsarsakCodes';
import dokumentTypeId from '@fpsak-frontend/kodeverk/src/dokumentTypeId';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { Aksjonspunkt, Behandling, Soknad } from '@k9-sak-web/types';
import alleKodeverk from '@k9-sak-web/gui/storybook/mocks/alleKodeverk.json';
import { BehandlingType } from '@k9-sak-web/lib/types/BehandlingType.js';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import SokersOpplysningspliktVilkarProsessIndex from './SokersOpplysningspliktVilkarProsessIndex';

const soknad = {
  manglendeVedlegg: [
    {
      dokumentType: dokumentTypeId.INNTEKTSMELDING,
      arbeidsgiver: {
        organisasjonsnummer: '1234',
        navn: 'Statoil',
      },
    },
  ],
} as Soknad;

export default {
  title: 'prosess/prosess-vilkar-sokers-opplysningsplikt',
  component: SokersOpplysningspliktVilkarProsessIndex,
};

export const visÅpentAksjonspunkt = args => (
  <KodeverkProvider
    behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
    kodeverk={alleKodeverkV2}
    klageKodeverk={{}}
    tilbakeKodeverk={{}}
  >
    <SokersOpplysningspliktVilkarProsessIndex
      behandling={
        {
          id: 1,
          versjon: 1,
        } as Behandling
      }
      soknad={soknad}
      aksjonspunkter={
        [
          {
            definisjon: aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU,
            status: aksjonspunktStatus.OPPRETTET,
            begrunnelse: undefined,
          },
        ] as Aksjonspunkt[]
      }
      alleKodeverk={alleKodeverk as any}
      submitCallback={action('button-click') as () => Promise<any>}
      status={vilkarUtfallType.IKKE_VURDERT}
      isAksjonspunktOpen
      vilkar={[]}
      {...args}
    />
  </KodeverkProvider>
);

visÅpentAksjonspunkt.args = {
  isReadOnly: false,
  readOnlySubmitButton: false,
};

export const visOppfyltVilkår = args => (
  <KodeverkProvider
    behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
    kodeverk={alleKodeverkV2}
    klageKodeverk={{}}
    tilbakeKodeverk={{}}
  >
    <SokersOpplysningspliktVilkarProsessIndex
      behandling={
        {
          id: 1,
          versjon: 1,
          behandlingsresultat: {},
        } as Behandling
      }
      soknad={soknad}
      aksjonspunkter={
        [
          {
            definisjon: aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU,
            status: aksjonspunktStatus.UTFORT,
            begrunnelse: 'Dette vilkåret er godkjent',
          },
        ] as Aksjonspunkt[]
      }
      alleKodeverk={alleKodeverk as any}
      submitCallback={action('button-click') as () => Promise<any>}
      status={vilkarUtfallType.OPPFYLT}
      isAksjonspunktOpen={false}
      vilkar={[]}
      {...args}
    />
  </KodeverkProvider>
);

visOppfyltVilkår.args = {
  isReadOnly: true,
  readOnlySubmitButton: true,
};

export const visAvslåttVilkår = args => (
  <KodeverkProvider
    behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
    kodeverk={alleKodeverkV2}
    klageKodeverk={{}}
    tilbakeKodeverk={{}}
  >
    <SokersOpplysningspliktVilkarProsessIndex
      behandling={
        {
          id: 1,
          versjon: 1,
          behandlingsresultat: {
            avslagsarsak: avslagsarsakCodes.INGEN_BEREGNINGSREGLER,
          },
        } as Behandling
      }
      soknad={soknad}
      aksjonspunkter={
        [
          {
            definisjon: aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU,
            status: aksjonspunktStatus.UTFORT,
            begrunnelse: 'Dette vilkåret er avslått',
          },
        ] as Aksjonspunkt[]
      }
      alleKodeverk={alleKodeverk as any}
      submitCallback={action('button-click') as () => Promise<any>}
      status={vilkarUtfallType.IKKE_OPPFYLT}
      isAksjonspunktOpen={false}
      vilkar={[]}
      {...args}
    />
  </KodeverkProvider>
);

visAvslåttVilkår.args = {
  isReadOnly: true,
  readOnlySubmitButton: true,
};

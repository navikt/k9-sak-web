import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import klageVurderingCodes from '@fpsak-frontend/kodeverk/src/klageVurdering';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { action } from 'storybook/actions';
import FormkravProsessIndex from './FormkravProsessIndex';

const behandling = {
  id: 1,
  versjon: 1,
  språkkode: {
    kode: 'NO',
  },
};

const avsluttedeBehandlinger = [
  {
    id: 1,
    type: {
      kode: behandlingType.FORSTEGANGSSOKNAD,
    },
    avsluttet: '2017-08-02T00:54:25.455',
  },
];

const fagsak = {
  sakstype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
};

export default {
  title: 'prosess/klage/prosess-formkrav',
  component: FormkravProsessIndex,
};

export const visFormkravPanelForAksjonspunktNfp = args => (
  <FormkravProsessIndex
    behandling={behandling}
    submitCallback={action('button-click')}
    avsluttedeBehandlinger={avsluttedeBehandlinger}
    aksjonspunkter={[
      {
        definisjon: {
          kode: aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP,
        },
      },
    ]}
    fagsak={fagsak}
    {...args}
  />
);

visFormkravPanelForAksjonspunktNfp.args = {
  klageVurdering: {
    klageVurderingResultatNK: {
      klageVurdertAv: 'NK',
      klageVurdering: klageVurderingCodes.AVVIS_KLAGE,
      fritekstTilBrev: 'test',
      klageMedholdArsakNavn: 'TEST',
      godkjentAvMedunderskriver: false,
    },
    klageFormkravResultatKA: {
      avvistArsaker: [
        {
          navn: 'Denne er avvist fordi...',
        },
      ],
    },
  },
  isReadOnly: false,
  readOnlySubmitButton: false,
};

export const visFormkravPanelForAksjonspunktKa = args => (
  <FormkravProsessIndex
    behandling={behandling}
    submitCallback={action('button-click')}
    avsluttedeBehandlinger={avsluttedeBehandlinger}
    aksjonspunkter={[
      {
        definisjon: {
          kode: aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA,
        },
      },
    ]}
    fagsak={fagsak}
    {...args}
  />
);

visFormkravPanelForAksjonspunktKa.args = {
  klageVurdering: {
    klageVurderingResultatNK: {
      klageVurdertAv: 'NK',
      klageVurdering: klageVurderingCodes.AVVIS_KLAGE,
      fritekstTilBrev: 'test',
      klageMedholdArsakNavn: 'TEST',
      godkjentAvMedunderskriver: false,
    },
    klageFormkravResultatKA: {
      avvistArsaker: [
        {
          navn: 'Denne er avvist fordi...',
        },
      ],
    },
  },
  isReadOnly: false,
  readOnlySubmitButton: false,
};

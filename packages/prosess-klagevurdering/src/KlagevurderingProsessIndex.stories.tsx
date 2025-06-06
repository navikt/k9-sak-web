import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import klageVurderingCodes from '@fpsak-frontend/kodeverk/src/klageVurdering';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import alleKodeverk from '@k9-sak-web/gui/storybook/mocks/alleKodeverk.json';
import { action } from 'storybook/actions';
import KlagevurderingProsessIndex from './KlagevurderingProsessIndex';

const behandling = {
  id: 1,
  versjon: 1,
  språkkode: {
    kode: 'NO',
  },
};

export default {
  title: 'prosess/klage/prosess-klagevurdering',
  component: KlagevurderingProsessIndex,
};

export const visPanelForKlagevurderingMedAksjonspunktNk = args => (
  <KlagevurderingProsessIndex
    behandling={behandling}
    aksjonspunkter={[
      {
        definisjon: {
          kode: aksjonspunktCodes.BEHANDLE_KLAGE_NK,
        },
      },
    ]}
    saveKlage={action('button-click')}
    submitCallback={action('button-click')}
    previewCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
    {...args}
  />
);

visPanelForKlagevurderingMedAksjonspunktNk.args = {
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

export const visPanelForKlagevurderingMedAksjonspunktNfp = args => (
  <KlagevurderingProsessIndex
    behandling={behandling}
    fagsak={{ sakstype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN }}
    aksjonspunkter={[
      {
        definisjon: {
          kode: aksjonspunktCodes.BEHANDLE_KLAGE_NFP,
        },
      },
    ]}
    saveKlage={action('button-click')}
    submitCallback={action('button-click')}
    previewCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
    {...args}
  />
);

visPanelForKlagevurderingMedAksjonspunktNfp.args = {
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

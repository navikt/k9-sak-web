import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import ankeVurdering from '@fpsak-frontend/kodeverk/src/ankeVurdering';
import ankeVurderingOmgjoer from '@fpsak-frontend/kodeverk/src/ankeVurderingOmgjoer';
import { action } from '@storybook/addon-actions';
import React from 'react';
import AnkeResultatProsessIndex from './AnkeResultatProsessIndex';

const behandling = {
  id: 1,
  versjon: 1,
};

const aksjonspunkter = [
  {
    definisjon: {
      kode: aksjonspunktCodes.MANUELL_VURDERING_AV_ANKE_MERKNADER,
    },
    status: {
      kode: aksjonspunktStatus.OPPRETTET,
    },
    begrunnelse: undefined,
  },
];

const ankeVurderingResultat = {
  ankeVurdering: ankeVurdering.ANKE_AVVIS,
  paAnketBehandlingId: 1,
  erAnkerIkkePart: true,
  erIkkeKonkret: true,
  erFristIkkeOverholdt: true,
  erIkkeSignert: true,
  erSubsidiartRealitetsbehandles: true,
  begrunnelse: 'Dette er en begrunnelse',
};

export default {
  title: 'prosess/anke/prosess-anke-resultat',
  component: AnkeResultatProsessIndex,
};

export const visPanelForResultatVedStadfestYtelsesvedtak = args => (
  <AnkeResultatProsessIndex
    behandling={behandling}
    aksjonspunkter={aksjonspunkter}
    submitCallback={action('button-click')}
    saveAnke={action('button-click')}
    previewCallback={action('button-click')}
    previewVedtakCallback={action('button-click')}
    {...args}
  />
);

visPanelForResultatVedStadfestYtelsesvedtak.args = {
  ankeVurdering: {
    ankeVurderingResultat: {
      ...ankeVurderingResultat,
      ankeVurdering: ankeVurdering.ANKE_STADFESTE_YTELSESVEDTAK,
    },
  },
  readOnly: false,
  readOnlySubmitButton: false,
};

export const visPanelForResultatVedOppheveOgHjemsende = args => (
  <AnkeResultatProsessIndex
    behandling={behandling}
    aksjonspunkter={aksjonspunkter}
    submitCallback={action('button-click')}
    saveAnke={action('button-click')}
    previewCallback={action('button-click')}
    previewVedtakCallback={action('button-click')}
    {...args}
  />
);

visPanelForResultatVedOppheveOgHjemsende.args = {
  ankeVurdering: {
    ankeVurderingResultat: {
      ...ankeVurderingResultat,
      ankeVurdering: ankeVurdering.ANKE_OPPHEVE_OG_HJEMSENDE,
    },
  },
  readOnly: false,
  readOnlySubmitButton: false,
};

export const visPanelForResultatVedOmgjør = args => (
  <AnkeResultatProsessIndex
    behandling={behandling}
    aksjonspunkter={aksjonspunkter}
    submitCallback={action('button-click')}
    saveAnke={action('button-click')}
    previewCallback={action('button-click')}
    previewVedtakCallback={action('button-click')}
    {...args}
  />
);

visPanelForResultatVedOmgjør.args = {
  ankeVurdering: {
    ankeVurderingResultat: {
      ...ankeVurderingResultat,
      ankeVurdering: ankeVurdering.ANKE_OMGJOER,
      ankeVurderingOmgjoer: ankeVurderingOmgjoer.ANKE_TIL_UGUNST,
      ankeOmgjoerArsakNavn: 'Testårsak',
    },
  },
  readOnly: false,
  readOnlySubmitButton: false,
};

export const visPanelForResultatVedAvvis = args => (
  <AnkeResultatProsessIndex
    behandling={behandling}
    aksjonspunkter={aksjonspunkter}
    submitCallback={action('button-click')}
    saveAnke={action('button-click')}
    previewCallback={action('button-click')}
    previewVedtakCallback={action('button-click')}
    {...args}
  />
);

visPanelForResultatVedAvvis.args = {
  ankeVurdering: {
    ankeVurderingResultat,
  },
  readOnly: false,
  readOnlySubmitButton: false,
};

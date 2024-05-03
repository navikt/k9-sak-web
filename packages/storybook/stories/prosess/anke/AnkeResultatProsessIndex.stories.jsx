import { action } from '@storybook/addon-actions';
import { boolean, object, withKnobs } from '@storybook/addon-knobs';
import React from 'react';

import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@k9-sak-web/kodeverk/src/aksjonspunktStatus';
import ankeVurdering from '@k9-sak-web/kodeverk/src/ankeVurdering';
import ankeVurderingOmgjoer from '@k9-sak-web/kodeverk/src/ankeVurderingOmgjoer';
import AnkeResultatProsessIndex from '@k9-sak-web/prosess-anke-resultat';

import withReduxProvider from '../../../decorators/withRedux';

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
  decorators: [withKnobs, withReduxProvider],
};

export const visPanelForResultatVedStadfestYtelsesvedtak = () => (
  <AnkeResultatProsessIndex
    behandling={behandling}
    ankeVurdering={object('ankeVurdering', {
      ankeVurderingResultat: {
        ...ankeVurderingResultat,
        ankeVurdering: ankeVurdering.ANKE_STADFESTE_YTELSESVEDTAK,
      },
    })}
    aksjonspunkter={aksjonspunkter}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', false)}
    saveAnke={action('button-click')}
    previewCallback={action('button-click')}
    previewVedtakCallback={action('button-click')}
  />
);

export const visPanelForResultatVedOppheveOgHjemsende = () => (
  <AnkeResultatProsessIndex
    behandling={behandling}
    ankeVurdering={object('ankeVurdering', {
      ankeVurderingResultat: {
        ...ankeVurderingResultat,
        ankeVurdering: ankeVurdering.ANKE_OPPHEVE_OG_HJEMSENDE,
      },
    })}
    aksjonspunkter={aksjonspunkter}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', false)}
    saveAnke={action('button-click')}
    previewCallback={action('button-click')}
    previewVedtakCallback={action('button-click')}
  />
);

export const visPanelForResultatVedOmgjør = () => (
  <AnkeResultatProsessIndex
    behandling={behandling}
    ankeVurdering={object('ankeVurdering', {
      ankeVurderingResultat: {
        ...ankeVurderingResultat,
        ankeVurdering: ankeVurdering.ANKE_OMGJOER,
        ankeVurderingOmgjoer: ankeVurderingOmgjoer.ANKE_TIL_UGUNST,
        ankeOmgjoerArsakNavn: 'Testårsak',
      },
    })}
    aksjonspunkter={aksjonspunkter}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', false)}
    saveAnke={action('button-click')}
    previewCallback={action('button-click')}
    previewVedtakCallback={action('button-click')}
  />
);

export const visPanelForResultatVedAvvis = () => (
  <AnkeResultatProsessIndex
    behandling={behandling}
    ankeVurdering={object('ankeVurdering', {
      ankeVurderingResultat,
    })}
    aksjonspunkter={aksjonspunkter}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', false)}
    saveAnke={action('button-click')}
    previewCallback={action('button-click')}
    previewVedtakCallback={action('button-click')}
  />
);

import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';
import { action } from '@storybook/addon-actions';
import React from 'react';
import MenySettPaVentIndex from './MenySettPaVentIndex';

export default {
  title: 'sak/sak-meny-sett-pa-vent',
  component: MenySettPaVentIndex,
};

const promiseAction =
  msg =>
  (...args) => {
    action(msg)(...args);
    return Promise.resolve();
  };

export const visMenyForÅSetteBehandlingPåVent = () => (
  <MenySettPaVentIndex
    behandlingId={1}
    behandlingVersjon={2}
    settBehandlingPaVent={promiseAction('button-click')}
    ventearsaker={[
      {
        kode: venteArsakType.AVV_DOK,
        kodeverk: 'VENT_ARSAK_TYPE',
        navn: 'Avvent dokumentasjon',
      },
      {
        kode: venteArsakType.VENT_MANGL_FUNKSJ_SAKSBEHANDLER,
        kodeverk: 'VENT_ARSAK_TYPE',
        navn: 'Settes på vent av saksbehandler pga. manglende funksjonalitet i løsningen',
      },
    ]}
    lukkModal={action('button-click')}
    erTilbakekreving={false}
  />
);

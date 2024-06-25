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
    lukkModal={action('button-click')}
    erTilbakekreving={false}
  />
);

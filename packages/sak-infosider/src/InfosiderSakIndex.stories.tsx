import React from 'react';
import IngenBehandlingValgtPanel from './IngenBehandlingValgtPanel';

export default {
  title: 'sak/sak-infosider',
};

export const visPanelForBehandlingErIkkeValgt = () => <IngenBehandlingValgtPanel numBehandlinger={2} />;

export const visPanelForBehandlingerFinnesIkke = () => <IngenBehandlingValgtPanel numBehandlinger={0} />;

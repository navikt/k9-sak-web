import React from 'react';
import IngenBehandlingValgtPanel from './IngenBehandlingValgtPanel';
import UnauthorizedPage from './UnauthorizedPage';

export default {
  title: 'sak/sak-infosider',
};

export const visPanelForIkkeInnloggetBruker = () => <UnauthorizedPage />;

export const visPanelForBehandlingErIkkeValgt = () => <IngenBehandlingValgtPanel numBehandlinger={2} />;

export const visPanelForBehandlingerFinnesIkke = () => <IngenBehandlingValgtPanel numBehandlinger={0} />;

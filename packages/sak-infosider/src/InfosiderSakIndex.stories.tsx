import React from 'react';
import IngenBehandlingValgtPanel from './IngenBehandlingValgtPanel';
import NotFoundPage from './NotFoundPage';
import UnauthorizedPage from './UnauthorizedPage';

export default {
  title: 'sak/sak-infosider',
};

export const visPanelForSideIkkeFunnet = () => <NotFoundPage />;

export const visPanelForIkkeInnloggetBruker = () => <UnauthorizedPage />;

export const visPanelForBehandlingErIkkeValgt = () => <IngenBehandlingValgtPanel numBehandlinger={2} />;

export const visPanelForBehandlingerFinnesIkke = () => <IngenBehandlingValgtPanel numBehandlinger={0} />;

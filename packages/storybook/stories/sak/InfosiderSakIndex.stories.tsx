import React from 'react';

import { ForbiddenPage, IngenBehandlingValgtPanel, NotFoundPage, UnauthorizedPage } from '@k9-sak-web/sak-infosider';

import withRouterProvider from '../../decorators/withRouter';

export default {
  title: 'sak/sak-infosider',
  decorators: [withRouterProvider],
};

export const visPanelForHarIkkeTilgang = () => <ForbiddenPage />;

export const visPanelForSideIkkeFunnet = () => <NotFoundPage />;

export const visPanelForIkkeInnloggetBruker = () => <UnauthorizedPage />;

export const visPanelForBehandlingErIkkeValgt = () => <IngenBehandlingValgtPanel numBehandlinger={2} />;

export const visPanelForBehandlingerFinnesIkke = () => <IngenBehandlingValgtPanel numBehandlinger={0} />;

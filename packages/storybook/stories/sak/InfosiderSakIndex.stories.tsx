import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';

import { ForbiddenPage, NotFoundPage, UnauthorizedPage, IngenBehandlingValgtPanel } from '@k9-sak-web/sak-infosider';

import withRouterProvider from '../../decorators/withRouter';

export default {
  title: 'sak/sak-infosider',
  decorators: [withKnobs, withRouterProvider],
};

export const visPanelForHarIkkeTilgang = () => <ForbiddenPage />;

export const visPanelForSideIkkeFunnet = () => <NotFoundPage />;

export const visPanelForIkkeInnloggetBruker = () => <UnauthorizedPage />;

export const visPanelForBehandlingErIkkeValgt = () => <IngenBehandlingValgtPanel numBehandlinger={2} />;

export const visPanelForBehandlingerFinnesIkke = () => <IngenBehandlingValgtPanel numBehandlinger={0} />;

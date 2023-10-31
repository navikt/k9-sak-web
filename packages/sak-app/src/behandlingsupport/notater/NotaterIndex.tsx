import { LoadingPanel, requireProps } from '@fpsak-frontend/shared-components';
import Notater from '@k9-sak-web/sak-notat';
import { Fagsak, NavAnsatt } from '@k9-sak-web/types';
import React from 'react';

interface OwnProps {
  navAnsatt: NavAnsatt;
  fagsak: Fagsak;
}

/**
 * NotaterIndex
 *
 * Container komponent. Har ansvar for å vise notater i saken.
 */
export const NotaterIndex = ({ fagsak, navAnsatt }: OwnProps) => (
  <Notater
    fagsakId={fagsak.saksnummer}
    navAnsatt={navAnsatt}
    fagsakHarPleietrengende={!!fagsak.pleietrengendeAktørId}
  />
);

export default requireProps(['fagsak'], <LoadingPanel />)(NotaterIndex);

import { LoadingPanel, requireProps } from '@fpsak-frontend/shared-components';
import Notater from '@k9-sak-web/sak-notat';
import { FagsakPerson, NavAnsatt } from '@k9-sak-web/types';
import React from 'react';

interface OwnProps {
  saksnummer: string;
  behandlingId?: number;
  behandlingVersjon?: number;
  fagsakPerson?: FagsakPerson;
  navAnsatt: NavAnsatt;
}

const EMPTY_ARRAY = [];

/**
 * NotaterIndex
 *
 * Container komponent. Har ansvar for å vise notater i saken.
 */
export const NotaterIndex = ({ saksnummer, navAnsatt }: OwnProps) => (
  <Notater fagsakId={saksnummer} navAnsatt={navAnsatt} />
);

export default requireProps(['saksnummer'], <LoadingPanel />)(NotaterIndex);

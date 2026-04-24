import { type ReactNode } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import type { Fagsak } from '../Fagsak';
import FagsakProfile from './components/FagsakProfile';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
  },
  cache,
);

interface OwnProps {
  saksnummer: string;
  fagsakYtelseType: Fagsak['sakstype'];
  fagsakStatus: string;
  renderBehandlingMeny: () => ReactNode;
  renderBehandlingVelger: () => ReactNode;
}

const FagsakProfilSakIndex = ({
  saksnummer,
  fagsakYtelseType,
  fagsakStatus,
  renderBehandlingMeny,
  renderBehandlingVelger,
}: OwnProps) => (
  <RawIntlProvider value={intl}>
    <FagsakProfile
      saksnummer={saksnummer}
      fagsakYtelseType={fagsakYtelseType}
      fagsakStatus={fagsakStatus}
      renderBehandlingMeny={renderBehandlingMeny}
      renderBehandlingVelger={renderBehandlingVelger}
    />
  </RawIntlProvider>
);

export default FagsakProfilSakIndex;

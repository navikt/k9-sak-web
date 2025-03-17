import { type FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { type ReactNode } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
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
  fagsakYtelseType: FagsakYtelsesType;
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

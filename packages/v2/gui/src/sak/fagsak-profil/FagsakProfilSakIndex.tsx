import { type FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { type ReactNode } from 'react';
import FagsakProfile from './components/FagsakProfile';

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
      <FagsakProfile
      saksnummer={saksnummer}
      fagsakYtelseType={fagsakYtelseType}
      fagsakStatus={fagsakStatus}
      renderBehandlingMeny={renderBehandlingMeny}
      renderBehandlingVelger={renderBehandlingVelger}
    />);

export default FagsakProfilSakIndex;

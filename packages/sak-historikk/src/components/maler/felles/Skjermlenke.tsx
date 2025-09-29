import { Kodeverk } from '@k9-sak-web/types';
import { BodyShort, Link } from '@navikt/ds-react';
import { Location } from 'history';
import { NavLink } from 'react-router';
import { scrollUp } from './historikkUtils';

interface SkjermlenkeProps {
  skjermlenke?: Kodeverk;
  behandlingLocation?: Location;
  getKodeverknavn?: (kodeverkObjekt: Kodeverk, undertype?: string) => string;
  scrollUpOnClick?: boolean;
  createLocationForSkjermlenke: (behandlingLocation: Location, skjermlenkeKode: string) => Location;
}

const Skjermlenke = ({
  skjermlenke,
  behandlingLocation,
  getKodeverknavn,
  scrollUpOnClick,
  createLocationForSkjermlenke,
}: SkjermlenkeProps) => {
  if (!skjermlenke) {
    return null;
  }
  return (
    <BodyShort size="small">
      <Link
        variant="action"
        as={NavLink}
        to={createLocationForSkjermlenke(behandlingLocation, skjermlenke.kode)}
        onClick={scrollUpOnClick ? scrollUp : undefined}
      >
        {getKodeverknavn?.(skjermlenke)}
      </Link>
    </BodyShort>
  );
};

export default Skjermlenke;

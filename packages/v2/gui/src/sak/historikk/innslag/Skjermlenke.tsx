import type { FC } from 'react';
import type { Location } from 'history';
import { createPathForSkjermlenke } from '../../../utils/skjermlenke/createPathForSkjermlenke.js';
import { NavLink } from 'react-router';
import { Link } from '@navikt/ds-react';
import type { SkjermlenkeMedNavn } from '../api/HistorikkBackendApi.js';

type SkjermlenkeProps = Readonly<{
  skjermlenke: SkjermlenkeMedNavn;
  behandlingLocation: Location;
  inlineText?: boolean;
}>;

const scrollUp = (): void => {
  if (window.innerWidth < 1305) {
    window.scroll(0, 0);
  }
};

export const Skjermlenke: FC<SkjermlenkeProps> = ({ skjermlenke, behandlingLocation, inlineText = false }) => {
  const location = createPathForSkjermlenke(behandlingLocation, skjermlenke.type);
  return (
    <Link inlineText={inlineText} as={NavLink} to={location} onClick={scrollUp}>
      {skjermlenke.navn}
    </Link>
  );
};

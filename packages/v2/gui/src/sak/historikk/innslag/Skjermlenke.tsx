import type { SkjermlenkeObjekt } from '@k9-sak-web/backend/combined/behandling/historikk/SkjermlenkeObjekt.js';
import type { FC } from 'react';
import type { Location } from 'history';
import { createPathForSkjermlenke } from '../../../utils/skjermlenke/createPathForSkjermlenke.js';
import { scrollUp } from '../snakkeboble/snakkebobleUtils.js';
import { NavLink } from 'react-router';
import { Link } from '@navikt/ds-react';

type SkjermlenkeProps = Readonly<{
  skjermlenke: SkjermlenkeObjekt;
  behandlingLocation: Location;
  inlineText?: boolean;
}>;

export const Skjermlenke: FC<SkjermlenkeProps> = ({ skjermlenke, behandlingLocation, inlineText = false }) => {
  const location = createPathForSkjermlenke(behandlingLocation, skjermlenke.kilde);
  return (
    <Link inlineText={inlineText} as={NavLink} to={location} onClick={scrollUp}>
      {skjermlenke.navn}
    </Link>
  );
};

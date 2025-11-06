import type { SkjermlenkeType } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/SkjermlenkeType.js';
import type { FC } from 'react';
import type { Location } from 'history';
import { createPathForSkjermlenke } from '../../../utils/skjermlenke/createPathForSkjermlenke.js';
import { scrollUp } from '../snakkeboble/snakkebobleUtils.js';
import { NavLink } from 'react-router';
import { Link } from '@navikt/ds-react';

type SkjermlenkeMedNavn = Readonly<{
  type: SkjermlenkeType;
  navn: string;
}>;

type SkjermlenkeProps = Readonly<{
  skjermlenke: SkjermlenkeMedNavn;
  behandlingLocation: Location;
  inlineText?: boolean;
}>;

export const Skjermlenke: FC<SkjermlenkeProps> = ({ skjermlenke, behandlingLocation, inlineText = false }) => {
  const location = createPathForSkjermlenke(behandlingLocation, skjermlenke.type);
  return (
    <Link inlineText={inlineText} as={NavLink} to={location} onClick={scrollUp}>
      {skjermlenke.navn}
    </Link>
  );
};

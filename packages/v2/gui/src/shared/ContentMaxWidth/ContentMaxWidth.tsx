import { K9MaxTextWidth } from '@k9-sak-web/gui/tokens/tokens.js';
import { Box } from '@navikt/ds-react';
import { type ReactNode } from 'react';

interface OwnProps {
  children: ReactNode | ReactNode[];
  className?: string;
}

/*
 * En wrapper for å enkelt bruke samme maksbredde på tvers av komponenter
 * og ulike Aksel komponenter.
 *
 * Flere steder i løsningen vil vi ønske å bruke samme maksbredde på innhold som
 * f.eks. Alert eller et aksjonspunkt da for stor plass gjør setningene veldig
 * lange og dermed vanskeligere å lese.
 *
 * 43.5rem er hentet fra Aksel, i Alert komponenten som hardkodet maksbredde.
 */
const ContentMaxWidth = ({ className, children }: OwnProps) => (
  <Box.New className={className} maxWidth={K9MaxTextWidth}>
    {children}
  </Box.New>
);

export default ContentMaxWidth;

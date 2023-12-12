import React from 'react';

import { Heading, BodyShort } from '@navikt/ds-react';
import { PersonPencilFillIcon } from '@navikt/aksel-icons';

import styles from './begrunnelseBoks.css';

interface BegrunnelseBoksProps {
  begrunnelse: string;
  saksbehandler: string | undefined;
  dato: string | undefined;
}

const BegrunnelseBoks: React.FC<BegrunnelseBoksProps> = ({ begrunnelse, saksbehandler, dato }) => (
  <div className={styles.begrunnelseBoks}>
    <Heading size="xsmall">Begrunnelse</Heading>
    <BodyShort size="small" className={styles.begrunnelseTekst}>
      {begrunnelse}
    </BodyShort>

    {saksbehandler && dato && (
      <div className={styles.begrunnelseFooter}>
        <PersonPencilFillIcon title="Saksbehandlerikon" fontSize="1.5rem" />
        <span>
          Vurdering av {saksbehandler}, {dato}
        </span>
      </div>
    )}
  </div>
);

export default BegrunnelseBoks;

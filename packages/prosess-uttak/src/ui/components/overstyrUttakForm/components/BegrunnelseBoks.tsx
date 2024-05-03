import React from 'react';

import { useSaksbehandlerOppslag } from '@k9-sak-web/shared-components';
import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading } from '@navikt/ds-react';

import { OverstyringUttak } from '../../../../types';
import { useOverstyrUttak } from '../../../context/OverstyrUttakContext';

import { arbeidstypeTilVisning } from '../../../../constants/Arbeidstype';
import styles from './begrunnelseBoks.module.css';

interface BegrunnelseBoksProps {
  begrunnelse: string;
  overstyring: OverstyringUttak;
}

const BegrunnelseBoks: React.FC<BegrunnelseBoksProps> = ({ begrunnelse, overstyring }) => {
  const { utbetalingsgrader, saksbehandler } = overstyring;
  const { utledAktivitetNavn } = useOverstyrUttak();
  const { hentSaksbehandlerNavn } = useSaksbehandlerOppslag();
  return (
    <div className={styles.begrunnelseBoks}>
      {utbetalingsgrader.length > 0 && (
        <>
          <Heading level="3" size="xsmall">
            Ny utbetalingsgrad per aktivitet
          </Heading>
          <div className={styles.utbetalingsgrader}>
            {utbetalingsgrader.map(utbetalingsgrad => {
              const arbeidstype = arbeidstypeTilVisning[utbetalingsgrad.arbeidsforhold.type];
              const { arbeidsforhold: af } = utbetalingsgrad;
              return (
                <div
                  key={`${af.arbeidsforholdId || af.aktørId || af.orgnr || af.type}`}
                  className={styles.utbetalingsgrad}
                >
                  <div className={styles.utbetalingsgradNavn}>
                    {utledAktivitetNavn(utbetalingsgrad.arbeidsforhold)}
                    {arbeidstype && <span>, {arbeidstype}</span>}
                  </div>
                  <div className={styles.utbetalingsgradProsent}>{utbetalingsgrad.utbetalingsgrad} %</div>
                </div>
              );
            })}
          </div>
        </>
      )}
      <Heading size="xsmall">Begrunnelse</Heading>
      <BodyShort size="small" className={styles.begrunnelseTekst}>
        {begrunnelse}
      </BodyShort>

      {saksbehandler && (
        <div className={styles.begrunnelseFooter}>
          <PersonPencilFillIcon title="Saksbehandlerikon" fontSize="1.5rem" />
          <span>Vurdering av {hentSaksbehandlerNavn(saksbehandler)}</span>
        </div>
      )}
    </div>
  );
};

export default BegrunnelseBoks;

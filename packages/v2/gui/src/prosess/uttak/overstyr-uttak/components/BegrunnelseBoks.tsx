import React from 'react';
import { Heading, BodyShort } from '@navikt/ds-react';
import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { useSaksbehandlerOppslag } from '@k9-sak-web/gui/shared/hooks/useSaksbehandlerOppslag.js';
import { utledAktivitetNavn } from '../../utils/overstyringUtils';
import type {
  k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto as ArbeidsgiverOversiktDto,
  k9_sak_kontrakt_uttak_overstyring_OverstyrUttakPeriodeDto as OverstyrUttakPeriodeDto,
} from '@k9-sak-web/backend/k9sak/generated';
import styles from './begrunnelseBoks.module.css';

interface BegrunnelseBoksProps {
  begrunnelse: string;
  overstyring: OverstyrUttakPeriodeDto;
  arbeidsgivere: ArbeidsgiverOversiktDto['arbeidsgivere'];
}

const BegrunnelseBoks: React.FC<BegrunnelseBoksProps> = ({ begrunnelse, overstyring, arbeidsgivere }) => {
  const { utbetalingsgrader, saksbehandler } = overstyring;
  const { hentSaksbehandlerNavn } = useSaksbehandlerOppslag();
  return (
    <div className={styles.begrunnelseBoks}>
      {utbetalingsgrader && utbetalingsgrader.length > 0 && (
        <>
          <Heading level="3" size="xsmall">
            Ny utbetalingsgrad per aktivitet
          </Heading>
          <div className={styles.utbetalingsgrader}>
            {utbetalingsgrader.map(utbetalingsgrad => {
              const arbeidstype = utbetalingsgrad.arbeidsforhold.type;
              const { arbeidsforhold: af } = utbetalingsgrad;
              return (
                <div
                  key={`${af.arbeidsforholdId || af.aktørId || af.orgnr || af.type}`}
                  className={styles.utbetalingsgrad}
                >
                  <div className={styles.utbetalingsgradNavn}>
                    {utledAktivitetNavn(utbetalingsgrad.arbeidsforhold, arbeidsgivere)}
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

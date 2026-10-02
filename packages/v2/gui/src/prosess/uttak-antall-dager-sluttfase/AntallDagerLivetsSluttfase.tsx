import { useSuspenseQuery } from '@tanstack/react-query';
import { BodyShort, Box, Heading } from '@navikt/ds-react';
import { formatDate } from '../../utils/formatters.js';
import { useUttakApi } from '../uttak/api/UttakApiContext.js';
import { uttakQueryOptions } from '../uttak/api/uttakQueryOptions.js';
import styles from './antallDagerLivetsSluttfase.module.css';
import { Fremdriftslinje } from './Fremdriftslinje.js';

const MAX_ANTALL_DAGER = 60;

interface AntallDagerLivetsSluttfaseProps {
  behandlingUuid: string;
  behandlingVersjon: number;
}

export const AntallDagerLivetsSluttfase = ({ behandlingUuid, behandlingVersjon }: AntallDagerLivetsSluttfaseProps) => {
  const api = useUttakApi();
  const { data: uttak } = useSuspenseQuery(uttakQueryOptions(api, behandlingUuid, behandlingVersjon));
  const kvoteInfo = uttak?.uttaksplan?.kvoteInfo;

  if (!kvoteInfo) {
    return null;
  }

  const totaltForbruktKvote = kvoteInfo.totaltForbruktKvote ?? 0;
  const antallDagerGjenstar = MAX_ANTALL_DAGER - totaltForbruktKvote;

  /*
   * Når totalt antall forbrukte dager er 60 eller mindre, vises de som grønn pølse
   * Om totalt antall forbrukte dager er over 60, vises de som oransje/gul pølse
   */
  const antallForbrukteDagerInnenforKvote = totaltForbruktKvote <= MAX_ANTALL_DAGER ? totaltForbruktKvote : 0;
  const antallForbrukteDagerVedOverforbruk = totaltForbruktKvote > MAX_ANTALL_DAGER ? MAX_ANTALL_DAGER : 0;

  return (
    <div className={styles.antallDagerLivetsSluttfaseContainer}>
      <div className={styles.header}>
        <Heading size="medium" level="2">
          Uttak av pleiepenger
        </Heading>
        {kvoteInfo.maxDato && (
          <div className={styles.sistePleiedagBoks}>
            <BodyShort size="large">
              <b>Siste pleiedag:</b> {formatDate(kvoteInfo.maxDato)}
            </BodyShort>
          </div>
        )}
      </div>
      <Box marginBlock="space-16 space-4">
        <Fremdriftslinje
          max={MAX_ANTALL_DAGER}
          totalBreddeProsent={100}
          antallGrønnBar={antallForbrukteDagerInnenforKvote}
          antallGulBar={antallForbrukteDagerVedOverforbruk}
        />
      </Box>
      <BodyShort>
        {totaltForbruktKvote > 0 && (
          <>
            <b>
              {totaltForbruktKvote} av {MAX_ANTALL_DAGER} dager
            </b>{' '}
            forbrukt.
          </>
        )}
        {antallDagerGjenstar > 0 && (
          <>
            {' '}
            <b>{antallDagerGjenstar} dager</b> gjenstår etter denne behandlingen.
          </>
        )}
      </BodyShort>
    </div>
  );
};

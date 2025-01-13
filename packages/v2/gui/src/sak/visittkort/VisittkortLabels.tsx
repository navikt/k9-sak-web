import { formatDate } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { Tag, Tooltip } from '@navikt/ds-react';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import diskresjonskodeType from './types/diskresjonskodeType';
import type { Personopplysninger } from './types/Personopplysninger';
import styles from './visittkortLabels.module.css';

interface OwnProps {
  personopplysninger?: Personopplysninger;
  harTilbakekrevingVerge?: boolean;
}

const VisittkortLabels = ({ personopplysninger, harTilbakekrevingVerge = false }: OwnProps) => {
  const erSokerUnder18 = useMemo(
    () => personopplysninger && dayjs().diff(personopplysninger.fodselsdato, 'years') < 18,
    [personopplysninger],
  );
  const harVerge = personopplysninger
    ? personopplysninger.harVerge && !personopplysninger.dodsdato
    : harTilbakekrevingVerge;
  return (
    <>
      {personopplysninger && personopplysninger.dodsdato && (
        <Tooltip content="Personen er død" placement="bottom">
          <Tag variant="info" className={styles.etikett}>
            {`DØD ${formatDate(personopplysninger.dodsdato)}`}
          </Tag>
        </Tooltip>
      )}
      {personopplysninger &&
        personopplysninger.diskresjonskode === diskresjonskodeType.KODE6 &&
        !personopplysninger.dodsdato && (
          <Tooltip content="Personen har diskresjonsmerking kode 6" placement="bottom">
            <Tag variant="error" className={styles.etikett}>
              Kode 6
            </Tag>
          </Tooltip>
        )}
      {personopplysninger &&
        personopplysninger.diskresjonskode === diskresjonskodeType.KODE7 &&
        !personopplysninger.dodsdato && (
          <Tooltip content="Personen har diskresjonsmerking kode 7" placement="bottom">
            <Tag variant="warning" className={styles.etikett}>
              Kode 7
            </Tag>
          </Tooltip>
        )}
      {harVerge && (
        <Tooltip content="Personen har verge" placement="bottom">
          <Tag variant="info" className={styles.etikett}>
            Verge
          </Tag>
        </Tooltip>
      )}
      {personopplysninger && erSokerUnder18 && (
        <Tooltip content="Personen er under 18 år" placement="bottom">
          <Tag variant="info" className={styles.etikett}>
            Under 18
          </Tag>
        </Tooltip>
      )}
    </>
  );
};

export default VisittkortLabels;

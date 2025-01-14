import { formatDate } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { Tag, Tooltip, type TagProps, type TooltipProps } from '@navikt/ds-react';
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
  const erSøkerUnder18 = useMemo(
    () => personopplysninger && dayjs().diff(personopplysninger.fodselsdato, 'years') < 18,
    [personopplysninger],
  );
  const harVerge = personopplysninger
    ? personopplysninger.harVerge && !personopplysninger.dodsdato
    : harTilbakekrevingVerge;

  const erKode6 = personopplysninger?.diskresjonskode === diskresjonskodeType.KODE6 && !personopplysninger.dodsdato;
  const ersKode7 = personopplysninger?.diskresjonskode === diskresjonskodeType.KODE7 && !personopplysninger.dodsdato;

  const renderTag = (content: string, variant: TagProps['variant'], tooltipContent: TooltipProps['content']) => (
    <Tooltip content={tooltipContent} placement="bottom">
      <Tag variant={variant} className={styles.etikett}>
        {content}
      </Tag>
    </Tooltip>
  );

  return (
    <>
      {personopplysninger?.dodsdato &&
        renderTag(`DØD ${formatDate(personopplysninger.dodsdato)}`, 'info', 'Personen er død')}
      {erKode6 && renderTag('Kode 6', 'error', 'Personen har diskresjonsmerking kode 6')}
      {ersKode7 && renderTag('Kode 7', 'warning', 'Personen har diskresjonsmerking kode 7')}
      {harVerge && renderTag('Verge', 'info', 'Personen har verge')}
      {erSøkerUnder18 && renderTag('Under 18', 'info', 'Personen er under 18 år')}
    </>
  );
};

export default VisittkortLabels;

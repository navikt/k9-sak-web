import { Alert } from '@navikt/ds-react';
import { type FC } from 'react';
import styles from './infostripe.module.css';
import { useUttakContext } from '../../context/UttakContext';
import { k9_kodeverk_behandling_FagsakYtelseType as FagsakYtelseType } from '@k9-sak-web/backend/k9sak/generated/types.js';

const Infostripe: FC = () => {
  const { erSakstype } = useUttakContext();

  return (
    <div className={styles['infostripe']}>
      <Alert size="small" variant="warning">
        Det er nødvendig med mer informasjon fra andre saker før dette steget kan fullføres.
        <ol className={styles['infostripe__punktliste']}>
          <li>
            Åpne alle behandlinger tilknyttet
            {erSakstype(FagsakYtelseType.PLEIEPENGER_NÆRSTÅENDE) ? 'pleietrengende' : 'barnet'} og behandle de til
            uttakssteget.
          </li>
          <li>
            Oppdater siden (Ctrl+R). Gå til saken som nå har kommet forbi uttak, behandle videre og beslutt, før neste
            sak behandles.
          </li>
        </ol>
      </Alert>
    </div>
  );
};

export default Infostripe;

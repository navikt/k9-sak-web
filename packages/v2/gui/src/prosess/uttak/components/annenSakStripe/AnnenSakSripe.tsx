import { Alert } from '@navikt/ds-react';
import React from 'react';
import styles from './annenSakStripe.module.css';

interface AnneAnnenSakStripeProps {
  harVentAnnenPSBSakAksjonspunkt: boolean;
  erFagytelsetypeLivetsSluttfase: boolean;
}

const AnnenSakStripe: React.FC<AnneAnnenSakStripeProps> = ({
  harVentAnnenPSBSakAksjonspunkt,
  erFagytelsetypeLivetsSluttfase,
}) => {
  if (!harVentAnnenPSBSakAksjonspunkt) {
    return null;
  }

  return (
    <div className={styles.infostripe}>
      <Alert size="small" variant="warning">
        Det er nødvendig med mer informasjon fra andre saker før dette steget kan fullføres.
        <ol className={styles.infostripePunktliste}>
          <li>
            Åpne alle behandlinger tilknyttet {erFagytelsetypeLivetsSluttfase ? 'pleietrengende' : 'barnet'} og behandle
            de til uttakssteget.
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

export default AnnenSakStripe;

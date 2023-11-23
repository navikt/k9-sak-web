import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import React from 'react';
import styles from './infostripe.css';
import ContainerContext from '../../context/ContainerContext';

interface InfostripeProps {
  harVentAnnenPSBSakAksjonspunkt: boolean;
}

const Infostripe: React.FC<InfostripeProps> = ({ harVentAnnenPSBSakAksjonspunkt }) => {
  const { erFagytelsetypeLivetsSluttfase } = React.useContext(ContainerContext);

  if (!harVentAnnenPSBSakAksjonspunkt) {
    return null;
  }

  return (
    <div className={styles.infostripe}>
      <AlertStripeAdvarsel>
        Det er nødvendig med mer informasjon fra andre saker før dette steget kan fullføres.
        <ol className={styles.infostripe__punktliste}>
          <li>
            Åpne alle behandlinger tilknyttet {erFagytelsetypeLivetsSluttfase ? 'pleietrengende' : 'barnet'} og behandle
            de til uttakssteget.
          </li>
          <li>
            Oppdater siden (Ctrl+R). Gå til saken som nå har kommet forbi uttak, behandle videre og beslutt, før neste
            sak behandles.
          </li>
        </ol>
      </AlertStripeAdvarsel>
    </div>
  );
};

export default Infostripe;

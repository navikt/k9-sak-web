import React from 'react';
import styles from './opplysningerFraSoknad.module.css';

interface Props {
  årsak?: string;
  beskrivelse?: string;
  periodeTekst: string;
  periode?: string;
}

const OpplysningerFraSoknad: React.FunctionComponent<Props> = ({ årsak, beskrivelse, periode, periodeTekst }) => (
  <div className={styles.opplysningerFraSoknad}>
    <div>Opplysninger fra søknaden:</div>
    {typeof årsak !== 'undefined' && årsak.length > 0 && (
      <>
        <h4>Oppgitt årsak</h4>
        <p>{årsak}</p>
      </>
    )}

    {typeof beskrivelse !== 'undefined' && beskrivelse.length > 0 && (
      <>
        <h4>Beskrivelse</h4>
        <p className={styles.begrunnelseContainer}>{beskrivelse}</p>
      </>
    )}

    {typeof periode !== 'undefined' && periode.length > 0 && (
      <>
        <h4>{periodeTekst}</h4>
        <p>{periode}</p>
      </>
    )}
  </div>
);
export default OpplysningerFraSoknad;

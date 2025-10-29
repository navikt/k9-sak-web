import React from 'react';

import Feilikon from '../icons/Feilikon';
import Suksessikon from '../icons/Suksessikon';

import styles from './AldersvilkarStatus.module.css';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';

interface AldersVilkarAPProps {
  vilkarOppfylt: boolean;
  vilkarReferanse: string;
  periode: string;
  begrunnelse: string;
}

const AldersVilkarStatus = ({
  vilkarOppfylt,
  vilkarReferanse,
  periode,
  begrunnelse,
  intl,
}: AldersVilkarAPProps & WrappedComponentProps) => (
  <>
    <div className={styles.vilkarStatusOverskrift}>
      {vilkarOppfylt ? <Suksessikon /> : <Feilikon />}
      <h2 className={styles.aksjonspunktNavn}>
        Aldersvilkår
      </h2>
      <p className={styles.vilkar}>
        <Lovreferanse>{vilkarReferanse}</Lovreferanse>
      </p>
    </div>
    <p className={styles.vilkarStatus}>
      {vilkarOppfylt
        ? "Vilkåret er oppfylt"
        : "Vilkåret er ikke oppfylt"}
    </p>

    {periode && (
      <>
        <p className={styles.begrunnelseOverskrift}>Periode</p>
        <p className={styles.fritekst}>{periode}</p>
      </>
    )}

    {begrunnelse && (
      <>
        <p className={styles.begrunnelseOverskrift}>Vurdering</p>
        <p className={`${styles.fritekst} ${styles.begrunnelse}`}>{begrunnelse}</p>
      </>
    )}
  </>
);

export default injectIntl(AldersVilkarStatus);

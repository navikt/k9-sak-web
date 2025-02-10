import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import { Detail, Heading, HStack } from '@navikt/ds-react';
import Feilikon from '../icons/Feilikon';
import Suksessikon from '../icons/Suksessikon';
import styles from './AldersvilkarStatus.module.css';

interface AldersVilkarAPProps {
  vilkarOppfylt: boolean;
  vilkarReferanse?: string;
  periode?: string;
  begrunnelse: string;
}

const AldersVilkarStatus = ({ vilkarOppfylt, vilkarReferanse, periode, begrunnelse }: AldersVilkarAPProps) => (
  <>
    <HStack gap="4">
      {vilkarOppfylt ? <Suksessikon /> : <Feilikon />}
      <Heading size="small" level="2">
        Aldersvilkår
      </Heading>
      {vilkarReferanse && (
        <Detail className={styles.vilkar}>
          <Lovreferanse>{vilkarReferanse}</Lovreferanse>
        </Detail>
      )}
    </HStack>
    <p className={styles.vilkarStatus}>{vilkarOppfylt ? 'Vilkåret er oppfylt' : 'Vilkåret er ikke oppfylt'}</p>

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

export default AldersVilkarStatus;

import { useMemo } from 'react';

import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { Aksjonspunkt, Kodeverk } from '@k9-sak-web/types';

import styles from './margMarkering.module.css';

interface OwnProps {
  behandlingStatus: Kodeverk;
  aksjonspunkter: Aksjonspunkt[];
  isReadOnly: boolean;
  visAksjonspunktMarkering?: boolean;
  children: any;
  noBorder: boolean;
}

const MargMarkering = ({
  behandlingStatus,
  aksjonspunkter,
  isReadOnly,
  visAksjonspunktMarkering = true,
  children,
  noBorder,
}: OwnProps) => {
  const prosesspunktStyles = `${styles.prosesspunkt} ${noBorder ? styles.prosesspunktNoBorder : ''}`;
  if (aksjonspunkter.length === 0) {
    return <div className={prosesspunktStyles}>{children}</div>;
  }

  const ikkeAkseptertAvBeslutter =
    behandlingStatus.kode === BehandlingStatus.BEHANDLING_UTREDES &&
    aksjonspunkter[0].toTrinnsBehandling &&
    aksjonspunkter[0].toTrinnsBehandlingGodkjent === false;

  const harApnentAksjonspunktSomKanLoses = useMemo(
    () => aksjonspunkter.some(ap => isAksjonspunktOpen(ap.status.kode) && ap.kanLoses),
    [aksjonspunkter],
  );
  const visAksjonspunkt = visAksjonspunktMarkering && harApnentAksjonspunktSomKanLoses && !isReadOnly;

  return (
    <div
      className={`${prosesspunktStyles}${ikkeAkseptertAvBeslutter ? ` ${styles.ikkeAkseptertAvBeslutter}` : ''}${visAksjonspunkt ? ` ${styles.visAksjonspunkt}` : ''}`}
    >
      {children}
    </div>
  );
};

export default MargMarkering;

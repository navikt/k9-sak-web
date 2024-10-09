import classnames from 'classnames/bind';
import React, { useMemo } from 'react';

import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { Aksjonspunkt } from '@k9-sak-web/types';

import styles from './margMarkering.module.css';

const classNames = classnames.bind(styles);

interface OwnProps {
  behandlingStatus: string;
  aksjonspunkter: Aksjonspunkt[];
  isReadOnly: boolean;
  visAksjonspunktMarkering?: boolean;
  children: any;
}

const MargMarkering = ({
  behandlingStatus,
  aksjonspunkter,
  isReadOnly,
  visAksjonspunktMarkering = true,
  children,
}: OwnProps) => {
  if (aksjonspunkter.length === 0) {
    return <div className={styles.prosesspunkt}>{children}</div>;
  }

  const ikkeAkseptertAvBeslutter =
    behandlingStatus === BehandlingStatus.BEHANDLING_UTREDES &&
    aksjonspunkter[0].toTrinnsBehandling &&
    aksjonspunkter[0].toTrinnsBehandlingGodkjent === false;

  const harApnentAksjonspunktSomKanLoses = useMemo(
    () => aksjonspunkter.some(ap => isAksjonspunktOpen(ap.status) && ap.kanLoses),
    [aksjonspunkter],
  );
  const visAksjonspunkt = visAksjonspunktMarkering && harApnentAksjonspunktSomKanLoses && !isReadOnly;

  return <div className={classNames('prosesspunkt', { ikkeAkseptertAvBeslutter, visAksjonspunkt })}>{children}</div>;
};

export default MargMarkering;

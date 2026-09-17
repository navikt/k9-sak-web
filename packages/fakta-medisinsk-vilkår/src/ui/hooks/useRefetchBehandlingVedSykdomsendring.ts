import { useRefetchBehandling } from '@k9-sak-web/gui/context/BehandlingContext.js';
import { isAksjonspunktOpen } from '@k9-sak-web/gui/utils/aksjonspunktUtils.js';
import React from 'react';
import ContainerContext from '../context/ContainerContext';

/**
 * Når sykdomsdata endres mens aksjonspunkt 9001 allerede er utført (UTFO), vil
 * backend rulle tilbake behandlingen og inkrementere versjonsnummeret. Vi må
 * derfor refetche behandlingen slik at frontend er i sync med ny versjon.
 */
const useRefetchBehandlingVedSykdomsendring = (): (() => void) => {
  const { medisinskVilkårAksjonspunkt } = React.useContext(ContainerContext);
  const refetchBehandling = useRefetchBehandling();

  return () => {
    if (!isAksjonspunktOpen(medisinskVilkårAksjonspunkt?.status.kode)) {
      void refetchBehandling();
    }
  };
};

export default useRefetchBehandlingVedSykdomsendring;

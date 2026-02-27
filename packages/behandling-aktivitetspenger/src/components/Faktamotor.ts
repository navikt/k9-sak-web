import { ung_sak_kontrakt_behandling_BehandlingDto } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { FaktaMenyPanel } from '@k9-sak-web/gui/behandling/fakta/FaktaMeny.js';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { UngSakApi } from '../data/UngSakApi';
import { aksjonspunkterQueryOptions, vilkårQueryOptions } from '../data/ungSakQueryOptions';

interface FaktamotorProps {
  api: UngSakApi;
  behandling: Pick<ung_sak_kontrakt_behandling_BehandlingDto, 'uuid' | 'versjon'>;
}

export const useFaktamotor = ({ api, behandling }: FaktamotorProps): FaktaMenyPanel[] => {
  const { data: vilkår } = useSuspenseQuery(vilkårQueryOptions(api, behandling));
  const { data: aksjonspunkter } = useSuspenseQuery(aksjonspunkterQueryOptions(api, behandling));
  return useMemo(() => {
    const testPanel = {
      tekst: 'Medlemskap',
      urlKode: 'medlemskapsvilkaaret',
      harAksjonspunkt: false,
    };
    const testPanel2 = {
      tekst: 'Beregning',
      urlKode: 'beregning',
      harAksjonspunkt: false,
    };
    return [testPanel, testPanel2];
  }, []);
};

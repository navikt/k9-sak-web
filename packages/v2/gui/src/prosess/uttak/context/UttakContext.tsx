import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  type AksjonspunktDtoDefinisjon,
  type AksjonspunktDto,
  type ArbeidsgiverOversiktDto,
  type BehandlingDto,
  type BehandlingDtoSakstype,
  type Uttaksplan,
  type UttaksplanMedUtsattePerioder,
} from '@k9-sak-web/backend/k9sak/generated';
import type BehandlingUttakBackendClient from '../BehandlingUttakBackendClient';
export type UttakContextType = {
  behandling: Pick<BehandlingDto, 'uuid' | 'id' | 'versjon' | 'status' | 'sakstype'>;
  uttak: UttaksplanMedUtsattePerioder;
  uttaksperioder: Uttaksplan | undefined;
  uttakApi: BehandlingUttakBackendClient;
  perioderTilVurdering: string[];
  hentBehandling?: (params?: any, keepData?: boolean) => Promise<BehandlingDto>;
  harEtUløstAksjonspunktIUttak: boolean;
  erOverstyrer: boolean;
  aksjonspunktForOverstyringAvUttak: AksjonspunktDto | undefined;
  aksjonspunktVurderOverlappendeSaker: AksjonspunktDto | undefined;
  aksjonspunktVentAnnenPSBSak: AksjonspunktDto | undefined;
  aksjonspunktVurderDatoNyRegelUttak: AksjonspunktDto | undefined;
  readOnly: boolean;
  oppdaterBehandling: () => void;
  virkningsdatoUttakNyeRegler: string | undefined;
  setRedigervirkningsdato: React.Dispatch<React.SetStateAction<boolean>>;
  arbeidsgivere: ArbeidsgiverOversiktDto['arbeidsgivere'] | undefined;
};

export const UttakContext = createContext<UttakContextType | undefined>(undefined);

export const useUttakContext = () => {
  const uttakContext = useContext(UttakContext);

  if (uttakContext === undefined) {
    throw new Error('useUttakContext must be used within a UttakProvider');
  }

  const {
    aksjonspunktForOverstyringAvUttak,
    aksjonspunktVurderOverlappendeSaker,
    aksjonspunktVentAnnenPSBSak,
    aksjonspunktVurderDatoNyRegelUttak,
    behandling,
    uttakApi,
  } = uttakContext;

  const { data: arbeidsgivere, isLoading: lasterArbeidsgivere } = useQuery<ArbeidsgiverOversiktDto['arbeidsgivere']>({
    queryKey: ['arbeidsgivere', behandling.uuid],
    queryFn: async () => {
      // await new Promise(resolve => setTimeout(resolve, 10000)); // bare for testing
      const arbeidsgivere = await uttakApi.getArbeidsgivere(behandling.uuid);
      return arbeidsgivere.arbeidsgivere ?? {};
    },
    enabled: !!behandling.uuid,
  });

  const sakstype = uttakContext?.behandling.sakstype;

  function erSakstype(type: BehandlingDtoSakstype | BehandlingDtoSakstype[] | undefined): boolean {
    if (Array.isArray(type)) {
      return type.includes(sakstype);
    }
    return sakstype === type;
  }

  function harAksjonspunkt(kode: AksjonspunktDtoDefinisjon): boolean {
    if (aksjonspunktForOverstyringAvUttak?.definisjon === kode) return true;
    if (aksjonspunktVurderOverlappendeSaker?.definisjon === kode) return true;
    if (aksjonspunktVentAnnenPSBSak?.definisjon === kode) return true;
    if (aksjonspunktVurderDatoNyRegelUttak?.definisjon === kode) return true;
    return false;
  }

  return { ...uttakContext, sakstype, erSakstype, arbeidsgivere, harAksjonspunkt, lasterArbeidsgivere };
};
